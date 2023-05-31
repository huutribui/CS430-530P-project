import React from 'react';
import {useState} from 'react';
import {useEffect} from 'react';
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
    Legend
);

const ForecastPage = () => {
    const context = useContext(InfoContext);
    const [city, setCity] = useState(context.city);
    const [tempUnit, setTempUnit] = useState(context.tempUnit);
    const [data24Hours, setData24Hours] = useState({});
    const [currentData, setCurrentData] = useState({});

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
        console.log("getDatafor24Hours response: ", response.data);
        setData24Hours(response.data);
    }

    return (
        <div className="forecastPage">
        <div>
        <input type="search" placeholder="Search" className='search'/>
        </div>

        <div className="degreeUnits">
				<p className="degreeUnit" onClick={changeToCelciusUnit}>
					&deg;C
				</p>

				<p className="degreeUnit" onClick={changeToFahrenheitUnit}>
					&deg;F
				</p>
        </div>

        <div className="forecast-container">
         
        </div>
        <div className="forecast-container">
         
        </div>
        <div className="forecast-container">
         
        </div>
        </div>
    );
};

export default ForecastPage;