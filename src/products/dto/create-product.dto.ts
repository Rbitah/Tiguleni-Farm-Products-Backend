import { IsString, IsNumber, IsNotEmpty, IsUUID, IsOptional } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  products_name: string;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsString()
  @IsNotEmpty()
  location: string;

  @IsNumber()
  @IsNotEmpty()
  quantity_amount: number;

  @IsString()
  @IsNotEmpty()
  quantity_metric: string;

  @IsString()
  @IsOptional()
  category: string;

}

