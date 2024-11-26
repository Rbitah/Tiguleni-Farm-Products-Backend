import { Module } from '@nestjs/common';
import { UserprofileService } from './userprofile.service';
import { UserprofileController } from './userprofile.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profile } from './entities/userprofile.entity';
import { User } from 'src/authentication/entities/authentication.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Module({
  imports:[TypeOrmModule.forFeature([Profile,User]),JwtModule.registerAsync({
    useFactory: (configService: ConfigService) => ({
      secret: configService.get<string>('JWT_SECRET'),
      signOptions: { expiresIn:configService.get<string>('JWT_EXPIRATION') },
    }),
    inject: [ConfigService],
  })],
  controllers: [UserprofileController],
  providers: [UserprofileService,CloudinaryService],
})
export class UserprofileModule {}
