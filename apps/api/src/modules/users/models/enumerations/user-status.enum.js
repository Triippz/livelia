"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserStatus = exports.UserStatusEnum = void 0;
var UserStatusEnum;
(function (UserStatusEnum) {
    UserStatusEnum["ACTIVE"] = "ACTIVE";
    UserStatusEnum["INACTIVE"] = "INACTIVE";
    UserStatusEnum["ON_HOLD"] = "ON_HOLD";
    UserStatusEnum["PENDING_ACTIVATION"] = "PENDING_ACTIVATION";
})(UserStatusEnum || (exports.UserStatusEnum = UserStatusEnum = {}));
exports.UserStatus = {
    ACTIVE: 'ACTIVE',
    INACTIVE: 'INACTIVE',
    ON_HOLD: 'ON_HOLD',
    PENDING_ACTIVATION: 'PENDING_ACTIVATION',
};
