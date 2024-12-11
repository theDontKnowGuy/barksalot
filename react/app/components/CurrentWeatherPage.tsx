import React from "react"
import { WeatherBlock } from "./WeatherBlock"
import "./CurrentWeatherPage.css"
import { WeatherLocationProp } from "../../types"
import { useSelectedLocationContext } from "useSelectedLocationContext"
import { useGetCurrentWeather } from "useGetCurrentWeather"

export const CurrentWeatherPage = () => {
	const { selectedLocation } = useSelectedLocationContext()
	const [weather, setWeather] = useGetCurrentWeather(selectedLocation.id, new Date())

	// useEffect(() => {
	//   if (selectedLocation) {
	//     setWeather(useGetCurrentWeather(selectedLocation.id, new Date()));
	//   }
	// }, []);

	const currentWeather: WeatherLocationProp = {
		realFeel: 30.463523310644874,
		humidity: 14.650347168073047,
		temperature: 32.77089642513675,
		date: "1970-01-01T00:00:00.123Z",
	}

	return (
		<div id="main" style={{ backgroundImage: `url(${image})` }}>
			<img className="bg" src="../../assets/background.jpg"></img>
			<div className="container">
				<WeatherBlock currentWeather={currentWeather} />
			</div>
		</div>
	)
}
