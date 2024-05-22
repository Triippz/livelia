"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
var common_1 = require("@nestjs/common");
var config_1 = require("@nestjs/config");
var jwt_1 = require("@nestjs/jwt");
var auth_service_1 = require("@api/auth/auth.service");
var AuthModule = /** @class */ (function () {
    function AuthModule() {
    }
    AuthModule = __decorate([
        (0, common_1.Module)({
            imports: [
                jwt_1.JwtModule.registerAsync({
                    global: true,
                    imports: [config_1.ConfigModule, jwt_1.JwtModule],
                    inject: [config_1.ConfigService],
                    useFactory: function (configService) { return ({
                        global: true,
                        secret: configService.get('JWT_SECRET'), // Use your env var name
                        signOptions: {
                            expiresIn: configService.get('JWT_EXPIRES_IN'), // Eg: 60, "2 days", "10h", "7d"
                        },
                    }); },
                }),
            ],
            providers: [auth_service_1.AuthService],
            exports: [auth_service_1.AuthService],
        })
    ], AuthModule);
    return AuthModule;
}());
exports.AuthModule = AuthModule;
