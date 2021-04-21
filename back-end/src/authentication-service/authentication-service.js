import jwt from 'jsonwebtoken';
import {JWTDecoded} from './interfaces/interfaces.js';

class AuthenticationService {
    setJWTCookie(res, userID) {
        const token = jwt.sign({userID: userID}, process.env.SECRET, {expiresIn: '1d'});
        res.cookie('jwt', token, {httpOnly: true, maxAge: 1000*60*60*24});
    }
    removeJWTCookie(res) {
        res.cookie('jwt', {maxAge: 0});
    }
    authenticateIsAnyUser(req, res, next) {
        const token = req.cookies.jwt;
        try {
            jwt.verify(token, process.env.SECRET);
            next();
        } catch (err) {
            res.status(401).json({errorText: 'Invalid authorization information'});
        }
    }
    authenticateIsRequestingUser(req, res, next) {
        const token = req.cookies.jwt;
        try {
            const decoded = jwt.verify(token, process.env.SECRET);
            if (decoded.userID != parseInt(req.params.userID)) {
                res.status(401).json({errorText: 'Invalid authorization information'});
                return;
            }
            next();
        } catch (err) {
            res.status(401).json({errorText: 'Invalid authorization information'});
        }
    }
}

export default new AuthenticationService();
