/* This file contains the logic needed to (i) dictate the global configuration for this application, 
 * (ii) manage tracking watched stocks, and (iii) perform search queries (e.g., company name) to
 * a stock ticker which can be used to add a stock to the watchlist or view other information.
 * It uses HTTP requests and the Yahoo Finance API to translate between query and stock ticker.
 */

// Global configuration for the site. Currently uses my free API key, with a secondary in case the daily limit (250 queries) is exceeded in testing.
const config = {
	"API_KEY": "6275d7798e05124c7edc252fee413a3d",
	"OLD_API_KEYS": ["a747df4d95f57806e35885505f598726", "fba521b0dfb0de0f21bc57a0ab296ed5"]
}

// An empty list of currently watched tickers. 
// On page load, this is updated to match whatever is currently in local storage.
var watched = []; 


// Uses localStorage to store a list of watched ticker symbols offline. These helper
function watchTicker(ticker) {
	console.debug(`Watch ${ticker}`);

	if (watched.indexOf(ticker.toUpperCase()) == -1) {
		// if ticker not in watched array, append it
		watched.push(ticker.toUpperCase());
	}

	saveWatched();
}


function unwatchTicker(ticker) {
	console.debug(`Unwatch ${ticker}`);

	getWatched(); 
	let foundIndex = watched.indexOf(ticker.toUpperCase()); // get current index of ticker in array if present
	if (foundIndex != -1) { // if the ticker is in the array...
		watched.splice(foundIndex, 1); // remove the ticker from the array
	}

	saveWatched(); // and update the cached list
}


function getWatched() {
	// Updates and returns the global array of currently watched tickers.
	watched = JSON.parse(localStorage.getItem("watched"));

	return watched;
}


function saveWatched() {
	// Store the current global `watched` array in local storage.
	localStorage.setItem("watched", JSON.stringify(watched));
}


function isTickerWatched(ticker) {
	// returns true if the ticker is currently watched, else false.
	return (watched.indexOf(ticker.toUpperCase()) != -1);
}


function formatMoney(number, maxDigits=0) {
	// Helper function to format numbers as currency. The `currency` field could be used to 
	// specify other currency types besides USD. Max digits determines the amount of rounding to occur.
	let currency = "USD";
	return number.toLocaleString('en-US', { style: 'currency', currency: currency, maximumFractionDigits: maxDigits });
}


async function checkPrice (ticker) {
	// Get the current price for a specific tickers
	let result = await fetch(`https://financialmodelingprep.com/api/v3/quote/${ticker}?apikey=${config['API_KEY']}`).then((response) => {
		return response.json()
	});

	return result;
}


async function getHistoricPrices (ticker, days=30) {
	// Return the historic prices for a specific ticker. `days` is the number of recent days to include.
	let result = await fetch(`https://financialmodelingprep.com/api/v3/historical-price-full/${ticker}?serietype=line&timeseries=${days}&apikey=${config['API_KEY']}`)
	.then((response) => {
		return response.json();
	});

	console.log(result);

	return result;
}


async function queryTicker(query) { // Yahoo finance API lookup
	console.debug(`Query: ${query}`);

	let data = await fetch(`https://financialmodelingprep.com/api/v3/search?query=${query}&limit=5&exchange=NASDAQ&apikey=${config['API_KEY']}`).then((response) => {
		return response.json();
	}).catch((err) => {
		console.error(err);
		return null;
	});

	if (!data) return null; // if error, return null

	return data[0]['symbol'];
}


async function queryCompany(query) {
	// Generic search via name or ticker
	console.debug(`Searching via query: "${query}"`);

	let data = await fetch(`https://financialmodelingprep.com/api/v3/search?query=${query}&limit=5&exchange=NASDAQ&apikey=${config['API_KEY']}`).then((response) => {
		return response.json();
	}).catch((err) => {
		console.error(err);
		return null;
	});
	
	if (!data) return null; // if error, return null

	console.log(data);
	return data[0]['name'];
}


async function queryCompanyName(query) {
	// Find a company name by a specific ticker symbol
	let data = await fetch(`https://financialmodelingprep.com/api/v3/search-ticker?query=${query}&limit=5&exchange=NASDAQ&apikey=${config['API_KEY']}`).then((response) => {
		return response.json();
	});
	
	let companyName = data[0]['name'];
	return companyName;
}


async function searchForTicker(e) {
	// Specific helper function for home page search bar. Will redirect the user to the proper company page if a suitable ticker is found.
	let queryText = $("#search-input").val();
	
	console.debug(`Searching for: ${queryText}`);

	// Query the ticker from the FMP API
	let ticker = await queryTicker(queryText);

	// Now that we have the ticker, redirect to the company page.
	window.location = `/company.html?tick=${ticker}`;
}



// On document load...
window.addEventListener("load", () => {
	// Update the `watched` list to match anything from the previous session.
	getWatched();

	// Prevent default submission behavior for searchbar forms (as this is handled manually)
	const form = document.getElementById('searchbar');
	form.addEventListener('submit', (e) => {
		e.preventDefault();
		e.stopPropagation();
	});

});
