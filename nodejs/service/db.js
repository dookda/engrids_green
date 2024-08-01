const Pool = require('pg').Pool

const dat = new Pool({
    host: 'postgis',
    database: 'panus',
    user: 'postgres',
    password: '1234',
    port: 5432,
});


exports.dat = dat;