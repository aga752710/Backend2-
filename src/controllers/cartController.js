import Product from '../models/Product.js'; 
import Cart from '../models/Cart.js';
import Ticket from '../models/Ticket.js';
import User from '../models/User.js';
import { sendResponse } from '../utils/responseHandler.js';

export const addProductToCart = async (req, res) => {
  const cartId = req.params.cid;
  const { productId, quantity } = req.body;

  try {
    const cart = await Cart.findById(cartId);
    if (!cart) {
      return sendResponse(res, 404, 'Carrito no encontrado');
    }

    const product = await Product.findById(productId);
    if (!product) {
      return sendResponse(res, 404, 'Producto no encontrado');
    }

    if (product.stock < quantity) {
      return sendResponse(res, 400, 'No hay suficiente stock para este producto');
    }

    const existingItem = cart.items.find(item => item.product.toString() === productId);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }

    await cart.save();
    return sendResponse(res, 200, 'Producto agregado al carrito', cart);
  } catch (error) {
    console.error('Error al agregar producto al carrito:', error);
    return sendResponse(res, 500, 'Error al agregar producto al carrito');
  }
};

export const purchaseCart = async (req, res) => {
  const cart = req.cart; 
  console.log('Carrito en purchaseCart:', cart); 
  console.log('Usuario en purchaseCart:', req.user); 
  if (!cart) {
    return sendResponse(res, 404, 'Carrito no encontrado');
  }

  if (!req.user || !req.user.email) {
    return sendResponse(res, 400, 'Usuario no autenticado correctamente o correo electrónico no disponible');
  }

  const unavailableProducts = [];
  const purchasedProducts = [];
  let totalAmount = 0;

  
  for (const item of cart.items) {
    const product = await Product.findById(item.product);

    if (!product) {
      unavailableProducts.push(item.product);
      continue; 
    }


    if (product.stock >= item.quantity) {
      product.stock -= item.quantity; 
      await product.save(); 
      purchasedProducts.push(item.product); 
      totalAmount += product.price * item.quantity; 
    } else {
      unavailableProducts.push(item.product); 
    }
  }

 
  if (purchasedProducts.length > 0) {
    const ticket = new Ticket({
      code: await generateUniqueCode(),
      purchase_datetime: new Date(),
      amount: totalAmount,
      purchaser: req.user.email, 
    });

    try {
      await ticket.save(); 
      console.log('Ticket guardado:', ticket); 
    } catch (error) {
      console.error('Error al guardar el ticket:', error);
      return sendResponse(res, 500, 'Error al guardar el ticket');
    }

    
    cart.items = cart.items.filter(item => !unavailableProducts.includes(item.product.toString()));
    await cart.save(); 

    return sendResponse(res, 200, {
      message: 'Compra realizada con éxito',
      ticket,
      unavailableProducts, 
    });
  } else {
    
    return sendResponse(res, 400, {
      message: 'No se pudo completar la compra. Todos los productos están sin stock.',
      unavailableProducts,
    });
  }
};

const generateUniqueCode = async () => {
  let code;
  do {
    code = 'TICKET-' + Math.random().toString(36).substr(2, 9).toUpperCase();
  } while (await Ticket.exists({ code })); 
  return code;
};