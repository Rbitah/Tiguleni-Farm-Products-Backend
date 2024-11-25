
import { IsInt, IsOptional, IsString, Min, Max } from 'class-validator';

export class CreateRatesandreviewDto {
  @IsInt()

  @IsInt()
  productId: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(5)
  rating?: number;

  @IsOptional()
  @IsString()
  review?: string;
}
