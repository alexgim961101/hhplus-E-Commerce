import { Transform } from 'class-transformer';
import { IsNumber, Min } from 'class-validator';

export class GetProductsQuery {
    @Transform(({ value }) => parseInt(value))
    @IsNumber()
    @Min(1)
    page: number = 1;

    @Transform(({ value }) => parseInt(value))
    @IsNumber()
    @Min(1)
    limit: number = 10;
}