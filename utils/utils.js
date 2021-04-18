const fs = require("fs");
const path = require("path");
const xlsx = require("xlsx");

//function to wait for selector and then click
async function waitAndClick(selector, tab) {
    await tab.waitForSelector(selector);
    return tab.click(selector);
}
//function to wait for selector and then type
async function waitAndType(selector, text, tab, delay = 100) {
    await tab.waitForSelector(selector);
    return tab.type(selector, text, { delay: delay });
}

//function to create json file of stocks
function createJSON(stocks, dirPath) {
    const filePath = path.join(path.resolve(dirPath), "stocks.json");
    fs.writeFileSync(filePath, JSON.stringify(stocks));
    return filePath;
}

//function to create excel file of stocks
function createExcelCommon(stocks) {
    const content = excelifyCommon(stocks);
    const newWb = xlsx.utils.book_new();
    const newWs = xlsx.utils.json_to_sheet(content);
    xlsx.utils.book_append_sheet(newWb, newWs, "Sheet1");
    xlsx.writeFile(newWb, path.join(__dirname, "stocks.xlsx"));
}

//function to convert stocks object to xlsx supported array of objects
function excelifyCommon(stocks) {
    const result = [];
    for (let key of Object.keys(stocks)) {
        let temp = stocks[key].map((stock) => {
            return { [key]: stock };
        });
        result.push(...temp);
    }

    return result;
}

//TODO create excel for stocks array

module.exports = {
    waitAndClick,
    waitAndType,
    createJSON,
    createExcelCommon,
};
