import { MigrationInterface, QueryRunner } from "typeorm";

export class AddResourceAndActionToPermissions1756696400170 implements MigrationInterface {
  name = 'AddResourceAndActionToPermissions1756696400170'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "permissions" DROP CONSTRAINT "UQ_48ce552495d14eae9b187bb6716"`);
    await queryRunner.query(`ALTER TABLE "permissions" DROP COLUMN "name"`);
    await queryRunner.query(`ALTER TABLE "permissions" ADD "resource" character varying(50) NOT NULL`);
    await queryRunner.query(`ALTER TABLE "permissions" ADD "action" character varying(50) NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "permissions" DROP COLUMN "action"`);
    await queryRunner.query(`ALTER TABLE "permissions" DROP COLUMN "resource"`);
    await queryRunner.query(`ALTER TABLE "permissions" ADD "name" character varying(100) NOT NULL`);
    await queryRunner.query(`ALTER TABLE "permissions" ADD CONSTRAINT "UQ_48ce552495d14eae9b187bb6716" UNIQUE ("name")`);
  }
}
