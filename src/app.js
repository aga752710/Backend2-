import express from 'express';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import dotenv from 'dotenv';
import { engine } from 'express-handlebars';
import connectDB from '../src/config/db.js';
import authRoutes from '../src/routes/authRoutes.js';
import cartRoutes from '../src/routes/cartRoutes.js';
import productRoutes from '../src/routes/productRoutes.js';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();
connectDB();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use('/public', express.static(path.join(__dirname, '../public')));

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './src/views');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
}));

app.use('/api/sessions', authRoutes);
app.use('/api/carts', cartRoutes);
app.use('/api/products', productRoutes);

app.get('/', (req, res) => {
  res.render('home', { title: 'Página Principal' });
});

app.get('/login', (req, res) => {
  res.render('login', { title: 'Iniciar Sesión' });
});

app.get('/register', (req, res) => {
  res.render('register', { title: 'Registro' });
});

export default app;
