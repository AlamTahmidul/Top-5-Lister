const auth = require('../auth');
const User = require('../models/user-model');
const bcrypt = require('bcryptjs');

module.exports.getLoggedIn = async (req, res) => {
    try {
        let userId = auth.verifyUser(req);
        if (!userId) {
            return res.status(400).json({
                loggedIn: false,
                user: null,
                error: "User Not Logged In"
            })
        }

        const loggedInUser = await User.findOne({ _id: userId });

        return res.status(200).json({
            loggedIn: true,
            user: {
                firstName: loggedInUser.firstName,
                lastName: loggedInUser.lastName,
                email: loggedInUser.email,
                userName: loggedInUser.username
            }
        })
    } catch (err) {
        console.log("err: " + err);
        return res.status(500).json({
            loggedIn: false,
            user: null,
            error: err
        })
    }
};

module.exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res
                .status(400)
                .json({ success: false, error: "Please enter all required fields." });
        }

        const existingUser = await User.findOne({ $or: [{email: email}, {username: email}] });
        if (!existingUser) {
            return res
                .status(401)
                .json({
                    success: false,
                    error: "Wrong username/email or password provided."
                })
        }

        const passwordCorrect = await bcrypt.compare(password, existingUser.passwordHash);
        if (!passwordCorrect) {
            // console.log("Incorrect password");
            return res
                .status(401)
                .json({
                    success: false,
                    error: "Wrong email or password provided."
                })
        }

        // LOGIN THE USER
        const token = auth.signToken(existingUser._id);

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: true
        }).status(200).json({
            success: true,
            user: {
                firstName: existingUser.firstName,
                lastName: existingUser.lastName,
                username: existingUser.username,  
                email: existingUser.email
            }
        }).send();

    } catch (err) {
        // console.error(err);
        res.status(500).json({ success: false, error: err });
    }
};

module.exports.logoutUser = async (req, res) => {
    res.cookie("token", "", {
        httpOnly: true,
        expires: new Date(0),
        secure: true,
        sameSite: "none"
    }).send();
};

module.exports.registerUser = async (req, res) => {
    try {
        const { firstName, lastName, username, email, password, passwordVerify } = req.body;
        console.log("create user: " + firstName + " " + lastName + " " + username + " " + email + " " + password + " " + passwordVerify);
        if (!firstName || !lastName || !email || !password || !passwordVerify || !username) {
            return res
                .status(400)
                .json({ success: false, error: "Please enter all required fields." });
        }
        if (password.length < 8) {
            return res
                .status(400)
                .json({
                    success: false,
                    error: "Please enter a password of at least 8 characters."
                });
        }
        if (password !== passwordVerify) {
            return res
                .status(400)
                .json({
                    success: false,
                    error: "Please enter the same password twice."
                })
        }

        const existingUser = await User.findOne({ $or: [{email: email}, {username: username}] });
        if (existingUser) {
            return res
                .status(400)
                .json({
                    success: false,
                    error: "An account with this username/email already exists."
                })
        }

        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const passwordHash = await bcrypt.hash(password, salt);
        // console.log("passwordHash: " + passwordHash);

        const newUser = new User({
            firstName, lastName, username, email, passwordHash
        });
        const savedUser = await newUser.save();
        // console.log("new user saved: " + savedUser._id);

        // LOGIN THE USER
        const token = auth.signToken(savedUser._id);
        // console.log("token:" + token);

        await res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none"
        }).status(200).json({
            success: true,
            user: {
                firstName: savedUser.firstName,
                lastName: savedUser.lastName,
                username: savedUser.username,
                email: savedUser.email       
            }
        })

        // console.log("token sent");

    } catch (err) {
        // console.error(err);
        res.status(500).json({ success: false, error: err });
    }
};