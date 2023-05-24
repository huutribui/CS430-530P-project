import React, { useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';
import './Home.css';
const HARDCODED_SEARCHED_CITIES = [
	'New York',
	'Portland',
	'Chicago',
	'Florida',
];

const Home = () => {
	const navigate = useNavigate();
	const [city, setCity] = useState('');
	const [recentlySearch, setRecentlySearch] = useState(
		HARDCODED_SEARCHED_CITIES
	);

	const handleSearchClick = (event, searchedCity) => {
		event.preventDefault();
		try {
			console.log('searchedCity: ', searchedCity);
			setCity(city);
		} catch (err) {
			window.alert('ERROR: ', err.message);
		}
	};

	const handleSearchSubmit = (event) => {
		if (event.key === 'Enter') {
			console.log('SEARCHING FOR CITY: ', city);
			setCity('');
		}
	};

	const handleSearchChange = (event) => {
		event.preventDefault();
		let searchedCity = event.target.value;
		console.log('saerchedCity: ', searchedCity);
	};

	return (
		<div className="Home">
			<div className="searchBar">
				<div className="dropdown widthAdjustment">
					<input
						type="text"
						id="search"
						placeholder="Enter the City here"
						className="searchInput"
						data-bs-toggle="dropdown"
						aria-expanded="false"
						onChange={handleSearchChange}
						onKeyPress={handleSearchSubmit}
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
					<SearchIcon alt="searchIcon" className="searchIcon" />.
				</label>
			</div>
			<div></div>
		</div>
	);
};

export default Home;
