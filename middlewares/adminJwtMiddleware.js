const jwt = require("jsonwebtoken")

const adminjwtMiddleware = (req, res, next) => {
    console.log("Inside JWT Middleware");
    const token = req.headers.authorization.split(" ")[1]
    console.log(token);

    try {
        const jwtResponse = jwt.verify(token, process.env.JWTSecretKey)
        console.log(jwtResponse);
        req.payload = jwtResponse.userMail
        req.role = jwtResponse.role
        if (jwtResponse.role == "admin") {
            next()
        } else {
            res.status(401).json("Unauthorised User")
        }

    } catch (err) {
        res.status(401).json("Invalid token", err)

    }

}
module.exports = adminjwtMiddleware