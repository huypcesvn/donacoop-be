import 'reflect-metadata';
import * as argon2 from 'argon2';
import { User } from '../../modules/users/entities/user.entity';
import { Role } from '../../modules/users/entities/role.entity';
import { Permission } from '../../modules/users/entities/permission.entity';
import { AppDataSource } from '../data-source';

async function seed() {
  await AppDataSource.initialize();

  const userRepo = AppDataSource.getRepository(User);
  const roleRepo = AppDataSource.getRepository(Role);
  const permRepo = AppDataSource.getRepository(Permission);

  // 1️⃣ Seed permissions (resource + action)
  const permissionsData = [
    { resource: 'user', action: 'create' },
    { resource: 'company', action: 'add' },
    { resource: 'employee', action: 'add' },
    { resource: 'truck', action: 'add' },
    { resource: 'machine', action: 'add' },
    { resource: 'warehouse', action: 'view' },
    { resource: 'warehouse', action: 'edit' },
    { resource: 'dispatch_machine', action: 'view' },
    { resource: 'dispatch_machine', action: 'edit' },
    { resource: 'truck_registration', action: 'view' },
    { resource: 'truck_registration', action: 'edit' },
    { resource: 'activity_tracking', action: 'view' },
    { resource: 'activity_tracking', action: 'edit' },
  ];

  const permEntities: Permission[] = [];
  for (const p of permissionsData) {
    let perm = await permRepo.findOne({ where: { resource: p.resource, action: p.action } });
    if (!perm) {
      perm = permRepo.create({ resource: p.resource, action: p.action });
      perm = await permRepo.save(perm);
    }
    permEntities.push(perm);
  }

  // 2️⃣ Seed roles
  const roleNames = ['Admin', 'Manager', 'Accountant', 'Mine Director', 'Mine Manager', 'Driver'];
  for (const r of roleNames) {
    let role = await roleRepo.findOne({ where: { name: r }, relations: ['permissions'] });
    if (!role) role = roleRepo.create({ name: r });

    // Admin full quyền
    if (r === 'Admin') role.permissions = permEntities;

    await roleRepo.save(role);
  }

  // 3️⃣ Seed admin user
  const adminUsername = '0935033682';
  let admin = await userRepo.findOne({ where: { username: adminUsername }, relations: ['roles'] });

  if (!admin) {
    const adminRole = await roleRepo.findOne({ where: { name: 'Admin' }, relations: ['permissions'] });
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
