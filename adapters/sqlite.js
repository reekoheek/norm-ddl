const debug = require('debug')('norm-ddl:adapters:sqlite');

const TYPES = {
  nstring: 'TEXT',
  ninteger: 'INTEGER',
  ndatetime: 'TEXT',

};

module.exports = class Sqlite {
  async define (schema, connection) {
    let fieldLines = schema.fields.map(field => {
      let line = `${this.escape(field.name)} ${TYPES[field.constructor.name.toLowerCase()]}`;
      line += ` ${getFilter(field, 'required') ? 'NOT NULL' : 'NULL'}`;
      if (getFilter(field, 'unique')) {
        line += ` UNIQUE`;
      }
      return line;
    });

    fieldLines.unshift(`\`id\` INTEGER PRIMARY KEY AUTOINCREMENT`);

    let sql = `
CREATE TABLE ${this.escape(schema.name)} (
  ${fieldLines.join(',\n  ')}
)
    `.trim();

    debug(sql);

    let db = await connection.getDb();
    await db.run(sql);
  }

  async undefine (schema, connection) {
    let sql = `DROP TABLE IF EXISTS ${this.escape(schema.name)}`.trim();

    debug(sql);

    let db = await connection.getDb();
    await db.run(sql);
  }

  escape (v) {
    return '`' + v + '`';
  }
};

function getFilter (field, name) {
  return field.rawFilters.find(f => f[0] === name);
}
