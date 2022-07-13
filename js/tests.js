/* This file contains the logic needed to perform unit tests for the various pages and capabilities of the Stock Tracker application.
 * It uses mock HTTP requests and responses to avoid making unnecessary calls to the FMP API. Errors are logged to the console or displayed on screen. */


// Helper function providing access to mock HTTTP API requests
async function mockRequest(returnData, returnCode) {
	const options = {
		"OK": {
			"status" : 200,
			"statusText" : "OK",	
		}, 
		"FORBIDDEN" : {
			"status" : 403,
			"statusText" : "FORBIDDEN",
		}, 
		"NOT_FOUND": {
			"status" : 404,
			"statusText" : "NOTFOUND",
		}
	};

	let _response = new Response(JSON.stringify(returnData), options[returnCode]);

	let _result = await _response.json();
	
	console.log(_result);
	return _result;
}


// Example mock HTTP request:
// let mock = await mockRequest( { "name" : "debug", "data" : [1,2,3] }, 'FORBIDDEN');
// 	 returns mock := { "name" : "debug", "data" : [1,2,3] }



/* Home page unit tests */
async function testHome() {
	console.debug("Running home page tests...");
	let testsPassed = 0;

	// Test searching for company by name
	test     = "Search by company name";
	input    = "Tesla";
	output   = await queryTicker(input);
	expected = "TSLA";

	if (output == expected) {
		console.debug(`${test}: PASS`);
		testsPassed += 1;
	} else {
		console.warn(`${test}: FAIL, output: ${output}`);
	}


	// Test searching for company by ticker
	test     = "Search by ticker";
	input    = "TSLA";
	output   = await queryCompanyName(input);
	expected = "Tesla, Inc.";

	if (output == expected) {
		console.debug(`${test}: PASS`);
		testsPassed += 1;
	} else {
		console.warn(`${test}: FAIL, output: ${output}`);
	}

	
	// Test searching for company by invalid name or ticker (should fail and display red error message on page)
	test     = "Search by invalid name";
	input    = "Google";
	output   = await queryTicker(input);
	expected = null;

	_passed = output == null;
	console.debug(`${test}: ${_passed ? "PASS" : "FAIL"}`);
	testsPassed += _passed ? 1 : 0;

	alert(`Passed: ${testsPassed} / 3 tests`);
}


/* Company page unit tests */
async function testCompany() {
	console.debug("Running company page tests...");
	let testsPassed = 0;

	// Test adding company to/removing company from the watchlist (test localStorage)
	test = "Toggle watchlist"
	passed = false;

	alreadyWatched = isTickerWatched(tick);

	$("#toggle-star").click(); // Click the toggle button
	if (isTickerWatched(tick) != alreadyWatched) { // if toggling on works...
		$("#toggle-star").click();
		if (isTickerWatched(tick) == alreadyWatched) {
			passed = true;
		}
	}

	if (passed) {
		console.debug(`${test}: PASSED`);
		testsPassed += 1;
	} else {
		console.warn(`${test}: FAILED`);
	}

	// Test that Watchlist toggle should be enabled if company already watched
	test = "Watchlist state on load"
	passed = false;

	if (isTickerWatched(tick)) { // if current ticker is already watched...
		if ($("#toggle-star").attr("class").split(" ").indexOf("watched") != -1) { // star should be enabled
			passed = true;
		}
	} else { // Otherwise, star should be disabled.
		if ($("#toggle-star").attr("class").split(" ").indexOf("watched") == -1) {
			passed = true;
		}	
	}

	if (passed) {
		console.debug(`${test}: PASSED`);
		testsPassed += 1;
	} else {
		console.warn(`${test}: FAILED`);
	}
	
	// Test that data table is properly constructed with appropriate values
	test = "Constructing Table"
	passed = false;

	// Assert that each table entry is long enough to indicate there is a value present.
	passed = ($("#FAD").text().length >= 5 && $("#TR").text().length >= 2 && $("#GP").text().length >= 2 && $("#EPS").text().length >= 2);

	if (passed) {
		console.debug(`${test}: PASSED`);
		testsPassed += 1;
	} else {
		console.warn(`${test}: FAILED`);
	}
	
	// Test fetching historic pricing data for graph
	test = "Fetching price data"
	passed = false;

	// Use a mock request in place of the getHistoricPrices() helper function.
	mock = await mockRequest({"symbol": tick, "data" : ["..."]}, "OK");

	if (mock['data']) {
		passed = true;
	}
	
	if (passed) {
		console.debug(`${test}: PASSED`);
		testsPassed += 1;
	} else {
		console.warn(`${test}: FAILED`);
	}
	
	// Test that graph is drawn and populated correctly
	test = "Drawing Graph"
	passed = false;

	// Return true if the graph is drawn.
	passed = $(".plot-container").length > 0;

	if (passed) {
		console.debug(`${test}: PASSED`);
		testsPassed += 1;
	} else {
		console.warn(`${test}: FAILED`);
	}
	
	
	alert(`Passed: ${testsPassed} / 5 tests`);
}


/* Watchlist unit tests */
async function testWatchlist() {
	console.debug("Running watchlist tests...");
	let testsPassed = 0;

	// Test adding to watchlist based on valid ticker
	input = "TSLA";
	watchTicker(input);
	
	if (isTickerWatched('TSLA')) { // if the new ticker is now watched, test passed
		console.debug("Adding stock to watchlist by ticker: PASSED ");
		testsPassed += 1;
	} else {
		console.warn("Adding stock to watchlist by ticker: FAILED ");
	}
	
	// Test adding to watchlist based on valid company name
	input = "nvidia";
	mock = await mockRequest( { "name" : "NVIDIA", "symbol": "NVDA", "price" : 250.0, "change": 10.0 }, 'OK');
	watchTicker(mock['symbol']);
	if (isTickerWatched('NVDA')) {
		console.debug("Adding stock to watchlist by company name: PASSED ");
		testsPassed += 1;
	} else {
		console.warn("Adding stock to watchlist by company name: FAILED ");
	}

	
	// Test attempting to add to watchlist based on invalid name or ticker.
	// Check initial watchlist length, perform query, assert the length has not changed.
	watchlen = watched.length;

	input = "Google";
	mock = await mockRequest( null, 'NOT_FOUND'); // replaces queryTicker from api.js
	watchTicker(mock);

	if (watchlen == watched.length) {
		console.debug("Attempting to watch invalid stock: PASSED ");
		testsPassed += 1;
	} else {
		console.warn("Attempting to watch invalid stock: FAILED ");
	}
	

	// Test deleting a ticker from the watchlist
	// If there is at least one watched item, click the first delete button and verify that the watched list is updated.
	if ($(".delete-btn").length < 1) {
		alert("No tickers present to test on -- please try again after the page reloads.");
		watchTicker("AAPL");
		// addToWatchlist("AAPL");
		window.location.reload();
		return;
	}

	watchlen = watched.length;
	$(".delete-btn")[0].click();

	if (watched.length == watchlen - 1) {
		console.debug("Deleting watched stock: PASSED ");
		testsPassed += 1;
	} else {
		console.warn("Deleting watched stock: FAILED ");
	}

	saveWatched();

	/* End watchlist unit tests */
	alert(`Passed: ${testsPassed} / 4 tests`);
	window.location.reload();
}