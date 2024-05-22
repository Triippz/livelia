"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InjectConnection = exports.InjectPool = exports.InjectClient = void 0;
var common_1 = require("@nestjs/common");
var postgres_utils_1 = require("@api/database/common/postgres.utils");
var InjectClient = function (connection) {
    return (0, common_1.Inject)((0, postgres_utils_1.getConnectionToken)(connection));
};
exports.InjectClient = InjectClient;
var InjectPool = function (connection) {
    return (0, common_1.Inject)((0, postgres_utils_1.getConnectionToken)(connection));
};
exports.InjectPool = InjectPool;
var InjectConnection = function (connection) {
    return (0, common_1.Inject)((0, postgres_utils_1.getConnectionToken)(connection));
};
exports.InjectConnection = InjectConnection;
