"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var config_1 = require("@nestjs/config");
exports.default = (0, config_1.registerAs)('app', function () { return ({
    nodeEnv: process.env.NODE_ENV || 'development',
}); });
