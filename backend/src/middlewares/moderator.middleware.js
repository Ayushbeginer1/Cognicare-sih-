function isModerator(req, res, next) {
    if (req.user && req.user.isModerator) {
        return next();
    }
    return res.status(403).json({ message: "Forbidden" });
}

export default isModerator;