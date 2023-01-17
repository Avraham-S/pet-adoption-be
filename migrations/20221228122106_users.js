exports.up = async function (knex) {
  const exists = await knex.schema.hasTable("users");
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

exports.down = async function (knex) {
  const exists = await knex.schema.hasTable("users");

  return knex.schema.dropTable("users");
};

/*
"repassword"
: 
"schochet0205"
email
: 
"ayschochet@gmail.com"
firstName
: 
"Avraham"
lastName
: 
"Schochet"
password
: 
"schochet0205"
phone
: 
"323232323232"

*/
