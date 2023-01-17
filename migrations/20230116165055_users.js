/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  const exists = await knex.schema.hasTable("users");
  console.log("exists: ", exists);
  if (!exists) {
    return await knex.schema.createTable("users", (table) => {
      table.string("id").primary();
      table.string("firstName").notNullable();
      table.string("lastName").notNullable();
      table.string("email").notNullable();
      table.string("password").notNullable();
      table.string("phone");
      table.string("bio");
      table.timestamp("createdAt").defaultTo(knex.fn.now());
      table.boolean("isAdmin").defaultTo(false).notNullable();
    });
  }
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("users");
};
