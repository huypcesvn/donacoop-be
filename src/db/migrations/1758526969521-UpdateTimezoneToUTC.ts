import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateTimezoneToUTC1758526969521 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    const dbName = queryRunner.connection.driver.database as string;
    await queryRunner.query(`ALTER DATABASE "${dbName}" SET timezone TO 'UTC';`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const dbName = queryRunner.connection.driver.database as string;
    await queryRunner.query(`ALTER DATABASE "${dbName}" SET timezone TO 'Asia/Ho_Chi_Minh';`);
  }
}
