const mysql = require('mysql2');  // mysql2
const connection = mysql.createConnection({
    host : 'localhost' ,
    user : 'root',
    password : 'root',
    database : 'seat' 
})

connection.connect();

connection.query('select * from seats',(error, rows , fields) => {
    if (error) throw error;
    console.log('seat info is :', rows);
})

connection.end();