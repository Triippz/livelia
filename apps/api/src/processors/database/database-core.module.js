"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseCoreModule = void 0;
var common_1 = require("@nestjs/common");
var common_2 = require("./common");
var postgres_constants_1 = require("./constants/postgres.constants");
var core_1 = require("@nestjs/core");
var rxjs_1 = require("rxjs");
var pg_1 = require("pg");
var DatabaseCoreModule = /** @class */ (function () {
    function DatabaseCoreModule(options, moduleRef) {
        this.options = options;
        this.moduleRef = moduleRef;
    }
    DatabaseCoreModule_1 = DatabaseCoreModule;
    DatabaseCoreModule.forRoot = function (options, connection) {
        var _this = this;
        var knexModuleOptions = {
            provide: postgres_constants_1.DATABASE_MODULE_OPTIONS,
            useValue: options,
        };
        var connectionProvider = {
            provide: (0, common_2.getConnectionToken)(connection),
            useFactory: function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.createConnectionFactory(options)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            }); }); },
        };
        return {
            module: DatabaseCoreModule_1,
            providers: [connectionProvider, knexModuleOptions],
            exports: [connectionProvider],
        };
    };
    DatabaseCoreModule.forRootAsync = function (options, connection) {
        var _this = this;
        var connectionProvider = {
            provide: (0, common_2.getConnectionToken)(connection),
            useFactory: function (options) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.createConnectionFactory(options)];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            }); },
            inject: [postgres_constants_1.DATABASE_MODULE_OPTIONS],
        };
        return {
            module: DatabaseCoreModule_1,
            imports: options.imports,
            providers: __spreadArray(__spreadArray([], this.createAsyncProviders(options), true), [connectionProvider], false),
            exports: [connectionProvider],
        };
    };
    DatabaseCoreModule.prototype.onApplicationShutdown = function () {
        return __awaiter(this, void 0, void 0, function () {
            var connection, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        connection = this.moduleRef.get((0, common_2.getConnectionToken)(this.options));
                        _a = connection;
                        if (!_a) return [3 /*break*/, 2];
                        return [4 /*yield*/, connection.end];
                    case 1:
                        _a = (_b.sent());
                        _b.label = 2;
                    case 2:
                        _a;
                        return [2 /*return*/];
                }
            });
        });
    };
    DatabaseCoreModule.createAsyncProviders = function (options) {
        if (options.useExisting || options.useFactory) {
            return [this.createAsyncOptionsProvider(options)];
        }
        var useClass = options.useClass;
        return [
            this.createAsyncOptionsProvider(options),
            {
                provide: useClass,
                useClass: useClass,
            },
        ];
    };
    DatabaseCoreModule.createAsyncOptionsProvider = function (options) {
        var _this = this;
        if (options.useFactory) {
            return {
                provide: postgres_constants_1.DATABASE_MODULE_OPTIONS,
                useFactory: options.useFactory,
                inject: options.inject || [],
            };
        }
        // `as Type<PostgresOptionsFactory>` is a workaround for microsoft/TypeScript#31603
        var inject = [
            (options.useClass || options.useExisting),
        ];
        return {
            provide: postgres_constants_1.DATABASE_MODULE_OPTIONS,
            useFactory: function (optionsFactory) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, optionsFactory.createPostgresOptions()];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            }); },
            inject: inject,
        };
    };
    DatabaseCoreModule.createConnectionFactory = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, (0, rxjs_1.lastValueFrom)((0, rxjs_1.defer)(function () {
                        var client = new pg_1.Pool(options);
                        return client.connect();
                    }).pipe((0, common_2.handleRetry)(options.retryAttempts, options.retryDelay)))];
            });
        });
    };
    var DatabaseCoreModule_1;
    DatabaseCoreModule = DatabaseCoreModule_1 = __decorate([
        (0, common_1.Global)(),
        (0, common_1.Module)({}),
        __param(0, (0, common_1.Inject)(postgres_constants_1.DATABASE_MODULE_OPTIONS)),
        __metadata("design:paramtypes", [Object, core_1.ModuleRef])
    ], DatabaseCoreModule);
    return DatabaseCoreModule;
}());
exports.DatabaseCoreModule = DatabaseCoreModule;
