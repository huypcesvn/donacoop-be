import { MigrationInterface, QueryRunner } from "typeorm";

export class AddForeignKeyForDeliveryPoints1757154541401 implements MigrationInterface {
  name = 'AddForeignKeyForDeliveryPoints1757154541401'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "delivery_points" DROP CONSTRAINT "FK_276dbda568ece02316810d0b1d3"`);
    await queryRunner.query(`ALTER TABLE "delivery_points" ADD CONSTRAINT "FK_276dbda568ece02316810d0b1d3" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "delivery_points" DROP CONSTRAINT "FK_276dbda568ece02316810d0b1d3"`);
    await queryRunner.query(`ALTER TABLE "delivery_points" ADD CONSTRAINT "FK_276dbda568ece02316810d0b1d3" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
  }
}
