"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateString = exports.getConnectionName = exports.handleRetry = exports.getConnectionPrefix = exports.getConnectionToken = exports.getDbToken = void 0;
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var node_crypto_1 = require("node:crypto");
var common_1 = require("@nestjs/common");
var postgres_constants_1 = require("@api/database/constants/postgres.constants");
var exceptions_1 = require("@nestjs/core/errors/exceptions");
var logger = new common_1.Logger('PostgresModule');
function getDbToken(database, connection) {
    if (connection === void 0) { connection = postgres_constants_1.DEFAULT_CONNECTION_NAME; }
    if (database === null || database === undefined) {
        throw new exceptions_1.CircularDependencyException('@InjectClient()');
    }
    var connectionPrefix = getConnectionPrefix(connection);
    return "".concat(connectionPrefix).concat(database.name);
}
exports.getDbToken = getDbToken;
function getConnectionToken(connection) {
    if (connection === void 0) { connection = postgres_constants_1.DEFAULT_CONNECTION_NAME; }
    if (typeof connection === 'string') {
        return connection;
    }
    return connection.name || postgres_constants_1.DEFAULT_CONNECTION_NAME;
}
exports.getConnectionToken = getConnectionToken;
function getConnectionPrefix(connection) {
    if (connection === void 0) { connection = postgres_constants_1.DEFAULT_CONNECTION_NAME; }
    if (connection === postgres_constants_1.DEFAULT_CONNECTION_NAME) {
        return '';
    }
    if (typeof connection === 'string') {
        return connection + '_';
    }
    if (connection.name === postgres_constants_1.DEFAULT_CONNECTION_NAME || !connection.name) {
        return '';
    }
    return connection.name + '_';
}
exports.getConnectionPrefix = getConnectionPrefix;
function handleRetry(retryAttempts, retryDelay) {
    if (retryAttempts === void 0) { retryAttempts = 9; }
    if (retryDelay === void 0) { retryDelay = 3000; }
    return function (source) {
        if (!(0, rxjs_1.isObservable)(source)) {
            throw new Error('Source must be an Observable');
        }
        return source.pipe((0, operators_1.retryWhen)(function (errors) {
            return errors.pipe((0, operators_1.scan)(function (errorCount, error) {
                logger.error("Unable to connect to the database. Retrying (".concat(errorCount + 1, ")..."), error.stack);
                if (errorCount + 1 >= retryAttempts) {
                    throw error;
                }
                return errorCount + 1;
            }, 0), (0, operators_1.mergeMap)(function (errorCount) { return (0, rxjs_1.of)(errorCount).pipe((0, operators_1.delay)(retryDelay)); }));
        }));
    };
}
exports.handleRetry = handleRetry;
function getConnectionName(options) {
    return options && options.name ? options.name : postgres_constants_1.DEFAULT_CONNECTION_NAME;
}
exports.getConnectionName = getConnectionName;
var generateString = function () { return (0, node_crypto_1.randomUUID)(); };
exports.generateString = generateString;
