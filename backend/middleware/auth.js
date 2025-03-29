/**
 * Authentication middleware to protect routes
 */

// This would be replaced with actual JWT verification in a real app
exports.protect = (req, res, next) => {
  try {
    const token = req.header('x-auth-token');

    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // In a real implementation, verify the token
    // const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // req.user = decoded.user;

    // For now, stub a user ID for testing
    req.user = { id: '60d0fe4f5311236168a109ca' };
    
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// Admin authorization middleware
exports.admin = (req, res, next) => {
  try {
    if (!req.user || !req.user.role || req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied: Admin privileges required' });
    }
    
    next();
  } catch (error) {
    console.error('Admin middleware error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
}; 