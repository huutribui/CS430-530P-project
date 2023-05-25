import './App.css';
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
	return (
		<div className="App">
			<Router>
				<NavBar />
				<div className='App-container'>
					<Switch>
						<Route exact path="/" element={<Home />} />
						<Route exact path="/forecast" element={<ForecastPage />} />
						<Route exact path="/aboutUs" element={<AboutUs />} />
					</Switch>
				</div>
			</Router>
		</div>
	);
}

export default App;
