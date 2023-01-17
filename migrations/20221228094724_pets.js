exports.up = async function (knex) {
  const exists = await knex.schema.hasTable("pets");
  console.log(exists);
  if (!exists) {
    return await knex.schema.createTable("pets", (table) => {
      table.increments("petId").primary();
      table.string("type").notNull();
      table.string("name").notNull();
      table.string("adoptionStatus").notNull().defaultTo("available");
      table.string("picture");
      table.string("breed");
      table.integer("height");
      table.integer("weight");
      table.string("color");
      table.text("bio");
      table.boolean("hypoallergenic");
      table.string("ownerId");
      table.string("dietary");
      table.timestamp("created_at").defaultTo(knex.fn.now());
    });
  }
};

exports.down = function (knex) {
  return knex.schema.dropTable("pets");
};
