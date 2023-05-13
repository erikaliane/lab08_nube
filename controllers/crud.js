const conexion = require('../database/db');

exports.save = (req,res)=>{
    const id_producto = req.body.id_producto;
    const nombre = req.body.nombre;
    const precio = req.body.precio;
    const cantidad = req.body.cantidad;
    const marca = req.body.marca;

    conexion.query('INSERT INTO producto SET ?', {id:id_producto, nombre:nombre,precio:precio,cantidad:cantidad,marca:marca},(error, results)=>{
        if(error){
            console.log(error);
        }else{
            res.redirect('/');
        }
    })
}

exports.update = (req,res)=>{
    const id_producto = req.body.id_producto;
    const nombre = req.body.nombre;
    const precio = req.body.precio;
    const cantidad = req.body.cantidad;
    const marca = req.body.marca;

    conexion.query('UPDATE producto SET ? WHERE id = ? ' , [{id:id_producto, nombre:nombre,precio:precio,cantidad:cantidad,marca:marca}, id_producto] ,(error, results)=>{
        if(error){
            console.log(error);
        }else{
            res.redirect('/');
        }
    })
}