async function getLangList() {
    const pool = require('../pool');

    const [rows] = await pool.query('SELECT * FROM languages');
    return {
        'ok': true,
        'languages': rows
    };
}

module.exports = getLangList;