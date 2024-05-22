"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VALIDATION_PIPE_OPTIONS = exports.ACCEPT_LANGUAGE_HEADER = exports.REQUEST_GYM_ID_HEADER = exports.REQUEST_USER_AGENT_HEADER = exports.FORWARDED_FOR_TOKEN_HEADER = exports.REQUEST_ID_TOKEN_HEADER = void 0;
var validation_exception_1 = require("@api/utils/exceptions/validation.exception");
exports.REQUEST_ID_TOKEN_HEADER = 'x-request-id';
exports.FORWARDED_FOR_TOKEN_HEADER = 'x-forwarded-for';
exports.REQUEST_USER_AGENT_HEADER = 'User-Agent';
exports.REQUEST_GYM_ID_HEADER = 'x-gym-id';
exports.ACCEPT_LANGUAGE_HEADER = 'accept-language';
exports.VALIDATION_PIPE_OPTIONS = {
    transform: true,
    whitelist: true,
    forbidUnknownValues: true,
    exceptionFactory: function (validationErrors) {
        if (validationErrors === void 0) { validationErrors = []; }
        return new validation_exception_1.ValidationException(validationErrors);
    },
};
