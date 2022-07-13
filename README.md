# Tauk Programming Assessment

## My Solution

For my implementation of this project, I wanted to focus on maintaining a simple and clean interface with efficient functionality. To challenge myself and learn more about the language, I also chose to implement this project purely in JavaScript without only minimal external tools (jQuery, Plotly, and Bootstrap). Rather than implement server-side storage or other difficult cache solutions, I also chose to use the web browser's `localStorage` utility to cache user watchlists and expedite the development process.

As dictated by the project specification, I broke the application down into three separate sections -- the Home, Watchlist, and Company Financial pages. To make the application flexible without relying on redundant code, I made the Company Financial page modular by specifying the stock ticker to display information of in the URL via query parameters, meaning a URL such as `/company.html?tick=TSLA` would display the information for Tesla, Inc.
On the company page, I also used the open-sourced graphing library Plotly to visualize the line graph of stock price over time.

On each page, I also implemented a button in the lower right-hand corner to execute the unit tests I created for each section. These tests cover several aspects of the program, ensuring that tickers or company names are properly translated to the proper URLs, that API requests are performed properly, and that the application itself behaves as intended. I also use mock HTTP requests to serve debug responses, rather than repeatedly querying the API on unit test execution. Although further tests could be created to more exhaustively evaluate the application, I opted to create a straightforward test suite to demonstrate my abilities given the limited window of time to complete the application.

A brief overview of the files in my solution:

* `./index.html` contains the main page including the search bar and links to other pages.
* `./watchlist.html` contains the Watchlist page, which populates the watch table based on the watched tickers stored in the browser `localStorage`.
* `./company.html` contains the Company Financials pages, which load detailed financial information about a specific company based on the ticker encoded in the URL (e.g., `/company.html?tick=TSLA`).
* `./css/custom.css` contains my custom stylesheet overrides beyond the default Bootstrap CSS.
* `./js/api.js` contains all of the logic required to perform API lookup calls and search queries. Also manages the cacheing of the watchlist.
* `./js/watchlist.js` populates the watchlist page with the appropriate values and calls `api.js` to look up the pricing of each stock.
* `./js/company.js` requests company financial information from `api.js` and populates the Company Financial page tables accordingly.
* `./js/symbols.js` contains a cached list of all stock tickers supported by the FMP API. Used to prevent unnecessary API calls.
* `./js/tests.js` contains the unit tests written for each subsection of this application, as well as the logic to execute them.

Below is a list of the project requirements, maintained for future reference.

--------

## Project Requirements

Create a web, or mobile, application that allows a user to easily retrieve financial information from a public company and also create a watchlist of stocks they would like to follow.
We recommend using the [Financial Modeling Prep API](https://site.financialmodelingprep.com/developer/docs/), which is free to use.

The application must at minimum implement the following pages/views:

### The Home page

* Should contain a search bar for searching for a company by its name or associated stock ticker symbol.
  * A successful search result should take the user to the Company Financials page, described in the next section.
* Should show the user’s watchlist of stocks they follow, displaying the company name, current stock price, and stock price percentage change.

### The Company Financials page

* A line graph displaying the stock price of the company over time, with the date on the x-axis and the stock price on the y-axis of the graph. Feel free to use an open source chart / graphing library or API service.
* A table with the company’s financial annual information that has the following headers:
  * Financial Annual Date
  * Revenue
  * Gross Profit
  * Earnings per share (EPS)
* An option to add the company to a stock price watchlist.

### The Watchlist page

* Displays all the companies and their associated stock prices that the user has added to their watchlist.
* Ability to delete entries from the watchlist.
* Ability to sort the watchlist by stock price value either in ascending or descending order.

Feel free to take creative liberty to add what you want, in addition to the minimum requirements above, if you have ideas on how to further refine.

The application project must also contain **unit tests** for each page/view. The unit tests should use mock HTTP responses, instead of making actual requests to the external API, as the goal for the tests is to validate the application code and not the external API.
