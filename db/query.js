/**
 * Simple postgresql query.
 * Count of query variables must be equal count of values in values array.
 * There may be repeating vars
 * @param db database name (!)
 * @param query query to db (!)
 * @param values array of values (!)
 * @param rowMode as deffault array, also may be 'object' (?)
 * @param logQueryAndData log query and values array (?)
 * @example
 * query('dbName', `SELECT * FROM table WHERE price > $1`, [1000])
 * */
const query = async (db, query,  values, rowMode = 'array', logQueryAndData = false) => {
    try {
        const client = new Client({
            user: process.env.PGUSER,
            host: process.env.PGHOST,
            database: db,
            password: process.env.PGPASSWORD,
            port: process.env.PGPORT
        })

        await client.connect()

        const res = await client.query({
            rowMode: rowMode,
            text: query,
            values
        })

        if(logQueryAndData)
            console.log(query, values)

        await client.end()

        return res
    } catch (error) {
        console.log(query, values)
        console.log('Error:')
        console.log(error)
        return false;
    }
}

/**
 * Simple mysqli query.
 * Count of query variables must be equal count of values in values array.
 * There is no repeating vars
 * @param db database name (!)
 * @param query query to db (!)
 * @param values array of values (!)
 * @example
 * msqliQuery('dbName', `SELECT * FROM table WHERE price > ?`, [1000])
 * */

const msqliQuery = async (db, query,  values = []) => {

    try {
        const pool = mysql.createPool({
            user: process.env.MSQLIUSER,
            host: process.env.MSQLIHOST,
            database: db,
            password: process.env.MSQLIPASSWORD,
            waitForConnections: true,
            connectionLimit: 1
        }).promise()

        let res = await pool.query(query, values,
            (error, results, fields) => {
                if (error) {
                    pool.end()
                    throw error;
                }
                return results
            })

        await pool.end()

        return res[0]

    }catch (error){
        console.log(error)
        return false
    }
}


module.exports = {
    query,
    msqliQuery
}
