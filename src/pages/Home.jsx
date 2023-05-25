import React, { useState } from 'react';
import { useContext } from 'react';
import { useEffect } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';
import './Home.css';
import { InfoContext } from '../components/ContextProvider.js';
import { API_KEY } from '../config';
import axios from 'axios';

const HARDCODED_SEARCHED_CITIES = [
	'New York',
	'Portland',
	'Chicago',
	'Florida',
];

const FAHRENHEIT_UNIT = 'imperial';
const CELSIUS_UNIT = 'metric';

const Home = () => {
	let currentTimeInterval = 0;
	const navigate = useNavigate();
	const context = useContext(InfoContext);
	const [city, setCity] = useState(context.city);
	const [recentlySearch, setRecentlySearch] = useState(
		HARDCODED_SEARCHED_CITIES
	);
	const [searchedCity, setSearchedCity] = useState('');
	const [cityData, setCityData] = useState({});
	const [tempUnit, setTempUnit] = useState(context.tempUnit);
	const [cityDateTime, setCityDateTime] = useState({});

	useEffect(() => {
		getCityData(city);
		currentTimeInterval = setInterval(() => {
			getLocalCityTime(cityData.timezone);
		},8000);
		return () => clearInterval(currentTimeInterval);
	}, [city]);

	useEffect(() => {
		getCityData(city);
	}, [tempUnit]);

	const changeToCelciusUnit = (event) => {
		event.preventDefault();
		event.stopPropagation();
		setTempUnit(CELSIUS_UNIT);
		context.changeTempUnit(CELSIUS_UNIT);
		console.log('tempUnit:', tempUnit);
		getCityData(city);
	};

	const changeToFahrenheitUnit = (event) => {
		event.preventDefault();
		event.stopPropagation();
		setTempUnit(FAHRENHEIT_UNIT);
		context.changeTempUnit(FAHRENHEIT_UNIT);
	};

	const getCityData = (city) => {
		const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=${tempUnit}`;
		axios
			.get(url)
			.then((response) => {
				console.log('response: ', response.data);
				setCityData(response.data);
				getLocalCityTime(response.data.timezone);
			})
			.catch((err) => {
				console.log('ERROR getCityData: ', err);
				alert("Error message getting city's data");
			});
		console.log('getCityData', city);
	};

	const handleSearchClick = async (event, searchedCity) => {
		event.preventDefault();
		try {
			setCity(searchedCity);
			context.setSearchedCity(searchedCity);
			const cityData = await getCityData(searchedCity);
			setCityData(cityData);
		} catch (err) {
			console.log(err);
			window.alert('ERROR: ', err.message);
		}
	};

	const getLocalCityTime = (offset) => {
		try {
			const now = new Date();
			const utcOffset = now.getTimezoneOffset() * 60; // Convert minutes to seconds
			const cityOffset = offset;
			const localTime = now.getTime() + (utcOffset + cityOffset) * 1000; // Multiply by 1000 to convert seconds to milliseconds
			const cityTime = new Date(localTime);

			const datetimeObject = {};
			datetimeObject.date = cityTime.toLocaleDateString('en-us', { weekday:"long", year:"numeric", month:"short", day:"numeric"});
			datetimeObject.time = cityTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
			setCityDateTime(datetimeObject);
		} catch (err) {
			console.log(err);
			alert(`Unable to get current time for ${city} city`);
		}
	};

	const handleSearchSubmit = (event) => {
		if (event.key === 'Enter') {
			console.log('SEARCHING FOR CITY: ', searchedCity);
			context.setSearchedCity(searchedCity);
			setCity(searchedCity);
			getCityData(searchedCity);

			if (!recentlySearch.includes(searchedCity)) {
				setRecentlySearch([searchedCity, ...recentlySearch]);
			}
			setSearchedCity('');
		}
	};

	const handleSearchChange = (event) => {
		event.preventDefault();
		let searchedCity = event.target.value;
		setSearchedCity(searchedCity);
	};

	return (
		<div className="Home">
			<div className="searchBar">
				<div className="dropdown widthAdjustment">
					<input
						type="text"
						id="search"
						placeholder="Enter Location"
						className="searchInput"
						data-bs-toggle="dropdown"
						aria-expanded="false"
						value={searchedCity}
						onChange={handleSearchChange}
						onKeyDown={handleSearchSubmit}
					/>
					<ul className="dropdown-menu mt-2 widthAdjustmentDropdown bg-light">
						{recentlySearch.map((city) => (
							<li
								className="dropdown-item"
								value={city}
								key={city}
								onClick={(event) => handleSearchClick(event, city)}
							>
								{city}
							</li>
						))}
					</ul>
				</div>
				<label htmlFor="search">
					<SearchIcon alt="searchIcon" className="searchIcon" />
				</label>
			</div>
			<div className="degreeUnits">
				<p className="degreeUnit" onClick={changeToCelciusUnit}>
					&deg;C
				</p>

				<p className="degreeUnit" onClick={changeToFahrenheitUnit}>
					&deg;F
				</p>
			</div>
			<div className="localDateTime">
				<p className="datetimeLocal">{cityDateTime.date}</p>
				<p className="datetimeLocal">Local Time {cityDateTime.time}</p>
			</div>
			<div className="localDateTime">

			</div>
		</div>
	);
};

export default Home;
