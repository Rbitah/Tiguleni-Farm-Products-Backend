import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/authentication.entity';
import { Repository } from 'typeorm';
import { MailService } from 'src/mail/mail.service';
import { Token } from './entities/reset.entity';
import * as bcrypt from 'bcrypt';
import { Role } from './entities/role.enum';
import { SignUpDto } from './dto/create-authentication.dto';

@Injectable()
export class AuthenticationService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private mailService: MailService,
    @InjectRepository(Token)
    private readonly resetRepository: Repository<Token>,
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
  async login() {}
  async forgotPassword() {}
  async resetPassword() {}
}
