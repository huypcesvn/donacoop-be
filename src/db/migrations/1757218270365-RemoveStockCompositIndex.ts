import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveStockCompositIndex1757218270365 implements MigrationInterface {
  name = 'RemoveStockCompositIndex1757218270365'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."IDX_d7324d85b65d6f744e31753d97"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE UNIQUE INDEX "IDX_d7324d85b65d6f744e31753d97" ON "stocks" ("stone_type_id", "warehouse_id") `);
  }
}
