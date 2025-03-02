import User from '../models/User.js';
import Cart from '../models/Cart.js';
import { sendResponse } from '../utils/jwtUtils.js';
import { createToken } from '../utils/jwtUtils.js';

export const register = async (req, res) => {
  const { first_name, last_name, email, password, role } = req.body;
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return sendResponse(res, 400, 'El correo electrónico ya está registrado');
  }

  const newUser = new User({
    first_name,
    last_name,
    email,
    password,
    role,
  });

  await newUser.save();

  const token = createToken(newUser);
  res.cookie('authCookie', token, { httpOnly: true });
  return sendResponse(res, 201, 'Usuario registrado con éxito', newUser);
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return sendResponse(res, 404, 'Usuario no encontrado');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return sendResponse(res, 401, 'Contraseña incorrecta');
    }

    let cart;

    if (!user.cart && user.role !== 'admin') {
      cart = new Cart();
      await cart.save();
      user.cart = cart._id;
      await user.save();
    } else {
      cart = await Cart.findById(user.cart);
    }

    const token = createToken(user);
    res.cookie('authCookie', token, { httpOnly: true });
    console.log('Usuario logueado:', user); 
    return sendResponse(res, 200, 'Inicio de sesión exitoso', { user, cart });
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    return sendResponse(res, 500, 'Error al iniciar sesión');
  }
};


export const logout = (req, res) => {
  res.clearCookie('authCookie');
  return sendResponse(res, 200, 'Sesión cerrada con éxito');
};
