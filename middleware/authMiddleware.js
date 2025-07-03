const jwt = require('jsonwebtoken');

module.exports = async(req, res, next) => {

    try {
        const token = req.headers['authorization'].split(" ")[1]; // Extract token from Authorization header


        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {

            if (err) {
                return res.status(401).send({ message: 'auth fail invaild token', success: false });
            }
            else {
                req.body.userId = decoded.id; // Attach user info to request object
                next(); // Proceed to the next middleware or route handler
            }
        });
    } 
    catch (error){
        return res.status(401).send({ message: 'auth fail invaild token', success: false });
    }
};
