import 'reflect-metadata';
import * as argon2 from 'argon2';
import { User } from '../../modules/users/entities/user.entity';
import { Role } from '../../modules/roles/role.entity';
import { Permission } from '../../modules/users/entities/permission.entity';
import { AppDataSource } from '../data-source';
import { PERMISSIONS } from 'src/common/constants/permissions.constant';

async function seed() {
  await AppDataSource.initialize();

  const userRepo = AppDataSource.getRepository(User);
  const roleRepo = AppDataSource.getRepository(Role);
  const permRepo = AppDataSource.getRepository(Permission);

  // 1️⃣ Seed permissions theo PERMISSIONS constant
  for (const resourceKey of Object.keys(PERMISSIONS)) {
    const actions = PERMISSIONS[resourceKey as keyof typeof PERMISSIONS];
    for (const actionKey of Object.keys(actions)) {
      const { resource, action } = actions[actionKey as keyof typeof actions];

      const exists = await permRepo.findOne({ where: { resource, action } });
      if (!exists) {
        const perm = permRepo.create({ resource, action });
        await permRepo.save(perm);
      }
    }
  }

  // 2️⃣ Seed roles
  const roleDefs = [
    { name: 'Admin', key: 'admin' },
    { name: 'Manager', key: 'manager' },
    { name: 'Accountant', key: 'accountant' },
    { name: 'Mine Director', key: 'mine_director' },
    { name: 'Mine Manager', key: 'mine_manager' },
    { name: 'Driver', key: 'driver' },
  ];

  for (const r of roleDefs) {
    let role = await roleRepo.findOne({ where: { key: r.key } });
    if (!role) {
      role = roleRepo.create({ name: r.name, key: r.key });
      await roleRepo.save(role);
    }
  }

  // 3️⃣ Seed admin user
  const adminUsername = '0935033682';
  let admin = await userRepo.findOne({ where: { username: adminUsername }, relations: ['roles'] });

  if (!admin) {
    const adminRole = await roleRepo.findOne({ where: { key: 'admin' } });
    const passwordHash = await argon2.hash('123456');

    admin = userRepo.create({
      fullName: 'System Administrator',
      username: adminUsername,
      password: passwordHash,
      personalEmail: 'huy@gmail.com',
      currentJob: 'Software Engineer',
      address: 'District 5',
      city: 'Cho Lon',
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
