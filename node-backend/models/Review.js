const reviewsCollection = require('../db').db().collection('reviews')
const followsCollection = require('../db').db().collection('follows')
const ObjectId = require('mongodb').ObjectId
const { parse } = require('dotenv')
const User = require('./User')
const sanitizeHTML = require('sanitize-html')

reviewsCollection.createIndex({ title: 'text', body: 'text' })

let Review = function (data, userid, requestedReviewId) {
  this.data = data
  this.errors = []
  this.userid = userid
  this.requestedReviewId = requestedReviewId
}

Review.prototype.cleanUp = function () {
  if (typeof this.data.title != 'string') {
    this.data.title = ''
  }
  if (typeof this.data.stars != 'number') {
    this.data.stars = parseInt(this.data.stars) || 0
  }
  if (typeof this.data.movie != 'number') {
    this.data.movie = parseInt(this.data.movie) || 0
  }
  if (typeof this.data.reaction != 'number') {
    this.data.reaction = parseInt(this.data.reaction) || 0
  }
  if (typeof this.data.body != 'string') {
    this.data.body = ''
  }

  // get rid of any bogus properties
  this.data = {
    title: sanitizeHTML(this.data.title.trim(), { allowedTags: [], allowedAttributes: {} }),
    body: sanitizeHTML(this.data.body.trim(), { allowedTags: [], allowedAttributes: {} }),
    stars: this.data.stars,
    reaction: this.data.reaction,
    movie: this.data.movie,
    createdDate: new Date(),
    author: new ObjectId(this.userid),
  }
}

Review.prototype.validate = function () {
  if (this.data.title == '') {
    this.errors.push('You must provide a title.')
  }
  if (this.data.body == '') {
    this.errors.push('You must provide post content.')
  }
  if (this.data.stats == 0) {
    this.errors.push('You must provide a positive amount of stars.')
  }
  if (this.data.movie == 0) {
    this.errors.push('You must provide movie.')
  }
  if (this.data.reaction == 0) {
    this.errors.push('You must provide reaction.')
  }
}

Review.prototype.create = function () {
  return new Promise((resolve, reject) => {
    console.log(this.data)
    this.cleanUp()
    this.validate()
    if (!this.errors.length) {
      // save post into database
      reviewsCollection
        .insertOne(this.data)
        .then((info) => {
          resolve(info.insertedId)
        })
        .catch((e) => {
          this.errors.push('Please try again later.')
          reject(this.errors)
        })
    } else {
      reject(this.errors)
    }
  })
}

Review.prototype.update = function () {
  return new Promise(async (resolve, reject) => {
    try {
      let review = await Review.findSingleById(this.requestedReviewId, this.userid)
      if (review.isVisitorOwner) {
        // actually update the db
        let status = await this.actuallyUpdate()
        resolve(status)
      } else {
        reject()
      }
    } catch (e) {
      reject()
    }
  })
}

Review.prototype.actuallyUpdate = function () {
  return new Promise(async (resolve, reject) => {
    this.cleanUp()
    this.validate()
    if (!this.errors.length) {
      await reviewsCollection.findOneAndUpdate({ _id: new ObjectId(this.requestedReviewId) }, { $set: { title: this.data.title, body: this.data.body, stars: this.data.stars, movie: this.data.movie, reaction: this.data.reaction } })
      resolve('success')
    } else {
      resolve('failure')
    }
  })
}

Review.reusableReviewQuery = function (uniqueOperations, visitorId, finalOperations = []) {
  return new Promise(async function (resolve, reject) {
    let aggOperations = uniqueOperations
      .concat([
        { $lookup: { from: 'users', localField: 'author', foreignField: '_id', as: 'authorDocument' } },
        {
          $project: {
            title: 1,
            body: 1,
            stars: 1,
            movie: 1,
            reaction: 1,
            createdDate: 1,
            authorId: '$author',
            author: { $arrayElemAt: ['$authorDocument', 0] },
          },
        },
      ])
      .concat(finalOperations)

    let posts = await reviewsCollection.aggregate(aggOperations).toArray()

    // clean up author property in each post object
    posts = posts.map(function (post) {
      post.isVisitorOwner = post.authorId.equals(visitorId)
      post.authorId = undefined

      post.author = {
        username: post.author.username,
        avatar: new User(post.author, true).avatar,
      }

      return post
    })

    resolve(posts)
  })
}

Review.findSingleById = function (id, visitorId) {
  return new Promise(async function (resolve, reject) {
    if (typeof id != 'string' || !ObjectId.isValid(id)) {
      reject()
      return
    }

    let posts = await Review.reusableReviewQuery([{ $match: { _id: new ObjectId(id) } }], visitorId)

    if (posts.length) {
      resolve(posts[0])
    } else {
      reject()
    }
  })
}

Review.findByAuthorId = function (authorId) {
  return Review.reusableReviewQuery([{ $match: { author: authorId } }, { $sort: { createdDate: -1 } }])
}

Review.delete = function (postIdToDelete, currentUserId) {
  return new Promise(async (resolve, reject) => {
    try {
      let post = await Review.findSingleById(postIdToDelete, currentUserId)
      if (post.isVisitorOwner) {
        await reviewsCollection.deleteOne({ _id: new ObjectId(postIdToDelete) })
        resolve()
      } else {
        reject()
      }
    } catch (e) {
      reject()
    }
  })
}

Review.search = function (searchTerm) {
  return new Promise(async (resolve, reject) => {
    if (typeof searchTerm == 'string') {
      let posts = await Review.reusableReviewQuery([{ $match: { $text: { $search: searchTerm } } }], undefined, [{ $sort: { score: { $meta: 'textScore' } } }])
      resolve(posts)
    } else {
      reject()
    }
  })
}

Review.countReviewsByAuthor = function (id) {
  return new Promise(async (resolve, reject) => {
    let reviewCount = await reviewsCollection.countDocuments({ author: id })
    resolve(reviewCount)
  })
}

Review.getFeed = async function (id) {
  // create an array of the user ids that the current user follows
  let followedUsers = await followsCollection.find({ authorId: new ObjectId(id) }).toArray()
  followedUsers = followedUsers.map(function (followDoc) {
    return followDoc.followedId
  })

  // look for posts where the author is in the above array of followed users
  return Review.reusableReviewQuery([{ $match: { author: { $in: followedUsers } } }, { $sort: { createdDate: -1 } }])
}

module.exports = Review