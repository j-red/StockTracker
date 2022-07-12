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
	// Get the ticker for this company based on the query parameters in the URL, e.g., "/companies.html?tick=TSLA"
	const params = new URLSearchParams(window.location.search);
	tick = params.get("tick").toUpperCase();

	// Query the company's name based on the ticker symbol
	companyName = await queryCompanyName(tick);

	// Set the company name and ticker text fields
	$('#company-name').text(companyName);
	$('#ticker').text(tick);

	// Query the API for information regarding the revenue, gross profit, EPS, etc.
	let data = await fetch(`https://financialmodelingprep.com/api/v3/income-statement/${tick}?apikey=${config['API_KEY']}`).then((response) => {
		return response.json();
	});

	// At this point, 'data' is an array containing 5 entries (limitation of the free version of the API) for each of the 5 most recent years.
	// We can access data[0] for the most recent year (2021) and determine the necessary fields (EPS, Gross Profit, Revenue, etc.)
	console.log(data);

	let recent = data[0];

	var finDate = new Date(recent['acceptedDate']).toDateString(); // Is this what is intended by 'Financial Annual Date'?
	var revenue = formatMoney(recent['revenue']);
	var profit = formatMoney(recent['grossProfit']);
	var eps = recent['eps'];
	
	// Now, we can update the table with the appropriate values.
	$("#FAD").text(finDate);
	$("#TR").text(revenue);
	$("#GP").text(profit);
	$("#EPS").text(eps);
	

	// We check if the ticker is already watched -- if so, we update the watch toggle.
	if (isTickerWatched(tick)) {
		toggleWatched(); // default is off, so toggling sets to on.
	}
	
	
	// Create the line graph of price over time using the Plotly library
	// var trace1 = {
	// 	x: [1, 2, 3, 4],
	// 	y: [10, 15, 13, 17],
	// 	type: 'scatter'
	// };


	// var trace2 = {
	// 	x: [1, 2, 3, 4],
	// 	y: [16, 5, 11, 9],
	// 	type: 'scatter'
	// };

	// var lineData = [trace1, trace2];
	// Plotly.newPlot('#tester', lineData);
	drawGraph();
} // end onLoad


async function drawGraph() {
	var GRAPH = document.getElementById('graph-container');
	
	// let graphData = getHistoricPrices(tick);
	getHistoricPrices(tick).then((graphData) => {
		console.log(graphData);

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

	// var DATA = [{
	// 	x: [2017, 2018, 2019, 2020, 2021],
	// 	y: [1, 2, 4, 8, 16] 
	// }]

	// var DATA = [{
	// 	x: graphData['historical'].map((x) => {return x['date']}),
	// 	y: graphData['historical'].map((x) => {return x['close']})
	// }]
	
	// var LAYOUT = {
	// 	xaxis: {
	// 		// title: 'Year',
	// 		titlefont: {
	// 			family: 'Arial, sans-serif',
	// 			size: 18,
	// 			// color: 'lightgrey'
	// 		},
	// 		// tickvals: [2017, 2018, 2019, 2020, 2021],
	// 		// ticktext: [2017, 2018, 2019, 2020, 2021],
	// 	},
	// 	showticklabels: true,
    // 	tickangle: 'auto',
	// 	margin: { t: 0 } 
	// 	}
	
	// Plotly.newPlot( GRAPH, DATA, LAYOUT);
}