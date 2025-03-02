import { verifyToken } from './jwtUtils.js';
import User from '../models/User.js';

export const authenticateToken = async (req, res, next) => {
  const token = req.cookies.authCookie;

  if (!token) {
    return res.status(401).json({ message: 'No estás autenticado' });
  }

  try {
    const decoded = verifyToken(token);
    const user = await User.findById(decoded.id); 
    if (!user) {
      return res.status(401).json({ message: 'Usuario no encontrado' });
    }

    req.user = {
      id: user._id,
      email: user.email,
      role: user.role,
    };
    console.log('Token verificado, usuario:', req.user); 
    next();
  } catch (error) {
    console.error('Error al verificar el token:', error);
    return res.status(403).json({ message: 'Token no válido' });
  }
};

