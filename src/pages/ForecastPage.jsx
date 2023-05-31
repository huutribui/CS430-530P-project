import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { useContext } from 'react';
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

	useEffect(() => {
		getCurrentCityData(city);
		getDatafor24Hours();
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

	const getDatafor24Hours = async () => {
		const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=${tempUnit}&cnt=8`;
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
				<input type="search" placeholder="Search" className="search" />
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
            
		</div>
	);
};

export default ForecastPage;
