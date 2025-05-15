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
const resetRouter    = require('./routes/reset.routes');

const Product = require('./models/product');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);
const PORT = process.env.PORT || 3000;

// Conexión directa a MongoDB Atlas (temporal)
const MONGO_URI = 


mongoose.set('strictQuery', false);
mongoose
  .connect(MONGO_URI)
  .then(async () => {
    console.log('Conectado a MongoDB Atlas');
    await initProducts();
  })
  .catch(err => {
    console.error('Error al conectar a MongoDB Atlas:', err);
    process.exit(1);
  });

async function initProducts() {
  try {
    const filePath = path.join(__dirname, 'localprod/products.json');
    if (!fs.existsSync(filePath)) return;
    const data = fs.readFileSync(filePath, 'utf-8');
    const list = JSON.parse(data);
    const existing = await Product.find();
    if (existing.length === 0) {
      await Product.insertMany(list);
      console.log('Productos iniciales cargados en MongoDB.');
    }
  } catch (e) {
    console.error('Error initProducts:', e);
  }
}

const hbs = create({ extname: '.hbs' });
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(passport.initialize());

app.use('/api/sessions', sessionsRouter);
app.use('/api/reset',    resetRouter);
app.use('/api/products', productsRouter);
app.use('/api/carts',    cartsRouter);

app.use((err, req, res, next) => {
  console.error('Error en API:', err);
  res.status(500).json({ error: 'Error interno del servidor' });
});

app.get('/home', async (req, res) => {
  const productsFromDB = await Product.find();
  res.render('home', { title: 'Página Principal', products: productsFromDB });
});

app.get('/products', async (req, res) => {
  const productsFromDB = await Product.find();
  res.render('products', { title: 'Productos en Tiempo Real', products: productsFromDB });
});

io.on('connection', socket => {
  console.log('Nuevo cliente conectado');
  Product.find()
    .then(list => socket.emit('updateProducts', list))
    .catch(console.error);

  socket.on('addProduct', async data => {
    await Product.create(data);
    const list = await Product.find();
    io.emit('updateProducts', list);
  });

  socket.on('deleteProduct', async id => {
    await Product.findByIdAndDelete(id);
    const list = await Product.find();
    io.emit('updateProducts', list);
  });
});

httpServer.listen(PORT, () => console.log(`Servidor en http://localhost:${PORT}`));
