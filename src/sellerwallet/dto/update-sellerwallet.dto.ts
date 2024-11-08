import { PartialType } from '@nestjs/mapped-types';
import { CreateSellerwalletDto } from './create-sellerwallet.dto';

export class UpdateSellerwalletDto extends PartialType(CreateSellerwalletDto) {}
