import { PartialType } from '@nestjs/mapped-types';
import { CreateRatesandreviewDto } from './create-ratesandreview.dto';

export class UpdateRatesandreviewDto extends PartialType(CreateRatesandreviewDto) {}
