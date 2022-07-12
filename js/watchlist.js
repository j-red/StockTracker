/* This file contains the logic for displaying and sorting the user's Watchlist. */

// On page load, load the cached watch list and populate the table accordingly. 
// Also generate a watchedObjects list to sort without making repeat API calls.
var watched = getWatched();
var watchedObjects = []; 

// Once the DOM elements are loaded, populate the table.
window.addEventListener("load", () => loadWatchlist());

async function loadWatchlist() {
	for (i in watched) {
		let ticker = watched[i];
		
		// Use an async call to check each Watched stock's price and name to fill in the table.
		let data = await checkPrice(ticker);
		console.debug(`Checking ${ticker}...`)
		console.debug(data);

		let price = formatMoney(data[0]['price'], 2);
		let change = formatMoney(data[0]['change'], 2);
		let changeClass = data[0]['change'] >= 0 ? "pos" : "neg"; // to color code the daily change

		watchedObjects.push({
			"name": data[0]['name'],
			"ticker": ticker,
			"price": data[0]['price']
		});

		// Create a row object and append to the table 
		$('#watchlist tr:last').after(`<tr><td>${data[0]['name']}</td><td id="ticker-row">${ticker}</td><td>${price} <span class="day-change ${changeClass}">${change}</span></td><td><button class="delete-btn btn"><i class="fa fa-trash"></i></button></td></tr>`);
	}

	// Once all rows are entered, we assign an anonymous function to each `Delete` button that removes its ticker
	// from the watch list and refreshes the page to redraw the table.
	$(".delete-btn").on('click', function() {
		// Get ticker value from the current row.
		let removedTicker = $(this).parent().siblings("#ticker-row").text(); 
		
		// We unwatch the ticker to remove it from the watched list. The table will be drawn on page reload.
		unwatchTicker(removedTicker);
		
		// Reload the page.
		window.location.reload();
	})
}

// Helper functions to re-sort the table. By default, the table is sorted in the order the stocks were watched.
function sortPrice(dir=1) {
	// If the direction != 1, it will sort in the inverse direction. This is used for the descending price sort.

	// Sort the watchedObjects array by price.
	if (dir == 1) { 
		// highest price first
		watchedObjects.sort((a, b) => {
			return b['price'] - a['price'];
		});
	} else {
		// lowest price first
		watchedObjects.sort((a, b) => {
			return a['price'] - b['price'];
		});
	}

	// Reconstruct and save the `watched` list in the new order.
	watched = [];
	watchedObjects.forEach((i) => {watched.push(i['ticker'])});
	saveWatched();

	// Redraw the table in the new order.
	window.location.reload();
}

async function addToWatchlist() {
	// Add a new ticker to the watchlist based on the query entered in the searchbar.
	let queryText = $("#search-input").val();
	let ticker = await queryTicker(queryText);

	console.log(ticker);

	watchTicker(ticker);

	// Reload page to add new ticker.
	window.location.reload();
}

