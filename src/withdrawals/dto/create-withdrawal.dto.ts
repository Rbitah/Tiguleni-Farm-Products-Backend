import { IsBoolean, IsDateString, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateWithdrawalDto {
  @IsInt()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  mobile: string;

  @IsNumber()
  @IsNotEmpty()
  amount: number;

 
}
