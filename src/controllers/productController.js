import Product from '../models/Product.js';
import { sendResponse } from '../utils/responseHandler.js';

export const getProductById = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findById(id);
    if (!product) {
      return sendResponse(res, 404, 'Producto no encontrado');
    }
    return sendResponse(res, 200, 'Producto encontrado', product);
  } catch (error) {
    return sendResponse(res, 500, 'Error al obtener el producto');
  }
};

export const createProduct = async (req, res) => {
  const { name, price, stock } = req.body;
  const newProduct = new Product({ name, price, stock });

  try {
    await newProduct.save();
    return sendResponse(res, 201, 'Producto creado con éxito', newProduct);
  } catch (error) {
    return sendResponse(res, 500, 'Error al crear el producto');
  }
};

export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const updatedProduct = await Product.findByIdAndUpdate(id, updates, { new: true });
    if (!updatedProduct) {
      return sendResponse(res, 404, 'Producto no encontrado');
    }
    return sendResponse(res, 200, 'Producto actualizado con éxito', updatedProduct);
  } catch (error) {
    return sendResponse(res, 500, 'Error al actualizar el producto');
  }
};

export const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) {
      return sendResponse(res, 404, 'Producto no encontrado');
    }
    return sendResponse(res, 200, 'Producto eliminado con éxito');
  } catch (error) {
    return sendResponse(res, 500, 'Error al eliminar el producto');
  }
};
