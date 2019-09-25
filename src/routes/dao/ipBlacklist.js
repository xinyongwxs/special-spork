import mysql from 'mysql';

const getConnection = () => {
    const connection = mysql.createConnection({
        host: '18.139.136.18',
        user: 'root',
        password: 'nike1234',
        port: '3306',
        database: 'cnds_bots_data'
    });
    return connection;
};

export function checkIsCompanyIp(ip) {
    const connection = getConnection();
    const queryPromise = new Promise((resolve, reject) => {
        connection.query('select exists(select * from blacklist where ip=? limit 1) as isExist', [ip], (err, result) => {
            if (err) {
                console.log('[SELECT ERROR] - ', err.message);
                reject(err.message);
            }
            resolve(result);
            connection.end();
        });
    });
    return queryPromise;
};