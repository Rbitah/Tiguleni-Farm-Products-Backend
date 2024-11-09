import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/authentication.entity';
import { Repository } from 'typeorm';
import { MailService } from 'src/mail/mail.service';
import { Token } from './entities/reset.entity';
import * as bcrypt from 'bcrypt';
import { Role } from './entities/role.enum';
import { LoginDto, SignUpDto } from './dto/create-authentication.dto';
import { JwtService } from '@nestjs/jwt';

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

  async resetPassword() {}
}
