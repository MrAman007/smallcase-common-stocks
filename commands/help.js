"use strict";

function help() {
    console.log(`Usage: node script.js [JSON FILE PATH]
Compare two smallcases and gets common stocks.
    
    Available Option
      -h,       show help

Description:
    This script takes smallcase URL as input through JSON file, compares them to get common stocks
    and then gives you option to store the stock in JSON format, Excel OR create a custom smallcase
    of common stocks.`);
}

module.exports = {
    help,
};
