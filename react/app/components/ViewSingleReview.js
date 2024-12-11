import React, { useEffect, useState, useContext } from "react"
import Page from "./Page"
import { useParams, Link, useNavigate } from "react-router-dom"
import Axios from "axios"
import LoadingDotsIcon from "./LoadingDotsIcon"
import ReactMarkdown from "react-markdown"
import ReactTooltip from "react-tooltip"
import NotFound from "./NotFound"
import StateContext from "../StateContext"
import DispatchContext from "../DispatchContext"
import Stars from "./Stars"

function ViewSingleReview(props) {
  const navigate = useNavigate()
  const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)
  const { id } = useParams()
  const [isLoading, setIsLoading] = useState(true)
  const [review, setReview] = useState()

  useEffect(() => {
    const ourRequest = Axios.CancelToken.source()

    async function fetchReview() {
      try {
        const response = await Axios.get(`/review/${id}`, { cancelToken: ourRequest.token })
        setReview(response.data)
        setIsLoading(false)
      } catch (e) {
        console.log("There was a problem or the request was cancelled.")
      }
    }
    fetchReview()
    return () => {
      ourRequest.cancel()
    }
  }, [id])

  if (!isLoading && !review) {
    return <NotFound />
  }

  if (isLoading)
    return (
      <Page title="...">
        <LoadingDotsIcon />
      </Page>
    )

  const date = new Date(review.createdDate)
  const dateFormatted = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`


  function isOwner() {
    if (appState.loggedIn) {
      return appState.user.username == review.author.username
    }
    return false
  }

  async function deleteHandler() {
    const areYouSure = window.confirm("Do you really want to delete this review?")
    if (areYouSure) {
      try {
        const response = await Axios.delete(`/review/${id}`, { data: { token: appState.user.token } })
        if (response.data == "Success") {
          // 1. display a flash message
          appDispatch({ type: "flashMessage", value: "Review was successfully deleted." })

          // 2. redirect back to the current user's profile
          navigate(`/profile/${appState.user.username}`)
        }
      } catch (e) {
        console.log("There was a problem.")
      }
    }
  }
  return (
    <Page title={review.title}>
      <div className="d-flex justify-content-between">
        <h2>{review.title}</h2>
        {isOwner() && (
          <span className="pt-2">
            <Link to={`/review/${review._id}/edit`} data-tip="Edit" data-for="edit" className="text-primary mr-2">
              <i className="fas fa-edit"></i>
            </Link>
            <ReactTooltip id="edit" className="custom-tooltip" />{" "}
            <a onClick={deleteHandler} data-tip="Delete" data-for="delete" className="delete-review-button text-danger">
              <i className="fas fa-trash"></i>
            </a>
            <ReactTooltip id="delete" className="custom-tooltip" />
          </span>
        )}
      </div>

      <p className="text-muted small mb-4">
        <Link to={`/profile/${review.author.username}`}>
          <img className="avatar-tiny" src={review.author.avatar} />
        </Link>
        Reviewed by <Link to={`/profile/${review.author.username}`}>{review.author.username}</Link> on {dateFormatted}
      </p>
      <Stars stars={review.stars} />
      <div className="body-content">
        <ReactMarkdown children={review.body} allowedElements={["p", "br", "strong", "em", "h1", "h2", "h3", "h4", "h5", "h6", "ul", "ol", "li"]} />
      </div>


    </Page>
  )
}

export default ViewSingleReview
