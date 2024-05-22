"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bool = exports.int = void 0;
var int = function (val, num) {
    return val ? (isNaN(parseInt(val)) ? num : parseInt(val)) : num;
};
exports.int = int;
var bool = function (val, bool) {
    return val == null ? bool : val == 'true';
};
exports.bool = bool;
