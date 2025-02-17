import jwt from 'jsonwebtoken';

const authMiddleware = {
    verifyToken: (req, res, next) => {
        const authHeader = req.headers['authorization'] // Lấy token từ request header

        if (authHeader) {
            const accessToken = authHeader.split(' ')[1]; // Lấy phần token sau "Bearer"

            jwt.verify(accessToken, process.env.JWT_SECRET_KEY, (err, user) => {
                if (err) {
                    return res.status(403).json({ error: 'Token is not valid' });
                }
                req.user = user; // Gán thông tin user vào request
                next();
            });
        } else {
            return res.status(401).json({ error: 'You are not authenticated' });
        }
    },
    verifyTokenAndAdmind: (req, res, next) => {
        const authHeader = req.headers['authorization']; // Lấy token từ header
    
        if (!authHeader) {
            return res.status(401).json({ error: 'You are not authenticated' });
        }
    
        const accessToken = authHeader.split(' ')[1]; // Lấy đúng token
    
        jwt.verify(accessToken, process.env.JWT_SECRET_KEY, (err, user) => {
            if (err) {
                return res.status(403).json({ error: 'Token is not valid' });
            }
    
            // Kiểm tra quyền admin hoặc user trùng ID
            if (user.id === req.params.id || user.admin) {
                req.user = user; // Gán thông tin user vào request để sử dụng tiếp
                next();
            } else {
                return res.status(403).json({ error: 'You are not allowed to delete others' });
            }
        });
    }
    
}
export default authMiddleware;
