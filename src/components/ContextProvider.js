import React, { useEffect, useState } from 'react';

export const InfoContext = React.createContext();

const DEFAULT_CITY = 'Portland';
const FAHRENHEIT_UNIT = "imperial";
const CELSIUS_UNIT="metric";

const ContextProvider = ({ children }) => {
	const [city, setCity] = useState(DEFAULT_CITY);
    const [tempUnit, setTempUnit] = useState(FAHRENHEIT_UNIT);

    const changeTempUnit = (unit) => {
        setTempUnit(unit)
    }

	const setSearchedCity = (city) => {
		console.log('setSearchedCity', city);
		setCity(city);
	};

	return (
		<InfoContext.Provider
			value={{
				city: city,
                tempUnit: tempUnit,
				setSearchedCity: setSearchedCity,
                changeTempUnit: changeTempUnit
			}}
		>
			{children}
		</InfoContext.Provider>
	);
};

export default ContextProvider;
