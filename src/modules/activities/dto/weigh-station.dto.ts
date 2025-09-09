import { IsInt, IsNumber, IsString, MaxLength } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class WeighStationDto {
  @IsString()
  @MaxLength(20)
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  licensePlate: string;

  @IsNumber()
  @Type(() => Number)
  weight: number;

  @IsInt()
  @Type(() => Number)
  stoneTypeId: number;

  @IsString()
  weighStation: string;
}
