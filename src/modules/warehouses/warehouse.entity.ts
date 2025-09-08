import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Company } from '../companies/company.entity';
import { Stock } from '../stocks/stock.entity';
import { Registration } from '../registrations/registration.entity';

@Entity('warehouses')
export class Warehouse {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255, nullable: false })
  name: string; // e.g., Kho A, kho B

  @ManyToOne(() => Company, (company) => company.warehouses, { nullable: true })
  @JoinColumn({ name: 'company_id' })
  company: Company | null;

  @OneToMany(() => Stock, (stock) => stock.warehouse)
  stocks: Stock[];

  @OneToMany(() => Registration, (registration) => registration.originWarehouse)
  registrationsAsOrigin: Registration[];

  @OneToMany(() => Registration, (registration) => registration.destinationWarehouse)
  registrationsAsDestination: Registration[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
