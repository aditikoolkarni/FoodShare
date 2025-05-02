const jwt = require("jsonwebtoken");
const { User } = require("../models/user.model");
require("dotenv").config();

const authentication = async(req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    jwt.verify(token, process.env.JWT_SECRET, async(err, decoded) => {
        if (err) {
            return res.status(403).json({ message: "Forbidden" });
        }

        const user = await User.findById(decoded.user_id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        req.user_id = decoded.user_id;
        next();
    });
}

module.exports = { authentication };