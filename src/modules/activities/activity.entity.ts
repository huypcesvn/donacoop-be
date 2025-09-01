import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Truck } from '../trucks/truck.entity';
import { StoneType } from '../stone_types/stone-type.entity';
import { Machinery } from '../machineries/machinery.entity';
import { Company } from '../companies/company.entity';
import { Registration } from '../registrations/registration.entity';

@Entity('activities')
export class Activity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'gate_in_time', type: 'timestamp', nullable: true })
  gateInTime: Date; // Thời gian vào cổng

  @Column({ name: 'weigh_time_1', type: 'timestamp', nullable: true })
  weighTime1: Date; // Thời gian cân lần 1

  @Column({ name: 'weigh_position_1', length: 255, nullable: true })
  weighPosition1: string; // Vị trí cân lần 1

  @Column({ name: 'weight_1', type: 'float', nullable: true })
  weight1: number; // Khối lượng 1 (KG)

  @Column({ name: 'weigh_time_2', type: 'timestamp', nullable: true })
  weighTime2: Date; // Thời gian cân lần 2

  @Column({ name: 'weigh_position_2', length: 255, nullable: true })
  weighPosition2: string; // Vị trí cân lần 2

  @Column({ name: 'weight_2', type: 'float', nullable: true })
  weight2: number; // Khối lượng 2 (KG)

  @Column({ name: 'gate_out_time', type: 'timestamp', nullable: true })
  gateOutTime: Date; // Thời gian ra cổng

  @Column({ name: 'weighing_position', length: 255, nullable: true })
  weighingPosition: string; // Vị trí cân

  @Column({ name: 'revenue_type', length: 255, nullable: true })
  revenueType: string;

  @ManyToOne(() => Truck, (truck) => truck.activities, { nullable: false })
  @JoinColumn({ name: 'truck_id' })
  truck: Truck;

  @ManyToOne(() => StoneType, { nullable: true })
  @JoinColumn({ name: 'stone_type_id' })
  stoneType: StoneType;

  @ManyToOne(() => Machinery, { nullable: true })
  @JoinColumn({ name: 'pickup_position_id' })
  pickupPosition: Machinery;

  @ManyToOne(() => Company, { nullable: true })
  @JoinColumn({ name: 'buyer_company_id' })
  buyerCompany: Company;

  @ManyToOne(() => Registration, { nullable: true })
  @JoinColumn({ name: 'registration_id' })
  registration: Registration; // Optional link to related registration

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
