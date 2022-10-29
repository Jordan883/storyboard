var xss = require('xss');
var options = {};

var myxss = new xss.FilterXSS(options);

exports.parseDate = function (date) {
    return date.getFullMonth() + '-' + date.getDay() + 1 + '-' + date.getYear();
};

exports.xssfilter = function (input) {
    return myxss.process(input);
};
