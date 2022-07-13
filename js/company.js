/* This file contains the logic for the individual company overview page. It contains the following elements: 
	* A line graph displaying the stock price of the company over time, with the date on the x-axis and the stock price on the y-axis of the graph. 
	* A table with the company’s financial annual information with the following headers:
		* Financial Annual Date
		* Revenue
		* Gross Profit
		* Earnings per share (EPS)
	* An option to add the company to a stock price watchlist.
 */

// Global variables for company name and ticker info.
var companyName = "";
var tick = "";

// We use an async load function so as to not wait for the API requests.
window.addEventListener("load", () => onLoad());

// We define a variable to track, and helper functions to assist in, the toggling of the watch state for the current symbol.
var isWatched = isTickerWatched(tick);

function toggleWatched () {
	// Toggle if the current stock on the company page is in the watchlist.
	if (isWatched) { // un-watch
		$('#toggle-star').removeClass('watched');
		$('#toggle-star').text('☆');
		unwatchTicker(tick);
	} else { // watch
		$('#toggle-star').addClass('watched');
		$('#toggle-star').text('★');
		watchTicker(tick);
	}

	isWatched = !isWatched;
}



// Once the document is loaded...
async function onLoad() {
	// Get the ticker and name for this company based on the query parameters in the URL, e.g., "/companies.html?tick=TSLA"
	const params = new URLSearchParams(window.location.search);
	tick = params.get("tick").toUpperCase();
	companyName = await queryCompanyName(tick);

	// Set the company name and ticker text fields
	$('#company-name').text(companyName);
	$('#ticker').text(tick);

	// Query the API for information regarding the revenue, gross profit, EPS, etc.
	await fetch(`https://financialmodelingprep.com/api/v3/income-statement/${tick}?apikey=${config['API_KEY']}`).then((response) => {
		return response.json();
	}).then((data) => {
		// Now, 'data' is an array containing 5 entries (limitation of the free version of the API) for each of the 5 most recent years.
		// We can access data[0] for the most recent year (2021) and determine the necessary fields (EPS, Gross Profit, Revenue, etc.)
		
		if (data["Error Message"] != undefined) {
			// If there is an error within the FMP API (most likely daily limit exceeded)
			$("#error-text").append("<p>Error: daily limit exceeded. Wait until tomorrow or select a new API key in api.js.</p>");
			throw "Daily limit exceeded";
		}

		let recent = data[0];

		var finDate = new Date(recent['date']).toDateString(); // End of the previous fiscal year
		var revenue = formatMoney(recent['revenue']);
		var profit = formatMoney(recent['grossProfit']);
		var eps = recent['eps'];

		// Update the table with the appropriate values.
		$("#FAD").text(finDate);
		$("#TR").text(revenue);
		$("#GP").text(profit);
		$("#EPS").text(eps);
		
		// Display the company price graph.
		drawGraph();
	}).catch((err) => {
		// If an error occurs while attempting to resolve the API request:
		console.error(err);

		// Log error to the page for the end user
		$("#error-text").append("<p>Error fetching data from FMP API. Have you exceeded the daily quota?</p>");
		
		// In this error case, update with null values.
		$("#FAD").text("-");
		$("#TR").text("-");
		$("#GP").text("-");
		$("#EPS").text("-");
	});

	// We check if the ticker is already watched -- if so, we update the watch toggle.
	if (isTickerWatched(tick)) {
		toggleWatched(); // default is off, so toggling sets to on.
	}
} // end onLoad


async function drawGraph() {
	// Fetch 30d price history, then plot the graph once data is retrieved.
	var GRAPH = document.getElementById('graph-container');
	
	getHistoricPrices(tick).then((graphData) => {
		// console.debug(graphData); // Print graphed data to console

		var DATA = [{
			x: graphData['historical'].map((x) => {return x['date']}),
			y: graphData['historical'].map((x) => {return x['close']})
		}];

		var LAYOUT = {
			xaxis: {
				title: `${tick} Price over Time (last 30d)`,
			},
			yaxis: {
				title: `Price per share ($ USD)`,
			},
			showticklabels: true,
			tickangle: 'auto',
			margin: { t: 0 } 
			}
		
		Plotly.newPlot( GRAPH, DATA, LAYOUT);
	});
}