import { MigrationInterface, QueryRunner } from "typeorm";

export class AddKeyToRoles1756807219471 implements MigrationInterface {
  name = 'AddKeyToRoles1756807219471'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "roles" ADD "key" character varying(50) NOT NULL`);
    await queryRunner.query(`ALTER TABLE "roles" ADD CONSTRAINT "UQ_a87cf0659c3ac379b339acf36a2" UNIQUE ("key")`);
    await queryRunner.query(`ALTER TABLE "permissions" ADD CONSTRAINT "UQ_7331684c0c5b063803a425001a0" UNIQUE ("resource", "action")`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "permissions" DROP CONSTRAINT "UQ_7331684c0c5b063803a425001a0"`);
    await queryRunner.query(`ALTER TABLE "roles" DROP CONSTRAINT "UQ_a87cf0659c3ac379b339acf36a2"`);
    await queryRunner.query(`ALTER TABLE "roles" DROP COLUMN "key"`);
  }
}
