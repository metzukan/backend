import { generateEnumQuery, getEnumName, UserStatus } from '../core';
import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class FirstVersion1602366931964 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await this._createEnums(queryRunner);
    await this._createTables(queryRunner);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable('users', true, true);
    await queryRunner.query(generateEnumQuery('drop', 'user_status'));
  }

  private async _createEnums(queryRunner: QueryRunner) {
    await queryRunner.query(
      generateEnumQuery('create', 'user_status', [
        UserStatus.OK,
        UserStatus.NOT_RESPONDING,
        UserStatus.EMERGENCY
      ])
    );
  }

  private async _createTables(queryRunner: QueryRunner) {
    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          {
            name: 'guid',
            type: 'varchar',
            length: '36',
            isPrimary: true,
            isNullable: false
          },
          {
            name: 'self_email',
            type: 'varchar',
            length: '150',
            isNullable: false
          },
          {
            name: 'nickname',
            type: 'varchar',
            length: '100',
            isNullable: false
          },
          {
            name: 'next_ack',
            type: 'int',
            isNullable: true
          },
          {
            name: 'status',
            type: getEnumName('user_status'),
            isNullable: false
          }
        ]
      }),
      true
    );
  }
}
