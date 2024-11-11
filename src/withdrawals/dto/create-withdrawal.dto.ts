import { IsBoolean, IsDateString, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateWithdrawalDto {
  @IsInt()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @IsNumber()
  @IsNotEmpty()
  amount: number;

 
}
