import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIsActiveToTrucks1757303662534 implements MigrationInterface {
  name = 'AddIsActiveToTrucks1757303662534'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "trucks" ADD "is_active" boolean NOT NULL DEFAULT true`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "trucks" DROP COLUMN "is_active"`);
  }
}
