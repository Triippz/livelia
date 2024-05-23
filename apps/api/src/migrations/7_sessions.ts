import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('sessions', function (table) {
    table.bigIncrements('id').primary();
    table
      .bigInteger('user_id')
      .unsigned()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE');
    table.string('token', 255).notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('expires_at').notNullable();
    table.index(['user_id', 'token'], 'idx_sessions_user_id_token');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('sessions');
}
