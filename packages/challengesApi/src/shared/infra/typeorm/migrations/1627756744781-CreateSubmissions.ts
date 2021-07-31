import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreateSubmissions1627756744781
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'submissions',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'challenge_id',
            type: 'uuid',
          },
          {
            name: 'repository_url',
            type: 'varchar',
          },
          {
            name: 'status',
            type: 'enum',
            enum: ['pending', 'error', 'done'],
            default: "'pending'",
          },

          {
            name: 'grade',
            type: 'numeric',
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          },
        ],
        foreignKeys: [
          {
            name: 'challengeId',
            referencedTableName: 'challenges',
            referencedColumnNames: ['id'],
            columnNames: ['challenge_id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('submissions');
  }
}
