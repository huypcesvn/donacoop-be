import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateBaseTables1756702973814 implements MigrationInterface {
  name = 'CreateBaseTables1756702973814'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "stone_types" ("id" SERIAL NOT NULL, "name" character varying(255) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_7d7ed17e76ea664ca6ae3d9a2b8" UNIQUE ("name"), CONSTRAINT "PK_cc871f2dfa6178fddcf6c6e7330" PRIMARY KEY ("id"))`);
    await queryRunner.query(`CREATE TABLE "machineries" ("id" SERIAL NOT NULL, "name" character varying(255) NOT NULL, "account" character varying(255), "password" character varying(50), "description" character varying(255), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "company_id" integer NOT NULL, "driver_id" integer, CONSTRAINT "PK_4804c762354b2a1f8c09f648b6f" PRIMARY KEY ("id"))`);
    await queryRunner.query(`CREATE TABLE "activities" ("id" SERIAL NOT NULL, "gate_in_time" TIMESTAMP, "weigh_time_1" TIMESTAMP, "weigh_position_1" character varying(255), "weight_1" double precision, "weigh_time_2" TIMESTAMP, "weigh_position_2" character varying(255), "weight_2" double precision, "gate_out_time" TIMESTAMP, "weighing_position" character varying(255), "revenue_type" character varying(255), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "truck_id" integer NOT NULL, "stone_type_id" integer, "pickup_position_id" integer, "buyer_company_id" integer, "registration_id" integer, CONSTRAINT "PK_7f4004429f731ffb9c88eb486a8" PRIMARY KEY ("id"))`);
    await queryRunner.query(`CREATE TABLE "trucks" ("id" SERIAL NOT NULL, "license_plate" character varying(20) NOT NULL, "code" character varying(20), "type" character varying(255), "group" character varying(255), "weighing_method" character varying(255), "weighing_position" character varying(255), "allowed_load" integer, "description" character varying(255), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "company_id" integer NOT NULL, "driver_id" integer, CONSTRAINT "UQ_fa19005276420375551368b7a5f" UNIQUE ("license_plate"), CONSTRAINT "PK_6a134fb7caa4fb476d8a6e035f9" PRIMARY KEY ("id"))`);
    await queryRunner.query(`CREATE TABLE "registrations" ("id" SERIAL NOT NULL, "trip_number" integer, "arrival_date" date, "arrival_time" character varying(50), "distance" double precision, "description" character varying(255), "revenue_type" character varying(255), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "truck_id" integer NOT NULL, "stone_type_id" integer, "pickup_position_id" integer, "buyer_company_id" integer, "destination_id" integer, "destination_warehouse_id" integer, CONSTRAINT "PK_6013e724d7b22929da9cd7282d1" PRIMARY KEY ("id"))`);
    await queryRunner.query(`CREATE TABLE "delivery_points" ("id" SERIAL NOT NULL, "name" character varying(100) NOT NULL, "distance" double precision, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "company_id" integer NOT NULL, CONSTRAINT "PK_ee6d715a5812180cd569684ac06" PRIMARY KEY ("id"))`);
    await queryRunner.query(`CREATE TABLE "companies" ("id" SERIAL NOT NULL, "name" character varying(255) NOT NULL, "address" character varying(255), "phone" character varying(30), "city" character varying(255), "email" character varying(100), "postal_code" character varying(20), "type" character varying(255), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_d4bc3e82a314fa9e29f652c2c22" PRIMARY KEY ("id"))`);
    await queryRunner.query(`CREATE TABLE "stocks" ("id" SERIAL NOT NULL, "quantity" double precision NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "warehouse_id" integer NOT NULL, "stone_type_id" integer NOT NULL, CONSTRAINT "PK_b5b1ee4ac914767229337974575" PRIMARY KEY ("id"))`);
    await queryRunner.query(`CREATE UNIQUE INDEX "IDX_d7324d85b65d6f744e31753d97" ON "stocks" ("warehouse_id", "stone_type_id") `);
    await queryRunner.query(`CREATE TABLE "warehouses" ("id" SERIAL NOT NULL, "name" character varying(255) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "company_id" integer, CONSTRAINT "PK_56ae21ee2432b2270b48867e4be" PRIMARY KEY ("id"))`);
    await queryRunner.query(`ALTER TABLE "users" ADD "position" character varying(100)`);
    await queryRunner.query(`ALTER TABLE "users" ADD "current_job" character varying(100)`);
    await queryRunner.query(`ALTER TABLE "users" ADD "personal_email" character varying(100)`);
    await queryRunner.query(`ALTER TABLE "users" ADD "personal_phone" character varying(50)`);
    await queryRunner.query(`ALTER TABLE "users" ADD "address" character varying(200)`);
    await queryRunner.query(`ALTER TABLE "users" ADD "city" character varying(100)`);
    await queryRunner.query(`ALTER TABLE "users" ADD "company_id" integer`);
    await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_7ae6334059289559722437bcc1c" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "machineries" ADD CONSTRAINT "FK_2e01d38c035a166974c2e51945b" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "machineries" ADD CONSTRAINT "FK_8094e7d6d3c6675fc14116dcd9e" FOREIGN KEY ("driver_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "activities" ADD CONSTRAINT "FK_99a8201297b90f46af67f8d837e" FOREIGN KEY ("truck_id") REFERENCES "trucks"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "activities" ADD CONSTRAINT "FK_4dbd2d524a8a443bbc43151f360" FOREIGN KEY ("stone_type_id") REFERENCES "stone_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "activities" ADD CONSTRAINT "FK_dc12977cdffb0148c0d1b512ec7" FOREIGN KEY ("pickup_position_id") REFERENCES "machineries"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "activities" ADD CONSTRAINT "FK_11717ea31b36b747d0dc19e27ec" FOREIGN KEY ("buyer_company_id") REFERENCES "companies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "activities" ADD CONSTRAINT "FK_34fd06a68df91edbdacf8e259c4" FOREIGN KEY ("registration_id") REFERENCES "registrations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "trucks" ADD CONSTRAINT "FK_13ba406d7a97de9081b6dfb683a" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "trucks" ADD CONSTRAINT "FK_df9c474095f43de64e840bc64df" FOREIGN KEY ("driver_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "registrations" ADD CONSTRAINT "FK_390631425c28e2dbd4b0c951d5a" FOREIGN KEY ("truck_id") REFERENCES "trucks"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "registrations" ADD CONSTRAINT "FK_0b1be3d172ad4fd3fadebe8f5fe" FOREIGN KEY ("stone_type_id") REFERENCES "stone_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "registrations" ADD CONSTRAINT "FK_17e880204ef5b952eef1ca61d40" FOREIGN KEY ("pickup_position_id") REFERENCES "machineries"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "registrations" ADD CONSTRAINT "FK_4d222c9c5035f60a9e50b0c7dd4" FOREIGN KEY ("buyer_company_id") REFERENCES "companies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "registrations" ADD CONSTRAINT "FK_23315b5a849ccca1ccf4ae3e36e" FOREIGN KEY ("destination_id") REFERENCES "delivery_points"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "registrations" ADD CONSTRAINT "FK_63294c95a2cc10b0642cadace49" FOREIGN KEY ("destination_warehouse_id") REFERENCES "warehouses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "delivery_points" ADD CONSTRAINT "FK_276dbda568ece02316810d0b1d3" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "stocks" ADD CONSTRAINT "FK_b9acd455e80b402a2058d11ef46" FOREIGN KEY ("warehouse_id") REFERENCES "warehouses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "stocks" ADD CONSTRAINT "FK_39db15b4f5a453cfa6605af8895" FOREIGN KEY ("stone_type_id") REFERENCES "stone_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "warehouses" ADD CONSTRAINT "FK_3fcbfd5832b46945f514a7d1f56" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "warehouses" DROP CONSTRAINT "FK_3fcbfd5832b46945f514a7d1f56"`);
    await queryRunner.query(`ALTER TABLE "stocks" DROP CONSTRAINT "FK_39db15b4f5a453cfa6605af8895"`);
    await queryRunner.query(`ALTER TABLE "stocks" DROP CONSTRAINT "FK_b9acd455e80b402a2058d11ef46"`);
    await queryRunner.query(`ALTER TABLE "delivery_points" DROP CONSTRAINT "FK_276dbda568ece02316810d0b1d3"`);
    await queryRunner.query(`ALTER TABLE "registrations" DROP CONSTRAINT "FK_63294c95a2cc10b0642cadace49"`);
    await queryRunner.query(`ALTER TABLE "registrations" DROP CONSTRAINT "FK_23315b5a849ccca1ccf4ae3e36e"`);
    await queryRunner.query(`ALTER TABLE "registrations" DROP CONSTRAINT "FK_4d222c9c5035f60a9e50b0c7dd4"`);
    await queryRunner.query(`ALTER TABLE "registrations" DROP CONSTRAINT "FK_17e880204ef5b952eef1ca61d40"`);
    await queryRunner.query(`ALTER TABLE "registrations" DROP CONSTRAINT "FK_0b1be3d172ad4fd3fadebe8f5fe"`);
    await queryRunner.query(`ALTER TABLE "registrations" DROP CONSTRAINT "FK_390631425c28e2dbd4b0c951d5a"`);
    await queryRunner.query(`ALTER TABLE "trucks" DROP CONSTRAINT "FK_df9c474095f43de64e840bc64df"`);
    await queryRunner.query(`ALTER TABLE "trucks" DROP CONSTRAINT "FK_13ba406d7a97de9081b6dfb683a"`);
    await queryRunner.query(`ALTER TABLE "activities" DROP CONSTRAINT "FK_34fd06a68df91edbdacf8e259c4"`);
    await queryRunner.query(`ALTER TABLE "activities" DROP CONSTRAINT "FK_11717ea31b36b747d0dc19e27ec"`);
    await queryRunner.query(`ALTER TABLE "activities" DROP CONSTRAINT "FK_dc12977cdffb0148c0d1b512ec7"`);
    await queryRunner.query(`ALTER TABLE "activities" DROP CONSTRAINT "FK_4dbd2d524a8a443bbc43151f360"`);
    await queryRunner.query(`ALTER TABLE "activities" DROP CONSTRAINT "FK_99a8201297b90f46af67f8d837e"`);
    await queryRunner.query(`ALTER TABLE "machineries" DROP CONSTRAINT "FK_8094e7d6d3c6675fc14116dcd9e"`);
    await queryRunner.query(`ALTER TABLE "machineries" DROP CONSTRAINT "FK_2e01d38c035a166974c2e51945b"`);
    await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_7ae6334059289559722437bcc1c"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "company_id"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "city"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "address"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "personal_phone"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "personal_email"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "current_job"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "position"`);
    await queryRunner.query(`DROP TABLE "warehouses"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_d7324d85b65d6f744e31753d97"`);
    await queryRunner.query(`DROP TABLE "stocks"`);
    await queryRunner.query(`DROP TABLE "companies"`);
    await queryRunner.query(`DROP TABLE "delivery_points"`);
    await queryRunner.query(`DROP TABLE "registrations"`);
    await queryRunner.query(`DROP TABLE "trucks"`);
    await queryRunner.query(`DROP TABLE "activities"`);
    await queryRunner.query(`DROP TABLE "machineries"`);
    await queryRunner.query(`DROP TABLE "stone_types"`);
  }
}
