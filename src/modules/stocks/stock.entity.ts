import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Warehouse } from '../warehouses/warehouse.entity';
import { StoneType } from '../stone_types/stone-type.entity';

@Entity('stocks')
export class Stock {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'float' })
  quantity: number; // Assume in KG or some unit

  @ManyToOne(() => Warehouse, (warehouse) => warehouse.stocks, { nullable: false })
  @JoinColumn({ name: 'warehouse_id' })
  warehouse: Warehouse;

  @ManyToOne(() => StoneType, { nullable: false })
  @JoinColumn({ name: 'stone_type_id' })
  stoneType: StoneType;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
