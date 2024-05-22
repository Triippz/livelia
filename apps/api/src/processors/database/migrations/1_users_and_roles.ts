import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema
    .createTable('roles', function (table) {
      table.increments('id').primary();
      table.string('role_name', 255).notNullable().unique();
    })
    .then(() =>
      knex.schema.createTable('users', function (table) {
        table.bigIncrements('id').primary();
        table.string('username', 255).notNullable();
        table.string('first_name');
        table.string('last_name');
        table.string('email', 255).unique().notNullable();
        table.string('password').notNullable();
        table.string('status').notNullable().defaultTo('ACTIVE');
        table.datetime('last_login');
        table.string('slug', 255).unique();
        table.boolean('is_active').defaultTo(false);
        table.string('photo_url', 255);
        table.integer('role_id').unsigned().references('id').inTable('roles');
        table.timestamps(true, true);  // Automatically adds created_at and updated_at
      })
    )
    .then(() =>
      knex.schema.createTable('user_roles', function (table) {
        table
          .bigInteger('user_id')
          .unsigned()
          .references('id')
          .inTable('users')
          .onDelete('CASCADE');
        table
          .integer('role_id')
          .unsigned()
          .references('id')
          .inTable('roles')
          .onDelete('CASCADE');
        table.primary(['user_id', 'role_id']);
      })
    );
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema
    .dropTableIfExists('user_roles')
    .dropTableIfExists('users')
    .dropTableIfExists('roles');
}
