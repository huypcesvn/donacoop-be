import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { DeliveryPoint } from '../delivery_points/delivery-points.entity';
import { User } from '../users/user.entity';
import { Truck } from '../trucks/truck.entity';
import { Machinery } from '../machineries/machinery.entity';
import { Warehouse } from '../warehouses/warehouse.entity';
import { Registration } from '../registrations/registration.entity';

@Entity('companies')
export class Company {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255, nullable: false })
  name: string;

  @Column({ length: 255, nullable: true })
  address: string;

  @Column({ length: 30, nullable: true })
  phone: string;

  @Column({ length: 255, nullable: true })
  city: string;

  @Column({ length: 100, nullable: true })
  email: string;

  @Column({ name: 'postal_code', length: 20, nullable: true })
  postalCode: string;

  @Column({ length: 255, nullable: true }) // e.g., 'seller', 'buyer', 'other' based on CTY Dona/Mua/khác
  type: string;

  @OneToMany(() => DeliveryPoint, (deliveryPoint) => deliveryPoint.company)
  deliveryPoints: DeliveryPoint[];

  @OneToMany(() => User, (user) => user.company)
  users: User[];

  @OneToMany(() => Truck, (truck) => truck.company)
  trucks: Truck[];

  @OneToMany(() => Machinery, (machinery) => machinery.company)
  machineries: Machinery[];

  @OneToMany(() => Warehouse, (warehouse) => warehouse.company)
  warehouses: Warehouse[];

  @OneToMany(() => Registration, (registration) => registration.buyerCompany)
  registrationsAsBuyer: Registration[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
