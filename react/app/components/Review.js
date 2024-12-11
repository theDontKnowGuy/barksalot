import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import Stars from './Stars'

function Review(props) {
  const date = new Date(props.review.createdDate)
  const dateFormatted = `${date.getDay()}/${date.getMonth() + 1}/${date.getFullYear()}`
  return (
    <Link onClick={props.onClick} to={`/review/${props.review._id}`} className="list-group-item list-group-item-action">
      <img className="avatar-tiny" src={props.review.author.avatar} /> <strong> {props.review.title}</strong>
      <Stars stars={props.review.stars} size="small" />

      <span className="text-muted small">
        {' '}
        {!props.noAuthor && <>by {props.review.author.username}</>} on {dateFormatted}{' '}
      </span>
      <span className="text-muted small"> score {props.review.stars}</span>
    </Link>
  )
}

export default Review