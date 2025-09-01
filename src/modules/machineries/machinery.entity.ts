import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Company } from '../companies/company.entity';
import { User } from '../users/entities/user.entity';
import { Registration } from '../registrations/registration.entity';

@Entity('machineries')
export class Machinery {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255, nullable: false })
  name: string; // e.g., Xe xúc 1, Xe cuốc

  @Column({ length: 255, nullable: true })
  account: string; // e.g., xexuc1

  @Column({ length: 50, nullable: true })
  password: string; // e.g., mkxexuc1 (consider hashing if sensitive)

  @Column({ length: 255, nullable: true })
  description: string;

  @ManyToOne(() => Company, (company) => company.machineries, { nullable: false })
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'driver_id' })
  driver: User;

  @OneToMany(() => Registration, (registration) => registration.pickupPosition)
  registrations: Registration[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
