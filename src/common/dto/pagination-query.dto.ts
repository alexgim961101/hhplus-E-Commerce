import { Transform } from "class-transformer";
import { IsOptional, IsNumber } from "class-validator";

export class PaginationQueryDto {
    @Transform(({ value }) => parseInt(value))
    @IsOptional()
    @IsNumber()
    page?: number;

    @Transform(({ value }) => parseInt(value))
    @IsOptional()
    @IsNumber()
    limit?: number;
}