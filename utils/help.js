"use strict";

function help() {
    console.log(`Usage: node scTool.js [OPTION] [JSON FILE PATH]
Get, compare and create smallcases.
    
    Available Option
      -help,       show help manual
      -get,        get stocks of smallcases
      -common,     get common stocks of smallcases

Description:
    scTool is a script to scrape the smallcase website, it can get stocks of given smallcases
    OR it can get common stocks between two smallcases and also create a custom smallcase for you.

    Check inputJsonTemplate for valid JSON format.

Example Usage:
    -> node scTool.js -get input.json       (gets smallcase stocks in JSON) [default behaviour works the same without -get option]
    -> node scTool.js -common input.json   (gets common stocks between smallcases)   
    `);
}

module.exports = {
    help,
};
