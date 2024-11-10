import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/authentication.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Role } from './entities/role.enum';
import { LoginDto, SignUpDto } from './dto/create-authentication.dto';
import { JwtService } from '@nestjs/jwt';
import { Token } from './entities/reset.entity';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class AuthenticationService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private mailService: MailService,
    @InjectRepository(Token)
    private readonly resetRepository: Repository<Token>,
    private readonly jwtService: JwtService,
    
  ) {}
  async signup(signUpDto: SignUpDto) {
    const { email, role, password, username } = signUpDto;

    const userWithEMail = await this.userRepository.findOne({
      where: { email: email },
    });

    if (userWithEMail) {
      throw new BadRequestException('Email already in use');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await this.userRepository.create({
      email,
      password: hashedPassword,
      role: role as Role,
      username,
    });
    await this.userRepository.save(newUser);
    await this.mailService.sendWelcomeEmail(email, newUser.username);
    return {
      email,

      role,
      username,
    };
  }
  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const userAvailable = await this.userRepository.findOne({
      where: { email: email },
    });

    if (!userAvailable) {
      throw new UnauthorizedException('Wrong Credentials');
    }
    const compareWithHasedPassword = await bcrypt.compare(
      password,
      userAvailable.password,
    );

    if (!compareWithHasedPassword) {
      throw new UnauthorizedException('Wrong credentials');
    }
    return this.generateAccessToken(userAvailable.userId, userAvailable.role);
  }

  async generateAccessToken(userId, role) {
    const accessToken = this.jwtService.sign({ userId, role });

    return {
      accessToken,
    };
  }

  async forgotPassword(email) {
    const userWithEmail = await this.userRepository.findOne({
      where: { email: email },
    });

    if (userWithEmail) {
      let resetCode;
      let existingResetCode;

      do {
        resetCode = Math.floor(100000 + Math.random() * 900000).toString();
        existingResetCode = await this.resetRepository.findOne({
          where: { token: resetCode },
        });
      } while (existingResetCode);

      const expirationDate = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes from now

      const existingUserReset = await this.resetRepository.findOne({
        where: { user: userWithEmail },
      });

      if (existingUserReset) {
        existingUserReset.token = resetCode;
        existingUserReset.expirationDate = expirationDate;
        await this.resetRepository.save(existingUserReset);
      } else {
        await this.resetRepository.save({
          token: resetCode,
          user: userWithEmail,
          expirationDate: expirationDate,
        });
      }

      await this.mailService.sendResetPasswordEmail(email, resetCode);
    }

    return {
      message: 'If a user with that email exists, a reset email has been sent.',
    };
  }

  async resetPassword(resetCode, newPassword) {
    const resetEntry = await this.resetRepository.findOne({
      where: { token: resetCode },
      relations: ['user'],
    });

    if (!resetEntry) {
      throw new Error('Invalid reset code.');
    }

    const currentTime = new Date();
    if (currentTime > resetEntry.expirationDate) {
      await this.resetRepository.delete({ token: resetCode });
      throw new Error('Reset code has expired.');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    resetEntry.user.password = hashedPassword;
    await this.userRepository.save(resetEntry.user);

    await this.resetRepository.delete({ token: resetCode });

    return { message: 'Password has been reset successfully.' };
  }
}
