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

    const extractHourData = (dates) => {

    }

    const getDatafor24Hours = async () => {
        const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=${tempUnit}&cnt=8`;
        let response = await axios.get(url);
        console.log("response: ", response.data);
    }

    useEffect(  () => {
        getDatafor24Hours();
    })

    return (
        <div>
        <div className='search'>
        <input type="search" placeholder="Search" className='ser'/>
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