import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/authentication/entities/authentication.entity';
import { Profile } from './entities/userprofile.entity';

@Injectable()
export class UserprofileService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Profile)
    private readonly userProfileRepository: Repository<Profile>,
  ) {}

  async create(userId: string,name:string, imageUrl: string) {
    const user = await this.userRepository.findOne({ where: { userId: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    let userProfile = await this.userProfileRepository.findOne({
      where: { user: { userId: userId } },
    });

    if (!userProfile) {
      userProfile = this.userProfileRepository.create({
        user,
        name,
        profileImage: imageUrl,
      });
    } else {
      userProfile.profileImage = imageUrl;
    }
    return this.userProfileRepository.save(userProfile);
  }

  async updateImage(userId: string,name:string, newImageUrl: string) {
    const userProfile = await this.userProfileRepository.findOne({
      where: { user: { userId: userId } },
      relations: ['user'], 
    });

    if (!userProfile) {
      throw new NotFoundException('User profile not found');
    }
    userProfile.name=name;
    userProfile.profileImage = newImageUrl;
    this.userProfileRepository.save(userProfile);
    return {message:"updated"}
  }

  async getProfile(userId: string) {
    let userProfile = await this.userProfileRepository.findOne({
      where: { user: { userId: userId } },
      relations: ['user'],
    });
  
    if (!userProfile) {
      // Create a new profile if none exists
      const user = await this.userRepository.findOne({ where: { userId: userId } });
      if (!user) {
        throw new NotFoundException('User not found');
      }
  
      userProfile = this.userProfileRepository.create({
        user: user,
        profileImage: '', // Default profile image or leave empty
      });
  
      await this.userProfileRepository.save(userProfile);
    }
  const name =userProfile.name
    return {
      name,
      username: userProfile.user.username,
      profileImage: userProfile.profileImage,
    };
  }
  }
  

