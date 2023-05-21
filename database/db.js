const mysql = require('mysql2');


const conexion = mysql.createConnection({
    
    host : process.env.DB_HOST || 'localhost',
    user :  process.env.DB_USER || 'root',
    password:  process.env.DB_PASSWORD || '',
    database:  process.env.DB_NAME || 'crud_nodejs_db',
    port : process.env.DB_PORT || 3306
})

conexion.connect((error)=>{
    
    if(error){
        console.error('El error de conexiòn es :' + error);
    }
    console.log('Conectado a la BD');
})


module.exports = conexion;