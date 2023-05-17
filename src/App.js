import './App.css';
import {
  BrowserRouter as Router,
  Routes as Switch,
  Route,
  Redirect,
} from "react-router-dom";
import Home from './pages/Home';
import ForecastPage from './pages/ForecastPage';
import AboutUs from './pages/AboutUs';
function App() {
  return (
    <div className="App">
      <Router>
          <Switch>
            <Route exact path="/" element={<Home/>} />
            <Route exact path="/forecast" element={<ForecastPage/>} />
            <Route exact path="/aboutUs" element={<AboutUs/>} />
          </Switch>
      </Router>
    </div>
  );
}

export default App;
