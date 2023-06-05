import './App.css';
import React, { useState } from 'react';
import {
	BrowserRouter as Router,
	Routes as Switch,
	Route,
	Redirect,
} from 'react-router-dom';
import Home from './pages/Home';
import ForecastPage from './pages/ForecastPage';
import AboutUs from './pages/AboutUs';
import NavBar from './components/NavBar';

function App() {
	const [isDarkTheme, setIsDarkTheme] = useState(false);

	const toggleTheme = () => {
	  setIsDarkTheme(!isDarkTheme);
	};
	return (
		<div className={`App ${isDarkTheme ? 'dark-theme' : 'light-theme'}`}>
      <Router>
        <NavBar isDarkTheme={isDarkTheme} toggleTheme={toggleTheme} />
				<div className='App-container'>
					<Switch>
						<Route exact path="/CS430-530P-project/" element={<Home />} />
						<Route exact path="/CS430-530P-project/forecast" element={<ForecastPage />} />
						<Route exact path="/CS430-530P-project/aboutUs" element={<AboutUs />} />
					</Switch>
				</div>
			</Router>
		</div>
	);
}

export default App;
