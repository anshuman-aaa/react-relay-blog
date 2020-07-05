/**
 * React Starter Kit for Firebase
 * https://github.com/kriasoft/react-firebase-starter
 * Copyright (c) 2015-present Kriasoft | MIT License
 */

/* prettier-ignore */

exports.up = async db => {
  await db.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
  await db.raw('CREATE EXTENSION IF NOT EXISTS "hstore"');

  await db.schema.createTable('users', table => {
    table.uuid('id').notNullable().defaultTo(db.raw('uuid_generate_v4()')).primary();
    table.string('username', 50).unique();
    table.string('email', 100).notNullable();
    table.string('password').notNullable();
    table.boolean('email_verified').notNullable().defaultTo(false);
    table.string('display_name', 100);
    table.string('photo_url', 250);
    table.string('time_zone', 50);
    table.boolean('is_admin').notNullable().defaultTo(false);
    table.timestamps(false, true);
    table.timestamp('last_login_at').notNullable().defaultTo(db.fn.now());
  });

  await db.schema.createTable('category', table => {
    table.uuid('id').notNullable().defaultTo(db.raw('uuid_generate_v4()')).primary();
    table.uuid('categoryId').notNullable();
    table.string('categoryName', 120).notNullable();
    table.string('categoryDesc', 200).notNullable();
    table.string('categoryUri', 100);
    table.boolean('approved').notNullable().defaultTo(false);
    table.timestamps(false, true);
  });

  await db.schema.createTable('blogs', table => {
    table.uuid('id').notNullable().defaultTo(db.raw('uuid_generate_v4()')).primary();
    table.uuid('categoryId');
    table.string('blogName', 120).notNullable();
    table.string('blogDesc', 120).notNullable();
    table.string('blogLogo');
    table.boolean('approved').notNullable().defaultTo(false);
    table.timestamps(false, true);
  });
};

exports.down = async db => {
  await db.schema.dropTableIfExists('blogs');
  await db.schema.dropTableIfExists('category');
  await db.schema.dropTableIfExists('users');
};
