import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Role } from './role.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'full_name', length: 100, nullable: false })
  fullName: string;

  @Column({ length: 16, unique: true, nullable: true })
  username: string;

  @Column({ length: 110, nullable: true })
  password: string;

  @ManyToMany(() => Role, (role) => role.users, { eager: true })
  @JoinTable({
    name: 'user_roles',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'role_id', referencedColumnName: 'id' },
  })
  roles: Role[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Check permission
  // const user = await userRepository.findOne();
  // user.can('post', 'delete')
  can(resource: string, action: string): boolean {
    return this.roles.some(role =>
      role.permissions.some(p => p.resource === resource && p.action === action)
    );
  }
}
