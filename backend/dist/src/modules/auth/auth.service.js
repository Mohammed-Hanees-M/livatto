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
var AuthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const prisma_service_1 = require("../../prisma.service");
let AuthService = AuthService_1 = class AuthService {
    prisma;
    jwtService;
    configService;
    logger = new common_1.Logger(AuthService_1.name);
    constructor(prisma, jwtService, configService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
        this.configService = configService;
    }
    onModuleInit() {
        const adminUser = this.configService.get('ADMIN_USERNAME');
        const adminPass = this.configService.get('ADMIN_PASSWORD');
        if (!adminUser || !adminPass) {
            this.logger.error('❌ CRITICAL: ADMIN_USERNAME or ADMIN_PASSWORD is not set in .env');
        }
        else if (adminPass === 'ChangeThisStrongPassword123!') {
            this.logger.warn('⚠️  SECURITY WARNING: Using default ADMIN_PASSWORD. Please change it in your .env file!');
        }
        else {
            this.logger.log('✅ Single-Admin Authentication initialized');
        }
    }
    async register(registerDto) {
        throw new common_1.UnauthorizedException('Registration is disabled');
    }
    async login(loginDto) {
        const { email, password } = loginDto;
        const adminUser = this.configService.get('ADMIN_USERNAME')?.replace(/['"]/g, '');
        const adminPass = this.configService.get('ADMIN_PASSWORD')?.replace(/['"]/g, '');
        if (!adminUser || !adminPass) {
            this.logger.error('ADMIN_USERNAME or ADMIN_PASSWORD missing in .env');
            throw new common_1.UnauthorizedException('Server auth configuration error');
        }
        if (email !== adminUser || password !== adminPass) {
            this.logger.warn(`Failed login attempt for identifier: ${email}`);
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const user = {
            id: 'admin',
            email: adminUser,
            name: 'Administrator',
            role: 'admin',
        };
        return {
            user,
            token: this.generateToken(user.id, user.email),
        };
    }
    async getUserById(userId) {
        if (userId === 'admin') {
            return {
                id: 'admin',
                email: this.configService.get('ADMIN_USERNAME'),
                name: 'Administrator',
                role: 'admin',
            };
        }
        throw new common_1.UnauthorizedException('User not found');
    }
    generateToken(userId, email) {
        return this.jwtService.sign({ userId, email, role: 'admin' });
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = AuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map