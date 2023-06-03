import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { useContext } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import { InfoContext } from '../components/ContextProvider.js';
import axios from 'axios';
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
	Colors,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import './ForecastPage.css';
import { API_KEY } from '../config';

const FAHRENHEIT_UNIT = 'imperial';
const CELSIUS_UNIT = 'metric';

ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
	Colors
);

ChartJS.defaults.color = 'snow';
ChartJS.defaults.font.size = 16;
ChartJS.defaults.font.weight = 700;

const ForecastPage = () => {
	const context = useContext(InfoContext);
	const [city, setCity] = useState(context.city);
	const [tempUnit, setTempUnit] = useState(context.tempUnit);
	const [data24Hours, setData24Hours] = useState(null);
	const [currentData, setCurrentData] = useState(null);

    const [searchedCity, setSearchedCity] = useState('');
	const [cityData, setCityData] = useState({});
	const [cityDateTime, setCityDateTime] = useState({});

    let currentTimeInterval = 0;

    const HARDCODED_SEARCHED_CITIES = [
        'New York',
        'Portland',
        'Chicago',
        'Florida',
    ];

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

    const getLocalCityTime = (offset) => {
		try {
			const now = new Date();
			const utcOffset = now.getTimezoneOffset() * 60; // Convert minutes to seconds
			const cityOffset = offset;
			const localTime = now.getTime() + (utcOffset + cityOffset) * 1000; // Multiply by 1000 to convert seconds to milliseconds
			const cityTime = new Date(localTime);
			const datetimeObject = {};
			datetimeObject.date = cityTime.toLocaleDateString('en-us', {
				weekday: 'long',
				year: 'numeric',
				month: 'short',
				day: 'numeric',
			});
			datetimeObject.time = cityTime.toLocaleTimeString([], {
				hour: '2-digit',
				minute: '2-digit',
			});
			setCityDateTime(datetimeObject);
		} catch (err) {
			console.log(err);
			alert(`Unable to get current time for ${city} city`);
		}
	};
	
	const [recentlySearch, setRecentlySearch] = useState(
		HARDCODED_SEARCHED_CITIES
	);
	

	useEffect(() => {
		getCityData(city);
	}, [city]);

	useEffect(() => {
		currentTimeInterval = setInterval(() => {
			getLocalCityTime(cityData.timezone);
		}, 30000);
		return () => clearInterval(currentTimeInterval);
	}, [cityData]);

	useEffect(() => {
		getCityData(city);
	}, [tempUnit]);

	useEffect(() => {
		getCurrentCityData(city);
		getDatafor24Hours(city);
	}, [tempUnit]);

	const changeToCelciusUnit = (event) => {
		event.preventDefault();
		event.stopPropagation();
		setTempUnit(CELSIUS_UNIT);
		context.changeTempUnit(CELSIUS_UNIT);
	};

	const changeToFahrenheitUnit = (event) => {
		event.preventDefault();
		event.stopPropagation();
		setTempUnit(FAHRENHEIT_UNIT);
		context.changeTempUnit(FAHRENHEIT_UNIT);
	};

	const getCurrentCityData = (city) => {
		const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=${tempUnit}`;
		axios
			.get(url)
			.then((response) => {
				console.log('getCurrentCityData response: ', response.data);
				setCurrentData(response.data);
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
            getCurrentCityData(searchedCity);
            getDatafor24Hours(searchedCity);
			context.setSearchedCity(searchedCity);
			const cityData = await getCityData(searchedCity);
			setCityData(cityData);
		} catch (err) {
			console.log(err);
			window.alert('ERROR: ', err.message);
		}
	};

    const handleSearchSubmit = (event) => {
		if (event.key === 'Enter') {
			console.log('SEARCHING FOR CITY: ', searchedCity);
            getCurrentCityData(searchedCity);
            getDatafor24Hours(searchedCity);
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

	const getDatafor24Hours = async (searchedCity) => {
		const url = `https://api.openweathermap.org/data/2.5/forecast?q=${searchedCity}&appid=${API_KEY}&units=${tempUnit}&cnt=8`;
		let response = await axios.get(url);
		console.log('getDatafor24Hours response: ', response.data);
		setData24Hours(response.data);
	};

    const getHoursLabel = (list) => {
        let label = [];
        list.forEach(data => {
            let tempHours = new Date((data.dt * 1000)).toLocaleTimeString([], {
				hour: '2-digit'
			});
            label.push(tempHours);
        })
        label.unshift("Now");
        return label;
    }

    const getMaxTemp24Hours = (list, currentData) => {
        let maxtempList = [];
        list.forEach(data => {
            maxtempList.push(data.main.temp_max);
        })
        maxtempList.unshift(currentData?.main?.temp_max);
        return maxtempList;
    }

    const getMinTemp24Hours = (list, currentData) => {
        let mintempList = [];
        list.forEach(data => {
            mintempList.push(data.main.temp_min);
        })
        mintempList.unshift(currentData?.main?.temp_min);
        return mintempList;
    }

	const renderLineChart = () => {
		const options = {
			plugins: {
				legend: {
					position: 'top',
				},
				colors: {
					enabled: true,
				},
			},
			scales: {
				x: {
					color: 'snow', // Set the color for the x-axis labels,
					grid: {
						color: 'rgba(255, 250, 250, 0.2)', // Set the color for vertical grid lines
					},
					border: {
						display: true,
					},
				},
				y: {
					color: 'snow', // Set the color for the y-axis labels, // Set the color for the x-axis labels,
					grid: {
						color: 'rgba(255, 250, 250, 0.2)', // Set the color for vertical grid lines
					},
                    beginAtZero: true // Begin the y-axis at zero
				},
			},
			layout: {
				padding: 0,
			},
			responsive: true,
		};

		const labels = getHoursLabel(data24Hours.list);
		const data = {
			labels,
			datasets: [
				{
					label: 'max temperature',
					borderWidth: 2, // Set the line width
					data: getMaxTemp24Hours(data24Hours.list, currentData),
					borderColor: 'rgb(255, 99, 132)',
					backgroundColor: 'rgba(255, 99, 132, 0.5)',
				},
				{
					label: 'min temperature',
					borderWidth: 2, // Set the line width
					data: getMinTemp24Hours(data24Hours.list, currentData),
					borderColor: 'rgb(53, 162, 235)',
					backgroundColor: 'rgba(53, 162, 235, 0.5)',
				},
			],
		};
		return <Line data={data} options={options} />;
	};

	return (
		<div className="forecastPage">
			<div>
				{/* <input type="search" placeholder="Search" className="search" /> */}
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

			<div className="degreeUnits">
				<p className="degreeUnit" onClick={changeToCelciusUnit}>
					&deg;C
				</p>

				<p className="degreeUnit" onClick={changeToFahrenheitUnit}>
					&deg;F
				</p>
			</div>

			<div className="minmaxTempForecast">
                <div className="graphLabel">Min Max Temperature Graph for the next 24 Hours</div>
                {data24Hours && renderLineChart()}
            </div>
            <div className='hourlyData'>
            {data24Hours && Array.isArray(data24Hours.list) && data24Hours.list.map((data, index) => (
            <div key={index} className='each3hours'>
            <h2 className='timeDisplay'>{`${getHoursLabel(data24Hours.list)[index]}`}</h2>
            <img src={`https://openweathermap.org/img/wn/${data24Hours.list[index].weather[0].icon}.png`} />
            <h2 className='timeDisplay'>{data24Hours.list[index].weather[0].main}</h2>
            </div>
            ))}
            </div>
		</div>
	);
};

export default ForecastPage;
