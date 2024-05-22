// 3_memberships.js
import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('memberships', function (table) {
    table.bigIncrements('id').primary();
    table
      .bigint('user_id')
      .unsigned()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE');
    table
      .bigint('community_id')
      .unsigned()
      .references('id')
      .inTable('communities')
      .onDelete('CASCADE');
    table.string('role', 255).notNullable().defaultTo('MEMBER');
    table.timestamp('joined_at').defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('memberships');
}
