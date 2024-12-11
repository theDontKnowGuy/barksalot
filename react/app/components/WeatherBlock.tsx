import React from "react"
import "./WeatherBlock.css"
import { WeatherLocationProp } from "../../types"

interface WeatherBlockProps {
	weather: WeatherLocationProp
}

export const WeatherBlock = () =>
	// ({ weather }: WeatherBlockProps) =>
	{
		const weather: WeatherLocationProp = {
			realFeel: 30.463523310644874,
			humidity: 14.650347168073047,
			temperature: 32.77089642513675,
			date: "1970-01-01T00:00:00.123Z",
		}

		return (
			<div className="card m-auto justify-content-center align-items-center">
				{weather.temperature < 40 ? <i className="h1 bi bi-lightning-fill lightning-icon mt-5" aria-hidden="true"></i> : weather.temperature <= 30 ? <i className="h1 bi bi-cloud-fill cloud-icon mt-5"></i> : <i className="h1 bi bi-sun-fill sun-icon mt-5"></i>}
				<div className="card-body">
					<h2 className="ml-5 mr-5 card-title">{Math.round(weather.temperature)}°C</h2>

					<div className="d-flex mt-4 justify-content-between">
						<i className="p-1 mt-3 bi bi-thermometer-half" aria-hidden="true"></i>
						<strong className="p-1 mr-4 ml-4 mt-3">מרגיש כמו</strong>
						<strong className="p-1 mt-3">{Math.round(weather.realFeel)}°C</strong>
					</div>

					<div className="d-flex justify-content-between">
						<i className="p-1 mt-3 bi bi-moisture" aria-hidden="true"></i>
						<strong className="p-1 ml-4 mr-3 mt-3">אחוזי לחות</strong>
						<strong className="p-1 mt-3">{Math.round(weather.humidity)}%</strong>
					</div>
				</div>
			</div>
		)
	}
