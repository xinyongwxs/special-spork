import mysql from 'mysql';

const getConnection = () => {
    const connection = mysql.createConnection({
        host: 'localhost',
        user: 'stonna',
        password: '@Initial1',
        port: '3306',
        database: 'hosting_ip'
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

export function checkIsCompanyIpList(ipList) {
    const connection = getConnection();

};