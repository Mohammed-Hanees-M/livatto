import { AuthService } from './auth.service';
import { LoginDto } from './dto/auth.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(): Promise<void>;
    login(loginDto: LoginDto): Promise<{
        user: {
            id: string;
            email: any;
            name: string;
            role: string;
        };
        token: string;
    }>;
    getProfile(req: any): Promise<{
        id: string;
        email: any;
        name: string;
        role: string;
    }>;
}
