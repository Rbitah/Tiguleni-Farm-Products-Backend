import { Controller, Post, Body } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import {
  LoginDto,
  ResetPassowrd,
  SignUpDto,
} from './dto/create-authentication.dto';

@Controller('authentication')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Post('sign-up')
  async signup(@Body() signUpDto: SignUpDto) {
    return this.authenticationService.signup(signUpDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authenticationService.login(loginDto);
  }
  @Post('forgot-password')
  async forgotPassword(@Body() resetPassword: ResetPassowrd) {
    return this.authenticationService.forgotPassword(resetPassword.email);
  }
}
