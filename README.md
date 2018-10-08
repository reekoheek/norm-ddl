# norm-ddl

```sh
npm i norm-ddl
```

```js
const DDL = require('norm-ddl');

(async () => {
  let data,
  let manager = new Manager({
    connections: [
      {
        data,
        adapter: require('node-norm/adapters/memory'),
        schemas: [
          {
            name: 'foo',
          },
          {
            name: 'bar',
          },
        ],
      },
    ],
  });

  let ddl = new DDL(manager);

  await ddl.define('foo');
  await ddl.define('bar');
})();
```
