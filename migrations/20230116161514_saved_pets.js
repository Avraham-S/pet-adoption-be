/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  const exists = await knex.schema.hasTable("saved_pets");
  if (!exists) {
    return await knex.schema.createTable("saved_pets", (table) => {
      table.string("ownerId").notNullable().primary();
      table.string("petId").notNullable();
    });
  }
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("saved_pets");
};
