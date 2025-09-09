import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveTruckIsActiveAndAddRegistrationStatus1757383088685 implements MigrationInterface {
  name = 'RemoveTruckIsActiveAndAddRegistrationStatus1757383088685'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "trucks" DROP COLUMN "is_active"`);
    await queryRunner.query(`CREATE TYPE "public"."registrations_registration_status_enum" AS ENUM('pending', 'entered', 'exited', 'inactive')`);
    await queryRunner.query(`ALTER TABLE "registrations" ADD "registration_status" "public"."registrations_registration_status_enum" NOT NULL DEFAULT 'pending'`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "registrations" DROP COLUMN "registration_status"`);
    await queryRunner.query(`DROP TYPE "public"."registrations_registration_status_enum"`);
    await queryRunner.query(`ALTER TABLE "trucks" ADD "is_active" boolean NOT NULL DEFAULT true`);
  }
}
