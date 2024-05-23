// 4_posts.js
import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('posts', function (table) {
    table.bigIncrements('id').primary();
    table
      .bigint('community_id')
      .unsigned()
      .references('id')
      .inTable('communities')
      .onDelete('CASCADE');
    table
      .bigint('user_id')
      .unsigned()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE');
    table.string('title', 255).notNullable();
    table.text('content').notNullable();
    table.timestamps(true, true);  // Automatically adds created_at and updated_at
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('posts');
}
