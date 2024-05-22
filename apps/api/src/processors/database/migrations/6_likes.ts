import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('likes', function (table) {
    table.bigIncrements('id').primary();
    table
      .bigint('user_id')
      .unsigned()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE');
    table
      .bigInteger('post_id')
      .unsigned()
      .references('id')
      .inTable('posts')
      .onDelete('CASCADE');
    table.timestamps(true, true);  // Automatically adds created_at and updated_at
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('likes');
}
