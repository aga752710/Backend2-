import jwt from 'jsonwebtoken';

const secretKey = process.env.SESSION_SECRET;

export const createToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, secretKey, { expiresIn: '1h' });
};

export const verifyToken = (token) => {
  return jwt.verify(token, secretKey);
};

export const sendResponse = (res, status, message, data = null) => {
  return res.status(status).json({
    status,
    message,
    data,
  });
};