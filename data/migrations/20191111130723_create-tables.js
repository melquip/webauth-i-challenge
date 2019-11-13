exports.up = function (knex) {
  return knex.schema
    .createTable('user', project => {
      project.increments();
      project.string('username', 100).notNullable();
      project.text('password', 255).notNullable();
    })
};

exports.down = function (knex) {
  return knex.schema
    .dropTableIfExists('user');
};