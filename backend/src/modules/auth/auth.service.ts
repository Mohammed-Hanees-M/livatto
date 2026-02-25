import { Injectable, UnauthorizedException, Logger, OnModuleInit } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma.service';
import { LoginDto, RegisterDto } from './dto/auth.dto';

@Injectable()
export class AuthService implements OnModuleInit {
    private readonly logger = new Logger(AuthService.name);

    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
        private configService: ConfigService,
    ) { }

    onModuleInit() {
        const adminUser = this.configService.get('ADMIN_USERNAME');
        const adminPass = this.configService.get('ADMIN_PASSWORD');

        if (!adminUser || !adminPass) {
            this.logger.error('❌ CRITICAL: ADMIN_USERNAME or ADMIN_PASSWORD is not set in .env');
        } else if (adminPass === 'ChangeThisStrongPassword123!') {
            this.logger.warn('⚠️  SECURITY WARNING: Using default ADMIN_PASSWORD. Please change it in your .env file!');
        } else {
            this.logger.log('✅ Single-Admin Authentication initialized');
        }
    }

    async register(registerDto: RegisterDto) {
        throw new UnauthorizedException('Registration is disabled');
    }

    async login(loginDto: LoginDto) {
        const { email, password } = loginDto;
        const adminUser = this.configService.get('ADMIN_USERNAME')?.replace(/['"]/g, '');
        const adminPass = this.configService.get('ADMIN_PASSWORD')?.replace(/['"]/g, '');

        if (!adminUser || !adminPass) {
            this.logger.error('ADMIN_USERNAME or ADMIN_PASSWORD missing in .env');
            throw new UnauthorizedException('Server auth configuration error');
        }

        if (email !== adminUser || password !== adminPass) {
            this.logger.warn(`Failed login attempt for identifier: ${email}`);
            throw new UnauthorizedException('Invalid credentials');
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

    async getUserById(userId: string) {
        if (userId === 'admin') {
            return {
                id: 'admin',
                email: this.configService.get('ADMIN_USERNAME'),
                name: 'Administrator',
                role: 'admin',
            };
        }
        throw new UnauthorizedException('User not found');
    }

    private generateToken(userId: string, email: string): string {
        return this.jwtService.sign({ userId, email, role: 'admin' });
    }
}
