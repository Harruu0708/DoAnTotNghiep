import User from '../models/User.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'


let refreshTokens = [];
const authController = {
    register : async (req, res) => {
        try {
            const salt = await bcrypt.genSalt(10);
            const hashed = await bcrypt.hash(req.body.password, salt);

            // Create a new user
            const newUser = await new User({
                email: req.body.email,
                username: req.body.username,
                password: hashed
            })

            // Save user and respond
            const user = await newUser.save();
            res.status(200).json(user);
        } catch (error) {
            res.status(500).json({msg: error.message})
        }
    },

    generateAccessToken : (user) => {
        return jwt.sign(
            {
                id: user.id,
                admin: user.admin
            },
            process.env.JWT_SECRET_KEY,
            {expiresIn: '1h'},
        );
    },

    generateRefreshToken : (user) => {
        return jwt.sign(
            {
                id: user.id,
                admin: user.admin
            },
            process.env.JWT_REFRESH_TOKEN_SECRET_KEY,
            {expiresIn: '1d'}
        )
    },

    login : async (req, res) => {
        try {
            const user = await User.findOne({username: req.body.username});
            if(!user){
                return res.status(400).json({msg: "User not found"});
            }
            const validPassword = await bcrypt.compare(req.body.password, user.password);
            if(!validPassword){
                return res.status(400).json({msg: "Password is incorrect"});
            }
            if(user && validPassword){
                const accessToken =  authController.generateAccessToken(user);
                const refreshToken = authController.generateRefreshToken(user);
                refreshTokens.push(refreshToken);
                res.cookie('refreshToken', refreshToken,{
                    httpOnly: true,
                    secure: false,
                    path: '/',
                    sameSite : "strict",
                });
                const {password, ...others} = user._doc;
                res.status(200).json({others, accessToken});
            }
        } catch (error) {
            res.status(500).json({msg: error.message})
        }
    },

    requestRefreshToken : async (req, res) => {
        // Get the refresh token from the user
        const refreshToken = req.cookies.refreshToken;
        if(!refreshToken){
            return res.status(401).json({msg: "User not authenticated"});
        }

        jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN_SECRET_KEY, (err, user) => {
            if(err){
                return res.status(403).json({msg: "Token is not valid"});
            }
            if(!refreshTokens.includes(refreshToken)){
                return res.status(403).json({msg: " Refresh Token is not valid"});
            }
            refreshTokens = refreshTokens.filter(token => token !== refreshToken);

            // Generate a new access token
            const newAccessToken = authController.generateAccessToken(user);
            const newRefreshToken = authController.generateRefreshToken(user);
            refreshTokens.push(newRefreshToken);
            res.cookie('refreshToken', newRefreshToken,{
                httpOnly: true,
                secure: false,
                path: '/',
                sameSite : "strict",
            });
            res.status(200).json({accessToken : newAccessToken});
        })

    },

    logout : async (req, res) => {
        res.clearCookie('refreshToken');
        refreshTokens = refreshTokens.filter(token => token !== req.cookies.refreshToken);
        res.status(200).json({msg: "Logged out"});
    }

}

export default authController