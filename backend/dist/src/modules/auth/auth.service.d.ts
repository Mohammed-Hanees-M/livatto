import { OnModuleInit } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma.service';
import { LoginDto, RegisterDto } from './dto/auth.dto';
export declare class AuthService implements OnModuleInit {
    private prisma;
    private jwtService;
    private configService;
    private readonly logger;
    constructor(prisma: PrismaService, jwtService: JwtService, configService: ConfigService);
    onModuleInit(): void;
    register(registerDto: RegisterDto): Promise<void>;
    login(loginDto: LoginDto): Promise<{
        user: {
            id: string;
            email: any;
            name: string;
            role: string;
        };
        token: string;
    }>;
    getUserById(userId: string): Promise<{
        id: string;
        email: any;
        name: string;
        role: string;
    }>;
    private generateToken;
}
