const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const { create } = require('express-handlebars');
const path = require('path');
const mongoose = require('mongoose');
const fs = require('fs');
const passport = require('./config/passport');

const productsRouter = require('./routes/products.routes');
const cartsRouter    = require('./routes/carts.routes');
const sessionsRouter = require('./routes/sessions.routes');

const Product = require('./models/product');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);
const PORT = 3000;

// Conexion a MongoDB 
mongoose.set('strictQuery', false);



mongoose
  .connect(mongoURI)
  .then(async () => {
    console.log('Conectado a MongoDB Atlas');
    await initProducts();
  })
  .catch(err => {
    console.error('Error al conectar a MongoDB Atlas:', err);
    process.exit(1);
  });

// Cargar productos desde products.json
const initProducts = async () => {
  try {
    const filePath = path.join(__dirname, 'localprod/products.json');
    if (!fs.existsSync(filePath)) {
      console.warn('Archivo products.json no encontrado, omitiendo carga inicial');
      return;
    }

    const data = fs.readFileSync(filePath, 'utf-8');
    const products = JSON.parse(data);

    const existing = await Product.find();
    if (existing.length === 0) {
      await Product.insertMany(products);
      console.log('Productos iniciales cargados en MongoDB.');
    } else {
      console.log('Productos ya existentes en MongoDB.');
    }
  } catch (error) {
    console.error('Error al inicializar productos:', error.message);
  }
};

// Configuración de Handlebars
const hbs = create({ extname: '.hbs' });
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '..', 'public')));

// Inicializar Passport
app.use(passport.initialize());

// Rutas de sesión
app.use('/api/sessions', sessionsRouter);

// Rutas API
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

// Manejo de errores en rutas API
app.use((err, req, res, next) => {
  console.error('Error en API:', err.message);
  res.status(500).json({ error: 'Error interno del servidor' });
});

// Rutas de vistas
app.get('/home', async (req, res) => {
  try {
    const productsFromDB = await Product.find();
    res.render('home', { title: 'Pagina Principal', products: productsFromDB });
  } catch (error) {
    res.status(500).send('Error al obtener productos');
  }
});

app.get('/products', async (req, res) => {
  try {
    const productsFromDB = await Product.find();
    res.render('products', { title: 'Productos en Tiempo Real', products: productsFromDB });
  } catch (error) {
    res.status(500).send('Error al obtener productos');
  }
});

// Configuración de WebSocket
io.on('connection', socket => {
  console.log('Nuevo cliente conectado');

  Product.find()
    .then(products => socket.emit('updateProducts', products))
    .catch(err => console.error(err));

  socket.on('addProduct', async productData => {
    try {
      await Product.create(productData);
      const updated = await Product.find();
      io.emit('updateProducts', updated);
    } catch (error) {
      console.error('Error al agregar producto:', error);
    }
  });

  socket.on('deleteProduct', async productId => {
    try {
      await Product.findByIdAndDelete(productId);
      const updated = await Product.find();
      io.emit('updateProducts', updated);
    } catch (error) {
      console.error('Error al eliminar producto:', error);
    }
  });
});

// Iniciar el servidor
httpServer.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
