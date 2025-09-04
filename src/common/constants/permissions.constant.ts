import { Permission } from "../decorators/permissions.decorator";

export const PERMISSIONS = {
  USER: {
    CREATE: { resource: 'user', action: 'create' } as Permission,
    UPDATE: { resource: 'user', action: 'update' } as Permission,
    DELETE: { resource: 'user', action: 'delete' } as Permission,
    VIEW:   { resource: 'user', action: 'view'   } as Permission,
  },
  COMPANY: {
    CREATE: { resource: 'company', action: 'create' } as Permission,
    UPDATE: { resource: 'company', action: 'update' } as Permission,
    DELETE: { resource: 'company', action: 'delete' } as Permission,
    VIEW:   { resource: 'company', action: 'view'   } as Permission,
  },
  TRUCK: {
    CREATE: { resource: 'truck', action: 'create' } as Permission,
    UPDATE: { resource: 'truck', action: 'update' } as Permission,
    DELETE: { resource: 'truck', action: 'delete' } as Permission,
    VIEW:   { resource: 'truck', action: 'view'   } as Permission,
  },
  MACHINE: {
    CREATE: { resource: 'machine', action: 'create' } as Permission,
    UPDATE: { resource: 'machine', action: 'update' } as Permission,
    DELETE: { resource: 'machine', action: 'delete' } as Permission,
    VIEW:   { resource: 'machine', action: 'view'   } as Permission,
  },
  WAREHOUSE: {
    CREATE: { resource: 'warehouse', action: 'create' } as Permission,
    UPDATE: { resource: 'warehouse', action: 'update' } as Permission,
    DELETE: { resource: 'warehouse', action: 'delete' } as Permission,
    VIEW:   { resource: 'warehouse', action: 'view'   } as Permission,
  },
  STONE_TYPE: {
    CREATE: { resource: 'stone_type', action: 'create' } as Permission,
    UPDATE: { resource: 'stone_type', action: 'update' } as Permission,
    DELETE: { resource: 'stone_type', action: 'delete' } as Permission,
    VIEW:   { resource: 'stone_type', action: 'view'   } as Permission,
  },
  DELIVERY_POINT: {
    CREATE: { resource: 'delivery_point', action: 'create' } as Permission,
    UPDATE: { resource: 'delivery_point', action: 'update' } as Permission,
    DELETE: { resource: 'delivery_point', action: 'delete' } as Permission,
    VIEW:   { resource: 'delivery_point', action: 'view'   } as Permission,
  },
  STOCK: {
    CREATE: { resource: 'stock', action: 'create' } as Permission,
    UPDATE: { resource: 'stock', action: 'update' } as Permission,
    DELETE: { resource: 'stock', action: 'delete' } as Permission,
    VIEW:   { resource: 'stock', action: 'view'   } as Permission,
  },
  DISPATCH_MACHINE: {
    CREATE: { resource: 'dispatch_machine', action: 'create' } as Permission,
    UPDATE: { resource: 'dispatch_machine', action: 'update' } as Permission,
    DELETE: { resource: 'dispatch_machine', action: 'delete' } as Permission,
    VIEW:   { resource: 'dispatch_machine', action: 'view'   } as Permission,
  },
  TRUCK_REGISTRATION: {
    CREATE: { resource: 'truck_registration', action: 'create' } as Permission,
    UPDATE: { resource: 'truck_registration', action: 'update' } as Permission,
    DELETE: { resource: 'truck_registration', action: 'delete' } as Permission,
    VIEW:   { resource: 'truck_registration', action: 'view'   } as Permission,
  },
  ACTIVITY_TRACKING: {
    CREATE: { resource: 'activity_tracking', action: 'create' } as Permission,
    UPDATE: { resource: 'activity_tracking', action: 'update' } as Permission,
    DELETE: { resource: 'activity_tracking', action: 'delete' } as Permission,
    VIEW:   { resource: 'activity_tracking', action: 'view'   } as Permission,
  },
};
