import React, { useEffect, useState, useContext } from "react"
import Axios from "axios"
import { useParams, Link } from "react-router-dom"
import LoadingDotsIcon from "./LoadingDotsIcon"
import StateContext from "../StateContext"
import Review from "./Review"

function ProfileReviews(props) {
  const appState = useContext(StateContext)
  const { username } = useParams()
  const [isLoading, setIsLoading] = useState(true)
  const [reviews, setReviews] = useState([])

  useEffect(() => {
    const ourRequest = Axios.CancelToken.source()

    async function fetchReviews() {
      try {
        const response = await Axios.get(`/profile/${username}/reviews`, { cancelToken: ourRequest.token })
        setReviews(response.data)
        setIsLoading(false)
      } catch (e) {
        console.log("There was a problem.")
      }
    }
    fetchReviews()
    return () => {
      ourRequest.cancel()
    }
  }, [username])

  if (isLoading) return <LoadingDotsIcon />

  return (
    <div className="list-group">
      {reviews.length > 0 &&
        reviews.map(review => {
          return <Review noAuthor={true} review={review} key={review._id} />
        })}
      {reviews.length == 0 && appState.user.username == username && (
        <p className="lead text-muted text-center">
          You haven&rsquo;t created any reviews yet; <Link to="/create-review">create one now!</Link>
        </p>
      )}
      {reviews.length == 0 && appState.user.username != username && <p className="lead text-muted text-center">{username} hasn&rsquo;t created any reviews yet.</p>}
    </div>
  )
}

export default ProfileReviews
