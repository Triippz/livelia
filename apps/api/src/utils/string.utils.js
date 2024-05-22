"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.snakeCaseKeys = exports.snakeCase = void 0;
function snakeCase(str) {
    return str.replace(/[A-Z]/g, function (letter) { return "_".concat(letter.toLowerCase()); });
}
exports.snakeCase = snakeCase;
function snakeCaseKeys(keys) {
    return keys.map(function (key) { return snakeCase(key); });
}
exports.snakeCaseKeys = snakeCaseKeys;
