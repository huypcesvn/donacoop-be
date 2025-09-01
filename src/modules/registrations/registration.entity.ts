import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Truck } from '../trucks/truck.entity';
import { StoneType } from '../stone_types/stone-type.entity';
import { Machinery } from '../machineries/machinery.entity';
import { Company } from '../companies/company.entity';
import { DeliveryPoint } from '../delivery_points/delivery-points.entity';
import { Warehouse } from '../warehouses/warehouse.entity';

@Entity('registrations')
export class Registration {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'trip_number', type: 'int', nullable: true })
  tripNumber: number; // STT chuyến xe

  @Column({ name: 'arrival_date', type: 'date', nullable: true })
  arrivalDate: Date; // Ngày tới

  @Column({ name: 'arrival_time', length: 50, nullable: true })
  arrivalTime: string; // Thời gian tới, e.g., 08:00-09:00

  @Column({ type: 'float', nullable: true })
  distance: number; // Quãng đường (km)

  @Column({ length: 255, nullable: true })
  description: string;

  @Column({ name: 'revenue_type', length: 255, nullable: true })
  revenueType: string; // Doanh thu, e.g., Bán hàng, Hàng tồn, Di dời

  // Duplicated from buyer company if needed, but better to reference
  // If denormalization needed, add email, phone, etc., but prefer relations

  @ManyToOne(() => Truck, (truck) => truck.registrations, { nullable: false })
  @JoinColumn({ name: 'truck_id' })
  truck: Truck;

  @ManyToOne(() => StoneType, { nullable: true })
  @JoinColumn({ name: 'stone_type_id' })
  stoneType: StoneType;

  @ManyToOne(() => Machinery, (machinery) => machinery.registrations, { nullable: true })
  @JoinColumn({ name: 'pickup_position_id' })
  pickupPosition: Machinery; // Vị trí lấy đá, e.g., Xe xúc 1

  @ManyToOne(() => Company, (company) => company.registrationsAsBuyer, { nullable: true })
  @JoinColumn({ name: 'buyer_company_id' })
  buyerCompany: Company; // CTY mua

  @ManyToOne(() => DeliveryPoint, (deliveryPoint) => deliveryPoint.registrations, { nullable: true })
  @JoinColumn({ name: 'destination_id' })
  destination: DeliveryPoint; // Điểm đến (for buyers)

  @ManyToOne(() => Warehouse, (warehouse) => warehouse.registrationsAsDestination, { nullable: true })
  @JoinColumn({ name: 'destination_warehouse_id' })
  destinationWarehouse: Warehouse; // For Di dời or Hàng tồn, e.g., Kho B, Bãi A (treat Bãi as warehouse)

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
