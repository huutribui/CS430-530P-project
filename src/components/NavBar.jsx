import React from 'react';
import { useNavigate } from 'react-router-dom';
import './NavBar.css';

const NavBar = ({ isDarkTheme, toggleTheme }) => {
	const navigate = useNavigate();

	const handleHomePageClick = (event) => {
		event.preventDefault();
		navigate('/');
	};

	const handleForecastClick = (event) => {
		event.preventDefault();
		navigate('/forecast');
	};

	const handleAboutUsClick = (event) => {
		event.preventDefault();
		navigate('/aboutUs');
	};

	return (
		<div>
			<nav class="navbar navbar-expand-lg bg-body-tertiary navBarContainer bg-dark">
				<div class="container-fluid">
					<a
						class="navbar-brand navbarLogoLightTheme navbarLeft"
						onClick={handleHomePageClick}
					>
						Weather Forecast
					</a>
					<button
						class="navbar-toggler bg-secondary"
						type="button"
						data-bs-toggle="collapse"
						data-bs-target="#navbarSupportedContent"
						aria-controls="navbarSupportedContent"
						aria-expanded="false"
						aria-label="Toggle navigation"
					>
						<span class="navbar-toggler-icon"></span>
					</button>
					<div
						class="collapse navbar-collapse bg-dark"
						id="navbarSupportedContent"
					>
						<ul class="navbar-nav me-auto mb-2 mb-lg-0">
							<li class="nav-item">
								<a
									class="nav-link active navbarTextLightTheme"
									aria-current="page"
									onClick={handleHomePageClick}
								>
									Home
								</a>
							</li>
							<li class="nav-item">
								<a
									class="nav-link active navbarTextLightTheme"
									aria-current="page"
									onClick={handleForecastClick}
								>
									Forecast Details
								</a>
							</li>
							<li class="nav-item">
								<a
									class="nav-link navbarTextLightTheme"
									onClick={handleAboutUsClick}
								>
									About Us
								</a>
							</li>
							<li className='nav-item'>
							<button className="theme-toggle-button" onClick={toggleTheme}>
							<a 
							   className="nav-link navbarTextLightTheme" 
							   onClick={toggleTheme}
							>
                             Change Theme
							 </a>
                            </button>
							</li>
							
						</ul>
					</div>
				</div>
			</nav>
		</div>
	);
};

export default NavBar;
