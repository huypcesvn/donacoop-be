import { Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Role } from '../../roles/role.entity';
import { Company } from '../../companies/company.entity';
import { Exclude } from 'class-transformer';

@Entity('users')
export class User {
  static readonly DEFAULT_PASSWORD = '123456';

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'full_name', length: 100, nullable: false })
  fullName: string;

  @Column({ length: 16, unique: true, nullable: true })
  username: string;

  @Exclude()  // Exclude this field from any serialized response (never sent to the client)
  @Column({ length: 110, nullable: true })
  password: string;

  @Column({ length: 100, nullable: true })
  position: string; // Chức vụ, e.g., Quản lí, tài xế (though role might cover, but sheet has it separately)

  @Column({ name: 'current_job', length: 100, nullable: true })
  currentJob: string; // Công việc hiện tại

  @Column({ name: 'personal_email', length: 100, nullable: true })
  personalEmail: string;

  @Column({ name: 'personal_phone', length: 50, nullable: true })
  personalPhone: string;

  @Column({ length: 200, nullable: true })
  address: string;

  @Column({ length: 100, nullable: true })
  city: string;

  @ManyToMany(() => Role, (role) => role.users)
  @JoinTable({
    name: 'user_roles',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'role_id', referencedColumnName: 'id' },
  })
  roles: Role[];

  @ManyToOne(() => Company, (company) => company.users, { nullable: true })
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Check permission
  // const user = await userRepository.findOne();
  // user.can('post', 'delete')
  can(resource: string, action: string): boolean {
    return this.roles.some(role => 
      role.key === 'admin' || role.permissions.some(p => p.resource === resource && p.action === action)
    );
  }
}
