import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
    @IsString()
    email: string;

    @IsString()
    @MinLength(6)
    password: string;
}

export class RegisterDto {
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(6)
    password: string;

    @IsString()
    name?: string;
}
