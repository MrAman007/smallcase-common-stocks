# Smallcase Tool

## _Tool for the smart investor_

smallcase-tool OR scTool is a web scrapping/automation tool for smallcase website.
Smallcase is a basket of stocks picked by experienced professionals, using this tool you can filter quality stocks from different smallcases and create your own smallcase.

## Features

-   Get Stocks of smallcase and store in JSON or Excel.
-   Compare two smallcases and get common stocks.
-   Create custom smallcase of common stocks.

## Tech Used

scTool is made using:

-   [Puppeteer](https://www.npmjs.com/package/puppeteer) - library for web automation & scrapping
-   [xlsx](https://www.npmjs.com/package/xlsx) - for creating excel files
-   rest features are implemented using **nodejs** and its APIs.

## Requirements

-   Nodejs
-   Zeordha Account

## Usage

scTool is fairly simple to use

Commands:

### get

1. Both of these commands works the same as -get is the default behaviour
2. This command will fetch stocks in the smallcase provided in input.json (a template is given in the repo for valid JSON input format) and then asks user whether to print stocks, create JSON Or Excel Or do all the listed operations.

```sh
node scTool.js input.json
node scTool.js -get input.json
```

### common

1. This command will fetches stocks of given smallcases, compares them and extracts common stocks.
2. Then asks for user input to whether get data in JSON, Excel OR create a custom smallcase of the common stocks.

```sh
node scTool.js -common input.json
```
