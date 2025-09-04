import { IsNumber, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateStockDto {
  @Type(() => Number)
  @IsNumber()
  quantity: number;

  @Type(() => Number)
  @IsInt()
  warehouseId: number;

  @Type(() => Number)
  @IsInt()
  stoneTypeId: number;
}
