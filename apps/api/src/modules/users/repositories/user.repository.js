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
exports.UserRepository = void 0;
var common_1 = require("@nestjs/common");
var database_service_1 = require("@api/database/database.service");
var user_entity_1 = require("@api/users/models/user.entity");
var class_transformer_1 = require("class-transformer");
var string_utils_1 = require("@api/utils/string.utils");
var UserRepository = /** @class */ (function () {
    function UserRepository(databaseService) {
        this.databaseService = databaseService;
    }
    UserRepository.prototype.findById = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var maybeUser;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.databaseService.runQuery("SELECT u.*, ar.role_name as role\n       FROM ".concat(user_entity_1.User.tableName(), " u\n                JOIN roles ar on u.role_id = ar.id\n       WHERE u.id = $1"), [id])];
                    case 1:
                        maybeUser = _a.sent();
                        return [2 /*return*/, (0, class_transformer_1.plainToInstance)(user_entity_1.User, maybeUser.rows[0])];
                }
            });
        });
    };
    UserRepository.prototype.findAll = function () {
        return __awaiter(this, void 0, void 0, function () {
            var allUsers;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.databaseService.runQuery("SELECT *\n       FROM ".concat(user_entity_1.User.tableName))];
                    case 1:
                        allUsers = _a.sent();
                        return [2 /*return*/, (0, class_transformer_1.plainToInstance)(user_entity_1.User, allUsers.rows)];
                }
            });
        });
    };
    // Find All with limit and offset
    UserRepository.prototype.findAllWithLimitAndOffset = function (limit, offset) {
        return __awaiter(this, void 0, void 0, function () {
            var allUsers;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.databaseService.runQuery("SELECT *\n       FROM ".concat(user_entity_1.User.tableName, "\n       LIMIT $1 OFFSET $2"), [limit, offset])];
                    case 1:
                        allUsers = _a.sent();
                        return [2 /*return*/, (0, class_transformer_1.plainToInstance)(user_entity_1.User, allUsers.rows)];
                }
            });
        });
    };
    UserRepository.prototype.create = function (createUserDto) {
        return __awaiter(this, void 0, void 0, function () {
            var createdUser;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.databaseService.runQuery("INSERT INTO ".concat(user_entity_1.User.tableName, " (first_name, last_name, email, password)\n       VALUES ($1, $2, $3, $4)\n       RETURNING *"), [
                            createUserDto.firstName,
                            createUserDto.lastName,
                            createUserDto.email.toLowerCase(),
                            createUserDto.password,
                        ])];
                    case 1:
                        createdUser = _a.sent();
                        return [2 /*return*/, (0, class_transformer_1.plainToInstance)(user_entity_1.User, createdUser.rows[0])];
                }
            });
        });
    };
    // delete
    UserRepository.prototype.delete = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.databaseService.runQuery("DELETE\n       FROM ".concat(user_entity_1.User.tableName, "\n       WHERE id = $1"), [id])];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    UserRepository.prototype.findByEmail = function (email) {
        return __awaiter(this, void 0, void 0, function () {
            var maybeUser;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.databaseService.runQuery("SELECT u.*, ar.role_name as role\n       FROM ".concat(user_entity_1.User.tableName, " u\n                JOIN roles ar on u.role_id = ar.id\n       WHERE LOWER(email) = LOWER($1)"), [email])];
                    case 1:
                        maybeUser = _a.sent();
                        return [2 /*return*/, (0, class_transformer_1.plainToInstance)(user_entity_1.User, maybeUser.rows[0])];
                }
            });
        });
    };
    UserRepository.prototype.updateEmail = function (id, email) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.databaseService.runQuery("UPDATE ".concat(user_entity_1.User.tableName, "\n       SET email = $1\n       WHERE id = $2"), [email, id])];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    UserRepository.prototype.updateLastLogin = function (id) {
        return this.databaseService.runQuery("UPDATE ".concat(user_entity_1.User.tableName, "\n       SET last_login_timestamp = NOW()\n       WHERE id = $1"), [id]);
    };
    UserRepository.prototype.activateUser = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.databaseService.runQuery("UPDATE ".concat(user_entity_1.User.tableName, "\n       SET is_active = TRUE\n       WHERE id = $1\n       RETURNING *"), [id])];
                    case 1:
                        user = _a.sent();
                        return [2 /*return*/, (0, class_transformer_1.plainToInstance)(user_entity_1.User, user.rows[0])];
                }
            });
        });
    };
    UserRepository.prototype.patchUpdate = function (id, updateUserDto) {
        return __awaiter(this, void 0, void 0, function () {
            var query, updatedUser;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        query = "UPDATE ".concat(user_entity_1.User.tableName, "\n                   SET ").concat(Object.keys(updateUserDto)
                            .map(function (key, index) { return "".concat((0, string_utils_1.snakeCase)(key), " = $").concat(index + 1); })
                            .join(', '), "\n                   WHERE id = $").concat(Object.keys(updateUserDto).length + 1, "\n        RETURNING *");
                        return [4 /*yield*/, this.databaseService.runQuery(query, __spreadArray(__spreadArray([], Object.values(updateUserDto), true), [
                                id,
                            ], false))];
                    case 1:
                        updatedUser = _a.sent();
                        return [2 /*return*/, (0, class_transformer_1.plainToInstance)(user_entity_1.User, updatedUser.rows[0])];
                }
            });
        });
    };
    UserRepository = __decorate([
        (0, common_1.Injectable)(),
        __metadata("design:paramtypes", [database_service_1.default])
    ], UserRepository);
    return UserRepository;
}());
exports.UserRepository = UserRepository;
