import { Controller, Post, Body, HttpException, HttpStatus, Get, Req, UseGuards } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import {
  LoginDto,
  ResetPassowrd,
  SignUpDto,
} from './dto/create-authentication.dto';
import { Roles } from './decorator/roles.decorator';
import { AuthGuard } from './guards/authentication.guard';
import { RoleGuardAuth } from './guards/roles.guard';

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
  @Post('reset-password')
  async resetPassword(
    @Body('resetCode') resetCode: string,
    @Body('newPassword') newPassword: string,
  ) {
    try {
      const response = await this.authenticationService.resetPassword(
        resetCode,
        newPassword,
      );
      return response;
    } catch (error) {
      throw new HttpException(
        { message: error.message },
        HttpStatus.BAD_REQUEST,
      );
    }
  }


  @UseGuards(AuthGuard,RoleGuardAuth)
  @Roles(['buyer'])
  @Get('protected')
  someProtected(@Req() req, @Body() body: { prdoduct_Id: string }) {
    return { message: 'accessed Resources', user_Id: req.user_Id };
  }
}
