// 5_comments.js
import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('comments', function (table) {
    table.increments('id').primary();
    table
      .integer('post_id')
      .unsigned()
      .references('id')
      .inTable('posts')
      .onDelete('CASCADE');
    table
      .integer('user_id')
      .unsigned()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE');
    table.text('content').notNullable();
    table.timestamps(true, true);  // Automatically adds created_at and updated_at
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('comments');
}
