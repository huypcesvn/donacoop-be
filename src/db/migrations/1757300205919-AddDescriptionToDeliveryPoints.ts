import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDescriptionToDeliveryPoints1757300205919 implements MigrationInterface {
  name = 'AddDescriptionToDeliveryPoints1757300205919'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "delivery_points" ADD "description" text`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "delivery_points" DROP COLUMN "description"`);
  }
}
