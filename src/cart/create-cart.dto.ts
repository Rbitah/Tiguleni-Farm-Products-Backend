import { IsNumber, IsString, IsNotEmpty } from 'class-validator';

export class CreateCartDto {
  @IsNumber()
  userId: number;

  @IsNumber()
  productId: number;

  @IsString()
  @IsNotEmpty()
  productName: string;

  @IsNumber()
  price: number;

  @IsNumber()
  quantity: number;

  @IsString()
  @IsNotEmpty()
  image: string;
}
