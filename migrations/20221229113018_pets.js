/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable((table) => {
    table.string("type");
    table.string("name");
    table.string("status");
    table.string("picture");
    table.integer("height");
    table.integer("weight");
    table.string("color");
    table.string("bio");
    table.boolean("hypoallergenic");
    table.string("dietary");
    table.string("breed");
  });
};
/*
Type 
Name
Adoption Status (Adopted, Fostered, Available)
Picture (Picture location URL/Path)
Height (number)
Weight (Number)
Color
Bio
Hypoallergenic (Boolean)
Dietary restrictions
Breed
*/

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {};
