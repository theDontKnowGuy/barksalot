import React, { useEffect, useState, useContext } from "react"
import { useImmerReducer } from "use-immer"
import Page from "./Page"
import { useParams, Link, useNavigate } from "react-router-dom"
import Axios from "axios"
import LoadingDotsIcon from "./LoadingDotsIcon"
import StateContext from "../StateContext"
import DispatchContext from "../DispatchContext"
import NotFound from "./NotFound"
import Stars from "./Stars"

function EditReview(props) {
  const navigate = useNavigate()
  const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)

  const originalState = {
    title: {
      value: "",
      hasErrors: false,
      message: ""
    },
    body: {
      value: "",
      hasErrors: false,
      message: ""
    },
    movie: {
      value: 0,
      hasErrors: false,
      message: ""
    },
    stars: {
      value: 0,
      hasErrors: false,
      message: ""
    },
    reaction: {
      value: 0,
      hasErrors: false,
      message: ""
    },
    isFetching: true,
    isSaving: false,
    id: useParams().id,
    sendCount: 0,
    notFound: false
  }

  function ourReducer(draft, action) {
    switch (action.type) {
      case "fetchComplete":
        draft.title.value = action.value.title
        draft.body.value = action.value.body
        draft.stars.value = action.value.stars
        draft.reaction.value = action.value.reaction
        draft.movie.value = action.value.movie
        draft.isFetching = false
        return
      case "titleChange":
        draft.title.hasErrors = false
        draft.title.value = action.value
        return
      case "bodyChange":
        draft.body.hasErrors = false
        draft.body.value = action.value
        return
      case "starsChange":
        draft.stars.hasErrors = false
        draft.stars.value = action.value
        return
      case "movieChange":
        draft.movie.hasErrors = false
        draft.movie.value = action.value
        return
      case "reactionChange":
        draft.reaction.hasErrors = false
        draft.reaction.value = action.value
        return
      case "submitRequest":
        if (!draft.title.hasErrors && !draft.body.hasErrors) {
          draft.sendCount++
        }
        return
      case "saveRequestStarted":
        draft.isSaving = true
        return
      case "saveRequestFinished":
        draft.isSaving = false
        return
      case "titleRules":
        if (!action.value.trim()) {
          draft.title.hasErrors = true
          draft.title.message = "You must provide a title."
        }
        return
      case "bodyRules":
        if (!action.value.trim()) {
          draft.body.hasErrors = true
          draft.body.message = "You must provide body content."
        }
      case "starsRules":
        if (!action.value) {
          draft.stars.hasErrors = true
          draft.stars.message = "You must provide stars content."
        }
      case "movieRules":
        if (!action.value) {
          draft.movie.hasErrors = true
          draft.movie.message = "You must provide movie content."
        }
      case "reactionRules":
        if (!action.value) {
          draft.reaction.hasErrors = true
          draft.reaction.message = "You must provide reaction content."
        }
        return
      case "notFound":
        draft.notFound = true
        return
    }
  }

  const [state, dispatch] = useImmerReducer(ourReducer, originalState)

  function submitHandler(e) {
    e.preventDefault()
    dispatch({ type: "titleRules", value: state.title.value })
    dispatch({ type: "bodyRules", value: state.body.value })
    dispatch({ type: "movieRules", value: state.movie.value })
    dispatch({ type: "starsRules", value: state.stars.value })
    dispatch({ type: "reactionRules", value: state.reaction.value })
    dispatch({ type: "submitRequest" })
  }

  useEffect(() => {
    const ourRequest = Axios.CancelToken.source()
    async function fetchReview() {
      try {
        const response = await Axios.get(`/review/${state.id}`, { cancelToken: ourRequest.token })
        if (response.data) {
          dispatch({ type: "fetchComplete", value: response.data })
          if (appState.user.username != response.data.author.username) {
            appDispatch({ type: "flashMessage", value: "You do not have permission to edit that review." })
            // redirect to homepage
            navigate("/")
          }
        } else {
          dispatch({ type: "notFound" })
        }
      } catch (e) {
        console.log("There was a problem or the request was cancelled.")
      }
    }
    fetchReview()
    return () => {
      ourRequest.cancel()
    }
  }, [])

  useEffect(() => {
    if (state.sendCount) {
      dispatch({ type: "saveRequestStarted" })
      const ourRequest = Axios.CancelToken.source()
      async function fetchReview() {
        try {
          const response = await Axios.post(`/review/${state.id}/edit`, { title: state.title.value, body: state.body.value, reaction: state.reaction.value, stars: state.stars.value, movie: state.movie.value, token: appState.user.token }, { cancelToken: ourRequest.token })
          dispatch({ type: "saveRequestFinished" })
          appDispatch({ type: "flashMessage", value: "Review was updated." })
        } catch (e) {
          console.log("There was a problem or the request was cancelled.")
        }
      }
      fetchReview()
      return () => {
        ourRequest.cancel()
      }
    }
  }, [state.sendCount])

  if (state.notFound) {
    return <NotFound />
  }

  if (state.isFetching)
    return (
      <Page title="...">
        <LoadingDotsIcon />
      </Page>
    )

  function updateStars(id) {
    dispatch({ type: "starsChange", value: id })
  }

  return (
    <Page title="Edit Review">
      <Link className="small font-weight-bold" to={`/review/${state.id}`}>
        &laquo; Back to review permalink
      </Link>

      <form className="mt-3" onSubmit={submitHandler}>
        <div className="form-group">
          <label htmlFor="review-title" className="text-muted mb-1">
            <small>Title</small>
          </label>
          <input onBlur={e => dispatch({ type: "titleRules", value: e.target.value })} onChange={e => dispatch({ type: "titleChange", value: e.target.value })} value={state.title.value} autoFocus name="title" id="review-title" className="form-control form-control-lg form-control-title" type="text" placeholder="" autoComplete="off" />
          {state.title.hasErrors && <div className="alert alert-danger small liveValidateMessage">{state.title.message}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="review-body" className="text-muted mb-1 d-block">
            <small>Body Content</small>
          </label>
          <textarea onBlur={e => dispatch({ type: "bodyRules", value: e.target.value })} onChange={e => dispatch({ type: "bodyChange", value: e.target.value })} name="body" id="review-body" className="body-content tall-textarea form-control" type="text" value={state.body.value} />
          {state.body.hasErrors && <div className="alert alert-danger small liveValidateMessage">{state.body.message}</div>}
        </div>


        <div className="form-group">
          <label htmlFor="review-stars" className="text-muted mb-1 d-block">
            <small>Stars</small>
          </label>
          <Stars stars={state.stars.value} size="small" handleUpdate={updateStars} />
        </div>

        <div className="form-group">
          <label htmlFor="review-movie" className="text-muted mb-1 d-block">
            <small>Movie</small>
          </label>
          <textarea onBlur={e => dispatch({ type: "movieRules", value: parseInt(e.target.value) })} onChange={e => dispatch({ type: "movieChange", value: e.target.value })} name="movie" id="review-movie" className="body-content  form-control" type="number" value={state.movie.value} />
          {state.movie.hasErrors && <div className="alert alert-danger small liveValidateMessage">{state.movie.message}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="review-reaction" className="text-muted mb-1 d-block">
            <small>Reaction</small>
          </label>
          <textarea onBlur={e => dispatch({ type: "reactionRules", value: parseInt(e.target.value) })} onChange={e => dispatch({ type: "reactionChange", value: e.target.value })} name="reaction" id="review-reaction" className="body-content  form-control" type="number" value={state.reaction.value} />
          {state.reaction.hasErrors && <div className="alert alert-danger small liveValidateMessage">{state.reaction.message}</div>}
        </div>

        <button className="btn btn-primary" disabled={state.isSaving}>
          Save Updates
        </button>
      </form>
    </Page>
  )
}

export default EditReview
