const passport = require("passport");
const jwt = require('jsonwebtoken');
const db = require("../../models");

const localstrategy = (req, res, next) => {
    passport.authenticate('customer-local', { session: false }, (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.status(401).json({ mess: info.message });
        }

        req.user = user;
        return next()
    })(req, res, next);
}

const adminStrategy = (req, res, next) => {
    passport.authenticate('admin-local', { session: false }, (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.status(401).json({ mess: info.message });
        }

        req.user = user;
        return next()
    })(req, res, next);
}


const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
   
    if (!token) {
        return res.status(401).json({ mess: 'Unauthorized User Please Login First' });
    }


    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(401).json({ mess: 'Unauthorized user please ReLogin' });
        }
        req.user = decoded;

        if (decoded) {
            db.user.findByPk(decoded.id, { attributes: ['block'] })
                .then(u => {
                    if (u) {
                        if (u?.block) {
                            return res.status(400).json({ mess: "you are blocked" })
                        }
                    }else{
                        return res.status(400).json({ mess: "user not found" })
                    }
                    next();
                })
        }

        // next();
    });
};



module.exports = {
    verifyToken,
    localstrategy,
    adminStrategy
};
