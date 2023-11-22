const jwt = require("jsonwebtoken");
const SECRET_KEY = 'your_secret_key';

const verifyToken = (req, res, next) => {
  const tokenHeader = req.header('Authorization');

  if (!tokenHeader || !tokenHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Access denied.' });
  }
  const token = tokenHeader.replace('Bearer ', '');

  try {
    const decodedToken = jwt.verify(token, SECRET_KEY);
    req.user = decodedToken;
    
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid token.' });
  }
}

module.exports = { verifyToken, SECRET_KEY };
