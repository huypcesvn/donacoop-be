import { MigrationInterface, QueryRunner } from "typeorm";

export class AddOnDeleteToWarehouse1757220595456 implements MigrationInterface {
  name = 'AddOnDeleteToWarehouse1757220595456'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "stocks" DROP CONSTRAINT "FK_b9acd455e80b402a2058d11ef46"`);
    await queryRunner.query(`ALTER TABLE "stocks" ADD CONSTRAINT "FK_b9acd455e80b402a2058d11ef46" FOREIGN KEY ("warehouse_id") REFERENCES "warehouses"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "stocks" DROP CONSTRAINT "FK_b9acd455e80b402a2058d11ef46"`);
    await queryRunner.query(`ALTER TABLE "stocks" ADD CONSTRAINT "FK_b9acd455e80b402a2058d11ef46" FOREIGN KEY ("warehouse_id") REFERENCES "warehouses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
  }
}
