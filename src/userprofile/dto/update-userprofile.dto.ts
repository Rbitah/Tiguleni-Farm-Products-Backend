import { PartialType } from '@nestjs/mapped-types';
import { CreateUserprofileDto } from './create-userprofile.dto';

export class UpdateUserprofileDto extends PartialType(CreateUserprofileDto) {}
