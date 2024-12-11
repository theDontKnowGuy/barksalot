import { useContext } from "react"
import { SelectedLocationContext } from "./SelectedLocationContext"

export const useSelectedLocationContext = () => {
	const selectedLocationContext = useContext(SelectedLocationContext)

	if (!selectedLocationContext) {
		throw new Error("useSelectedLocationContext must be used within a selectedLocationProvider")
	}

	return selectedLocationContext
}

import { ReactNode } from "react"
import { LocationProp } from "../../types"

export interface SelectedLocationContextInterface {
	selectedLocation: LocationProp | null
	changeSelectedLocation: (location: LocationProp) => void
}

export interface SelectedLocationProviderProps {
	children: ReactNode
}

import { FC, useState } from "react"
import { SelectedLocationProviderProps } from "./SelectedLocationTypes"
import { SelectedLocationContext } from "./SelectedLocationContext"
import { LocationProp } from "../../types"

export const SelectedLocationProvider: FC<SelectedLocationProviderProps> = ({ children }) => {
	const [selectedLocation, setSelectedLocation] = useState<LocationProp | null>(null)

	const changeSelectedLocation = (location: LocationProp) => {
		setSelectedLocation(location)
	}

	return <SelectedLocationContext.Provider value={{ selectedLocation, changeSelectedLocation }}>{children}</SelectedLocationContext.Provider>
}

import { createContext } from "react"
import { SelectedLocationContextInterface } from "./SelectedLocationTypes"

export const SelectedLocationContext = createContext<SelectedLocationContextInterface | null>(null)

import Swal from "sweetalert2"
import api from "../../api"
import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { LocationProp, WeatherLocationProp } from "../../../types"

export const useGetCurrentWeather = (locationId: LocationProp["id"], dateInMillies: Date): [WeatherLocationProp, Dispatch<SetStateAction<WeatherLocationProp>>] => {
	const [weatherLocation, setWeatherLocation] = useState<WeatherLocationProp>({ realFeel: 0, humidity: 0, temperature: 0, date: "" })

	useEffect(() => {
		;(async () => {
			try {
				setWeatherLocation(await api.weather().getCurrent(locationId, dateInMillies))
			} catch (error: unknown) {
				Swal.fire("יש בעיה", "לא הצלחנו לקבל את הפוסטים", "error")
			}
		})()
	}, [])

	return [weatherLocation, setWeatherLocation]
}

// הכנסתי לקובץ האחרון אובייקט ריק של מזג אויר למרות שזה לא טוב, חשבתי שזב יעזור
