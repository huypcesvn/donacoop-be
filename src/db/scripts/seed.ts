import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import * as argon2 from 'argon2';

import { User } from '../../modules/users/entities/user.entity';
import { Role } from '../../modules/users/entities/role.entity';
import { Permission } from '../../modules/users/entities/permission.entity';

dotenv.config();

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [User, Role, Permission],
  synchronize: false,
  logging: true,
});

async function seed() {
  await AppDataSource.initialize();

  const userRepo = AppDataSource.getRepository(User);
  const roleRepo = AppDataSource.getRepository(Role);
  const permRepo = AppDataSource.getRepository(Permission);

  // 1. Seed permissions
  const permissions = [
    'create_user',
    'add_company',
    'add_employee',
    'add_truck',
    'add_machine',
    'warehouse_view',
    'warehouse_edit',
    'dispatch_machine_view',
    'dispatch_machine_edit',
    'truck_registration_view',
    'truck_registration_edit',
    'activity_tracking_view',
    'activity_tracking_edit',
  ];

  const permEntities: Permission[] = [];
  for (const p of permissions) {
    let perm = await permRepo.findOne({ where: { name: p } });
    if (!perm) {
      perm = permRepo.create({ name: p });
      perm = await permRepo.save(perm);
    }
    permEntities.push(perm);
  }

  // 2. Seed roles
  const roleNames = [
    'Admin',
    'Manager',
    'Accountant',
    'Mine Director',
    'Mine Manager',
    'Driver',
  ];

  for (const r of roleNames) {
    let role = await roleRepo.findOne({
      where: { name: r },
      relations: ['permissions'],
    });

    if (!role) {
      role = roleRepo.create({ name: r });
    }

    // Admin full quyền
    if (r === 'Admin') {
      role.permissions = permEntities;
    }

    await roleRepo.save(role);
  }

  // 3. Seed admin user
  const adminUsername = '0935033682';
  let admin = await userRepo.findOne({
    where: { username: adminUsername },
    relations: ['roles'],
  });

  if (!admin) {
    const adminRole = await roleRepo.findOne({
      where: { name: 'Admin' },
      relations: ['permissions'],
    });

    const passwordHash = await argon2.hash('123456');
    admin = userRepo.create({
      fullName: 'System Administrator',
      username: adminUsername,
      password: passwordHash,
      roles: [adminRole!],
    });

    await userRepo.save(admin);
    console.log('✅ Admin user created!');
  } else {
    console.log('ℹ️ Admin user already exists.');
  }

  console.log('✅ Seed completed!');
  await AppDataSource.destroy();
  process.exit(0);
}

seed().catch(async (e) => {
  console.error('❌ Seed failed:', e);
  await AppDataSource.destroy();
  process.exit(1);
});
