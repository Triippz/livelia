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
Object.defineProperty(exports, "__esModule", { value: true });
var common_1 = require("@nestjs/common");
var pg_1 = require("pg");
var class_transformer_1 = require("class-transformer");
var common_2 = require("@api/database/common");
var DatabaseService = /** @class */ (function () {
    function DatabaseService(pool) {
        this.pool = pool;
        this.logger = new common_1.Logger('SQL');
    }
    // on application shutdown we want to close the pool
    DatabaseService.prototype.onApplicationShutdown = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.pool.end()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    DatabaseService.prototype.runQuery = function (query, params) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.queryWithLogging(this.pool, query, params)];
            });
        });
    };
    DatabaseService.prototype.getLogMessage = function (query, params) {
        if (!params) {
            return "Query: ".concat(query);
        }
        return "Query: ".concat(query, " Params: ").concat(JSON.stringify(params));
    };
    DatabaseService.prototype.queryWithLogging = function (source, query, params) {
        return __awaiter(this, void 0, void 0, function () {
            var queryPromise, message;
            var _this = this;
            return __generator(this, function (_a) {
                queryPromise = source.query(query, params);
                message = this.getLogMessage(query, params)
                    .replace(/\n|/g, '')
                    .replace(/  +/g, ' ');
                queryPromise
                    .then(function () {
                    _this.logger.debug(message);
                })
                    .catch(function (error) {
                    _this.logger.warn(message);
                    throw error;
                });
                return [2 /*return*/, queryPromise];
            });
        });
    };
    DatabaseService.prototype.getPoolClient = function () {
        return __awaiter(this, void 0, void 0, function () {
            var poolClient;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.pool.connect()];
                    case 1:
                        poolClient = _a.sent();
                        return [2 /*return*/, new Proxy(poolClient, {
                                get: function (target, propertyName) {
                                    if (propertyName === 'query') {
                                        return function (query, params) {
                                            return _this.queryWithLogging(target, query, params);
                                        };
                                    }
                                    return target[propertyName];
                                },
                            })];
                }
            });
        });
    };
    DatabaseService.prototype.getPool = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.pool];
            });
        });
    };
    // This function runs the queries and returns the paginated results
    DatabaseService.prototype.runPaginationQueries = function (query, queryParams, countQuery, countQueryParams, limit, page, instanceType) {
        return __awaiter(this, void 0, void 0, function () {
            var result, count, data, hasNextPage, hasPreviousPage, totalCount;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.runQuery(query, queryParams)];
                    case 1:
                        result = _a.sent();
                        return [4 /*yield*/, this.runQuery(countQuery, countQueryParams)];
                    case 2:
                        count = _a.sent();
                        data = result.rows.slice(0, limit);
                        hasNextPage = result.rows.length > limit;
                        hasPreviousPage = page > 1;
                        totalCount = Number(count.rows[0].count);
                        return [2 /*return*/, {
                                data: data.map(function (row) { return (0, class_transformer_1.plainToInstance)(instanceType, row); }),
                                hasNextPage: hasNextPage,
                                hasPreviousPage: hasPreviousPage,
                                totalCount: totalCount,
                            }];
                }
            });
        });
    };
    DatabaseService.prototype.transactional = function (callback) {
        return __awaiter(this, void 0, void 0, function () {
            var client, result, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.pool.connect()];
                    case 1:
                        client = _a.sent();
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 6, 8, 9]);
                        return [4 /*yield*/, client.query('BEGIN')];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, callback(client)];
                    case 4:
                        result = _a.sent();
                        return [4 /*yield*/, client.query('COMMIT')];
                    case 5:
                        _a.sent();
                        return [2 /*return*/, result];
                    case 6:
                        err_1 = _a.sent();
                        return [4 /*yield*/, client.query('ROLLBACK')];
                    case 7:
                        _a.sent();
                        throw err_1;
                    case 8:
                        client.release();
                        return [7 /*endfinally*/];
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    DatabaseService = __decorate([
        (0, common_1.Injectable)(),
        __param(0, (0, common_2.InjectPool)()),
        __metadata("design:paramtypes", [pg_1.Pool])
    ], DatabaseService);
    return DatabaseService;
}());
exports.default = DatabaseService;
