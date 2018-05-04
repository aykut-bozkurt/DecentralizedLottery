"use strict";

var _a = require("./a");

console.log((0, _a.square)(11));

var isGreater = function isGreater(no1, no2, mycallback) {

    var result;
    if (no1 > no2) {
        result = false;
    } else {
        result = true;
    }

    mycallback(null, result);
};

isGreater(1, 2, function (error, result) {
    if (!error) {
        console.log("result" + result);
    } else {
        console.log("error" + error);
    }
});

console.log("interesting order");
//# sourceMappingURL=b.js.map