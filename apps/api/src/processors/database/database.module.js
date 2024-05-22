"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseModule = void 0;
var common_1 = require("@nestjs/common");
var database_core_module_1 = require("@api/database/database-core.module");
var DatabaseModule = /** @class */ (function () {
    function DatabaseModule() {
    }
    DatabaseModule_1 = DatabaseModule;
    DatabaseModule.forRoot = function (options, connection) {
        return {
            module: DatabaseModule_1,
            imports: [database_core_module_1.DatabaseCoreModule.forRoot(options, connection)],
        };
    };
    DatabaseModule.forRootAsync = function (options, connection) {
        return {
            module: DatabaseModule_1,
            imports: [database_core_module_1.DatabaseCoreModule.forRootAsync(options, connection)],
        };
    };
    var DatabaseModule_1;
    DatabaseModule = DatabaseModule_1 = __decorate([
        (0, common_1.Module)({})
    ], DatabaseModule);
    return DatabaseModule;
}());
exports.DatabaseModule = DatabaseModule;
