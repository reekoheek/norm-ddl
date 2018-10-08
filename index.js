class DDL {
  constructor (manager) {
    this.manager = manager;
    this.adapters = {};
  }

  putAdapter (name, adapter) {
    this.adapters[name] = adapter;
  }

  getAdapter (name) {
    name = name.toLowerCase();

    try {
      return require(`./adapters/${name}`);
    } catch (err) {
      // noop
    }

    return this.adapters[name];
  }

  define (name) {
    return this.manager.runSession(async session => {
      let [ pool, schema ] = session.parseSchema(name);
      let connection = await session.acquire(pool);

      let Adapter = this.getAdapter(connection.constructor.name);
      if (!Adapter) {
        throw new Error('Adapter not found');
      }

      let adapter = new Adapter();
      await adapter.define(schema, connection);
    });
  }

  undefine (name) {
    return this.manager.runSession(async session => {
      let [ pool, schema ] = session.parseSchema(name);
      let connection = await session.acquire(pool);

      let Adapter = this.getAdapter(connection.constructor.name);
      if (!Adapter) {
        throw new Error('Adapter not found');
      }

      let adapter = new Adapter();
      await adapter.undefine(schema, connection);
    });
  }
}

module.exports = DDL;
