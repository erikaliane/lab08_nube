const conexion = require('../database/db');
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

exports.save = (req, res) => {
  upload.single('file')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      // Error de Multer al cargar el archivo
      console.error(err);
      res.status(500).send('Error al cargar el archivo.');
    } else if (err) {
      console.error(err);
      res.status(500).send('Error en la carga del archivo.');
    } else {
      if (!req.file) {
        res.status(400).send('No se seleccionó ningún archivo.');
      } else {
        const id_producto = req.body.id_producto;
        const nombre = req.body.nombre;
        const precio = req.body.precio;
        const cantidad = req.body.cantidad;
        const marca = req.body.marca;

        const fileContent = req.file.buffer;
        const params = {
          Bucket: 'lab9ventura',
          Key: Date.now() + '_' + req.file.originalname,
          Body: fileContent
        };

        s3.upload(params, (err, data) => {
          if (err) {
            console.error(err);
            res.status(500).send('Error al cargar el archivo en S3.');
          } else {
            //el nombre de la imagen cargada en S3
            const imagen = params.Key; 
            conexion.query(
              'INSERT INTO producto SET ?',
              { id: id_producto, nombre: nombre, precio: precio, cantidad: cantidad, marca: marca, imagen: imagen },
              (error, results) => {
                if (error) {
                  console.log(error);
                  res.status(500).send('Error al guardar el producto en la base de datos.');
                } else {
                  res.redirect('/');
                }
              }
            );
          }
        });
      }
    }
  });
};


exports.update = (req, res) => {
  const id_producto = req.body.id_producto;
  const nombre = req.body.nombre;
  const precio = req.body.precio;
  const cantidad = req.body.cantidad;
  const marca = req.body.marca;
  const fileContent = req.file ? req.file.buffer : null; // Obtén el contenido del nuevo archivo si se seleccionó uno

  if (fileContent) {
    const params = {
      Bucket: 'lab9ventura',
      Key: Date.now() + '_' + req.file.originalname,
      Body: fileContent
    };

    s3.upload(params, (err, data) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error al cargar el archivo en S3.');
      } else {
        const imagen = params.Key; // Obtén el nombre de la imagen cargada en S3
        updateProduct(id_producto, nombre, precio, cantidad, marca, imagen, res);
      }
    });
  } else {
    // No se seleccionó un nuevo archivo, mantener la imagen existente en S3
    updateProduct(id_producto, nombre, precio, cantidad, marca, req.body.imagen, res);
  }
};

function updateProduct(id_producto, nombre, precio, cantidad, marca, imagen, res) {
  conexion.query(
    'UPDATE producto SET ? WHERE id = ?',
    [{ id: id_producto, nombre: nombre, precio: precio, cantidad: cantidad, marca: marca, imagen: imagen }, id_producto],
    (error, results) => {
      if (error) {
        console.log(error);
        res.status(500).send('Error al actualizar el producto en la base de datos.');
      } else {
        res.redirect('/');
      }
    }
  );
}
