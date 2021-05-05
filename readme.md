# Smallcase Tool

## _Tool for the smart investor_

smallcase-tool is a web scrapping/automation tool for smallcase website.
Smallcase is a basket of stocks picked by experienced professionals, using this tool you can filter quality stocks from different smallcases and create your own smallcase.

## Features

-   Get Stocks of smallcase and store in JSON or Excel.
-   Compare two smallcases and get common stocks.
-   Create custom smallcase of common stocks.


## Usage

smallcase-tool is fairly simple to use and is very interactive.

1. Clone or Download the repository.
2. Run the command like this.

```sh
/*Run tool using*/

node index.js
```

3. First menu will come up
![interface](https://user-images.githubusercontent.com/40262320/117167039-8a566a80-ade4-11eb-9174-917e46924502.png)

4. Choose what you want to do then enter your zerodha credential to login
![logininterface](https://user-images.githubusercontent.com/40262320/117167392-d73a4100-ade4-11eb-9304-a97873cdce3c.png)

5. Browser will open and log you in with your provided credential, from there choose a smallcase you want to get stocks of copy it's url and paste in the tool.
![choose-smallcase](https://user-images.githubusercontent.com/40262320/117170371-9859ba80-ade7-11eb-9168-bcb366705122.png)
6. You can choose number of smallcases you want to get stocks of, here i chose 1 and pasted the link of desired smallcase
![interfacesmallcaseinput](https://user-images.githubusercontent.com/40262320/117171608-a3f9b100-ade8-11eb-861f-826d8942078f.jpg)

7. You will get data of the smallcases printed on the console, in JSON file and Excel sheet.
![data](https://user-images.githubusercontent.com/40262320/117170490-b4f5f280-ade7-11eb-9345-4a54e444461d.png)


## Tech Used

scTool is made using:

-   [Puppeteer](https://www.npmjs.com/package/puppeteer) - library for web automation & scrapping
-   [xlsx](https://www.npmjs.com/package/xlsx) - for creating excel files
-   rest features are implemented using **nodejs** and its APIs.

## Requirements

-   Nodejs
-   Zeordha Account

