import React, { useEffect } from "react"
import "./Stars.css"

function Stars(props) {


    return (
        <div className="card">
            <label htmlFor="stars" >
                {Array.from({ length: 5 }, (_, index) => (
                    <span
                        onClick={props.handleUpdate ? () => props.handleUpdate(index + 1) : null}
                        key={index} id={index + 1}
                        className={`star ` + (index < props.stars ? "selected" : "notSelected") + " " + (props.size ? "small-size" : "")} >★
                    </span>
                ))}
            </label>
        </div >

    )
}

export default Stars
