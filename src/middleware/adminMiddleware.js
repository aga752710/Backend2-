export const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  return res.status(403).json({ message: 'Acceso denegado. Solo los administradores pueden realizar esta acción.' });
};

export const isUser = (req, res, next) => {
  if (req.user && req.user.role === 'user') {
    return next();
  }
  return res.status(403).json({ message: 'Acceso denegado. Solo los usuarios pueden realizar esta acción.' });
};
