import React, { useEffect, useState, useContext } from "react"
import { useNavigate } from 'react-router-dom'
import Page from "./Page"
import Axios from "axios"
import DispatchContext from "../DispatchContext"
import StateContext from "../StateContext"

function CreateReview(props) {
  const [title, setTitle] = useState()
  const [body, setBody] = useState()
  const [stars, setStars] = useState()
  const [movie, setMovie] = useState()
  const [reaction, setReaction] = useState()

  const navigate = useNavigate()
  const appDispatch = useContext(DispatchContext)
  const appState = useContext(StateContext)

  async function handleSubmit(e) {
    e.preventDefault()
    console.log(title, body, stars, movie, reaction);
    try {
      const response = await Axios.post("/create-review", { title, body, stars, movie, reaction, token: appState.user.token })
      // Redirect to new review url
      appDispatch({ type: "flashMessage", value: "Congrats, you created a new review." })
      navigate(`/review/${response.data}`)
      console.log("New review was created.")
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <Page title="Create New Review">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="review-title" className="text-muted mb-1">
            <small>Title</small>
          </label>
          <input onChange={e => setTitle(e.target.value)} autoFocus name="title" id="review-title" className="form-control form-control-lg form-control-title" type="text" placeholder="" autoComplete="off" />
        </div>

        <div className="form-group">
          <label htmlFor="review-body" className="text-muted mb-1 d-block">
            <small>Body Content</small>
          </label>
          <textarea onChange={e => setBody(e.target.value)} name="body" id="review-body" className="body-content tall-textarea form-control" type="text"></textarea>
        </div>

        <div className="form-group">
          <label htmlFor="review-body" className="text-muted mb-1 d-block">
            <small>Stars</small>
          </label>
          <textarea onChange={e => setStars(parseInt(e.target.value))} name="stars" id="review-stars" className="body-content  form-control" type="number"></textarea>
        </div>

        <div className="form-group">
          <label htmlFor="review-movie" className="text-muted mb-1 d-block">
            <small>Movie</small>
          </label>
          <textarea onChange={e => setMovie(parseInt(e.target.value))} name="movie" id="review-movie" className="body-content  form-control" type="number"></textarea>
        </div>

        <div className="form-group">
          <label htmlFor="review-reaction" className="text-muted mb-1 d-block">
            <small>Reaction</small>
          </label>
          <textarea onChange={e => setReaction(parseInt(e.target.value))} name="reaction" id="review-reaction" className="body-content form-control" type="number"></textarea>
        </div>

        <button className="btn btn-primary">Save New Review</button>
      </form>
    </Page>
  )
}

export default CreateReview
