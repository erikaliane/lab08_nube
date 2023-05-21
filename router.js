const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const aws = require('aws-sdk');
// Configuración de Multer
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Configuración del cliente de AWS S3
const s3 = new aws.S3({
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey:process.env.SECRET_ACCESS_KEY
});


const conexion = require('./database/db');

router.get('/',(req,res)=>{

   
   conexion.query('select * from producto',(error,results)=>{
        if(error){
            throw error;
        }else{
            res.render('index', {results : results});
        }
    }); 
})


//RUTA PARA CREAR REGISTROS

router.get('/create',(req,res)=>{
    res.render('create');
})

//RUTA PARA EDITAR REGISTROS 
router.get('/edit/:id' ,(req,res)=>{
    const id = req.params.id;
    conexion.query('SELECT * FROM producto WHERE id=?',[id], (error, results)=>{
        if(error){
            throw error;
        }else{
            res.render('edit', {producto:results[0]});
        }
    })
})

//RUTA PARA ELIMINAR EL REGISTRO

router.get('/delete/:id' ,(req, res)=>{
    const id = req.params.id;

    conexion.query('SELECT imagen FROM producto WHERE id = ?', [id], (error, results) => {
        if (error) {
          throw error;
        } else {
          const imageName = results[0].imagen;    
          console.log('Eliminar imagen:', imageName);
            conexion.query('DELETE FROM producto WHERE id = ?' , [id], (error, results)=>{
            if(error){
                throw error;
            }else{
                const params = {
                    Bucket: 'lab9ventura', 
                    Key: imageName
                  };
                s3.deleteObject(params, (err, data) => {
                    if (err) {
                      console.error(err);
                      res.status(500).send('Error al eliminar la imagen de S3.');
                    } else {
                      res.redirect('/');
                    }
                });
                }
              });
            }
          });
        });
  
const crud= require('./controllers/crud');
router.post('/save', crud.save)
router.post('/update', crud.update)

module.exports = router