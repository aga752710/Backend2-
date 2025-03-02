import User from '../models/User.js';

export const loadCart = async (req, res, next) => {
  if (req.user) {
    try {
      
      const user = await User.findById(req.user.id).populate('cart');
      console.log('Usuario:', user); 

      if (user && user.cart) {
        req.cart = user.cart;
        console.log('Carrito cargado:', req.cart); 
      } else {
        req.cart = null;
      }
    } catch (error) {
      console.error('Error al cargar el carrito:', error);
      req.cart = null;
    }
  }
  next();
};



