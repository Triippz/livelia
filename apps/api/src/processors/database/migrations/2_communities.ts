// 2_communities.js
import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('communities', function (table) {
    table.bigIncrements('id').primary();
    table.string('name', 255).notNullable().index('idx_communities_name');
    table.text('description');
    table.timestamps(true, true);  // Automatically adds created_at and updated_at
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('communities');
}
