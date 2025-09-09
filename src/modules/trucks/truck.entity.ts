import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Company } from '../companies/company.entity';
import { User } from '../users/user.entity';
import { Registration } from '../registrations/registration.entity';
import { Activity } from '../activities/activity.entity';

@Entity('trucks')
export class Truck {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'license_plate', length: 20, unique: true, nullable: false })
  licensePlate: string; // e.g., 60C-11111

  @Column({ length: 20, nullable: true })
  code: string; // e.g., 001

  @Column({ length: 255, nullable: true })
  type: string; // e.g., Shacman, Kamaz

  @Column({ length: 255, nullable: true })
  group: string; // e.g., Group1, Group2

  @Column({ name: 'weighing_method', length: 255, nullable: true })
  weighingMethod: string; // e.g., Cân mỗi đầu ngày, Cân 1 lần, Cân mỗi chuyến

  @Column({ name: 'weighing_position', length: 255, nullable: true })
  weighingPosition: string; // e.g., Cân 2

  @Column({ name: 'allowed_load', type: 'int', nullable: true })
  allowedLoad: number; // e.g., 21000 (KG?)

  @Column({ length: 255, nullable: true })
  description: string;

  @ManyToOne(() => Company, (company) => company.trucks, { nullable: false })
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'driver_id' })
  driver: User | null;

  @OneToMany(() => Registration, (registration) => registration.truck)
  registrations: Registration[];

  @OneToMany(() => Activity, (activity) => activity.truck)
  activities: Activity[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
