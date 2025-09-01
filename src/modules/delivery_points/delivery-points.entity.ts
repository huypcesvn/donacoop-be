import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Company } from '../companies/company.entity';
import { Registration } from '../registrations/registration.entity';

@Entity('delivery_points')
export class DeliveryPoint {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100, nullable: false })
  name: string; // e.g., điểm A, điểm B

  @Column({ type: 'float', nullable: true })
  distance: number; // km

  @ManyToOne(() => Company, (company) => company.deliveryPoints, { nullable: false })
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @OneToMany(() => Registration, (registration) => registration.destination)
  registrations: Registration[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
