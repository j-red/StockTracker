# Tauk Assignment - Project Requirements

Create a web, or mobile, application that allows a user to easily retrieve financial information from a public company and also create a watchlist of stocks they would like to follow.
We recommend using the [Financial Modeling Prep API](https://site.financialmodelingprep.com/developer/docs/), which is free to use.

The application must at minimum implement the following pages/views:

## The Home page

* Should contain a search bar for searching for a company by its name or associated stock ticker symbol.
  * A successful search result should take the user to the Company Financials page, described in the next section.
* Should show the user’s watchlist of stocks they follow, displaying the company name, current stock price, and stock price percentage change.

## The Company Financials page

* A line graph displaying the stock price of the company over time, with the date on the x-axis and the stock price on the y-axis of the graph. Feel free to use an open source chart / graphing library or API service.
* A table with the company’s financial annual information that has the following headers:
  * Financial Annual Date
  * Revenue
  * Gross Profit
  * Earnings per share (EPS)
* An option to add the company to a stock price watchlist.

## The Watchlist page

* Displays all the companies and their associated stock prices that the user has added to their watchlist.
* Ability to delete entries from the watchlist.
* Ability to sort the watchlist by stock price value either in ascending or descending order.

Feel free to take creative liberty to add what you want, in addition to the minimum requirements above, if you have ideas on how to further refine.

The application project must also contain **unit tests** for each page/view. The unit tests should use mock HTTP responses, instead of making actual requests to the external API, as the goal for the tests is to validate the application code and not the external API.

If any questions arise, please feel free to email us. You will have until Thursday, July 14, 2022 at 11:00 am Pacific to complete this assignment. Once you are finished, please send us your submission. We will internally review and from there we can schedule calendar time, so you can present your submission, which includes walking through the code you’ve written.

--------

## My approach (writeup)

* Mobile-friendly home page with large search bar
* Use Adobe XD for front-end web design
* Use JavaScript API access to manage HTTP requests, API calls, graphing, and more

* Created an account on FMP API to access free key token
* On first time use, ask user for their API access token. Or, use the default.
* ~~Stored in local environment variable (Windows) with PowerShell `$env:FMP_API_KEY = '<my key>'` This way, JavaScript will be able to access local variable and make requests without exposing API key to end user~~
  * Allow the users to set specific API keys if they wish to use their own for specific requests
* For my project, I use local storage to cache the user's watchlist instead of managing session-based tracking. This will serve as an offline web application that makes the API calls.

## Tests

* Test adding or removing stocks from watchlist is functional
* Check that localstorage cache is updated properly
* Valid API key
* Exceeded request rate
* Wrong request URL
* Invalid ticker/stock name
* Is stock listed on NYSE/NASDAQ? (Needed for API)
* Ensure stocks with similar names map to proper tickers
* Check haven't exceeded daily query limit

## Other Notes

* Uncertain if I have the correct value for the "Financial Annual Date" -- treating this as the 'AcceptedDate' in the FMP API?
  * Or should I use the 'date' field?

Hi Nathan,

Just checking in. I've finished the core of the assessment and implemented most of the functionality -- all I have left is covering some tests and some bugs in the edge cases. I wanted to clarify one requirement from the description -- it says that the company-specific page should display the "Financial Annual Date," but I'm having a bit of trouble determining exactly which field in the API that is meant to refer to. As someone less-versed in the world of stock trading, I was wondering if you could clarify what I should include there?

For the time being, I have that field populated with the 'acceptedDate' from the FMP API. Let me know if that works or if there is a different field I should be using. Thanks.

Best,
Jared Knofczynski
