import { MigrationInterface, QueryRunner } from "typeorm";

export class AddOriginWarehouseToRegistrations1757314870193 implements MigrationInterface {
  name = 'AddOriginWarehouseToRegistrations1757314870193'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "registrations" ADD "origin_warehouse_id" integer`);
    await queryRunner.query(`ALTER TABLE "registrations" ADD CONSTRAINT "FK_20639c052917c9734a9028d48e0" FOREIGN KEY ("origin_warehouse_id") REFERENCES "warehouses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "registrations" DROP CONSTRAINT "FK_20639c052917c9734a9028d48e0"`);
    await queryRunner.query(`ALTER TABLE "registrations" DROP COLUMN "origin_warehouse_id"`);
  }
}
