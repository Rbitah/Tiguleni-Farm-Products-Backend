import { IsEmail, IsString } from 'class-validator';

export class SignUpDto {
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  username: string;

  @IsString()
  password: string;

  @IsString()
  role: string;
}

export class LoginDto {
  @IsString()
  email: string;

  @IsString()
  password: string;
}

export class ResetPassowrd {
  @IsString()
  email: string;
}
