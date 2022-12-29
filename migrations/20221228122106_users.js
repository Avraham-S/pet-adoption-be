exports.up = function (knex) {
  return knex.schema.createTable("users", (table) => {
    table.string("id").primary();
    table.string("firstName").notNullable();
    table.string("lastName").notNullable();
    table.string("email").notNullable();
    table.string("password").notNullable();
    table.string("phone");
    table.timestamp("createdAt").defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
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
