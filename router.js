const express = require('express');
const router = express.Router();


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

router.get('/delete/:id' ,(req,res)=>{
    const id = req.params.id;
    conexion.query('DELETE FROM producto WHERE id = ?' , [id], (error, results)=>{
        if(error){
            throw error;
        }else{
            res.redirect('/');
        }
    })
})

const crud= require('./controllers/crud');
router.post('/save', crud.save)
router.post('/update', crud.update)

module.exports = router