// Middleware to verify token
const jwt = require("jsonwebtoken")
const express = require("express");
const router = express.Router();

module.exports.authenticateToken = (req, res, next) => {
    const token = req.cookies.uid;
    console.log(token);
    if (!token) return res.status(401).redirect("/login");
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        // if (err) return res.status(403).json({ error: "Invalid Token" });
        if (err){
            res.clearCookie("uid")
            return res.status(403).redirect("/login");
        }       
        req.user = user;
        console.log(`req.user = ${req.user}`);
        res.locals.currUser = user;
        console.log(`in middleware ${req.user} `)
        console.log(`req.user = ${JSON.stringify(req.user)}`)
        next();
    });
};

router.use(this.authenticateToken);

// module.exports.forHome = (req, res, next) => {
//     const token = req.cookies.uid;
//     console.log(token);
//     if (!token) return req.locals.currUser = null;
//     // if (!token) return res.status(401).redirect("/login");
//     jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
//         // if (err) return res.status(403).json({ error: "Invalid Token" });
//         if (err){
//             res.clearCookie("uid")
//             return res.status(403).redirect("/");
//         }
//         req.locals.currUser = user;
//         console.log(`req.user = ${JSON.stringify(req.user)}`)
//         next();
//     });
// };

