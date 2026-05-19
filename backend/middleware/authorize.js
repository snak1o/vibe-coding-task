// Check if user is "admin" in tasks where only admin is permitted to continue

module.exports = function authorize(role) {
    return (req, res, next) => {
        if (!req.user || req.user.role !== role) {
            return res.status(403).json({ message: "Forbidden: admin only" });
        }
        next();
    };
};