const Review = require("../models/Review")

exports.apiCreate = function (req, res) {
  let review = new Review(req.body, req.apiUser._id)
  review
    .create()
    .then(function (newId) {
      res.json(newId)
    })
    .catch(function (errors) {
      res.json(errors)
    })
}

exports.apiUpdate = function (req, res) {
  let review = new Review(req.body, req.apiUser._id, req.params.id)
  review
    .update()
    .then(status => {
      // the review was successfully updated in the database
      // or user did have permission, but there were validation errors
      if (status == "success") {
        res.json("success")
      } else {
        res.json("failure")
      }
    })
    .catch(e => {
      // a review with the requested id doesn't exist
      // or if the current visitor is not the owner of the requested review
      res.json("no permissions")
    })
}

exports.apiDelete = function (req, res) {
  Review.delete(req.params.id, req.apiUser._id)
    .then(() => {
      res.json("Success")
    })
    .catch(e => {
      res.json("You do not have permission to perform that action.")
    })
}

exports.search = function (req, res) {
  Review.search(req.body.searchTerm)
    .then(reviews => {
      res.json(reviews)
    })
    .catch(e => {
      res.json([])
    })
}

exports.reactApiViewSingle = async function (req, res) {
  try {
    let review = await Review.findSingleById(req.params.id, 0)
    res.json(review)
  } catch (e) {
    res.json(false)
  }
}
