const User = require("../Models/userModel.js")
const bcrypt = require("bcrypt");
const dotenv = require("dotenv").config();
const jwt = require("jsonwebtoken");
const Session = require("../Models/SessionModel.js");
const { ObjectId } = require("mongodb");
const Sales = require("../Models/salesModel.js");

const registerUser = async (req, res) => {
    try {
        const data = req.body;

        const name = data.name
        const email = data.email;
        const password = data.password

        if (name === null || name === undefined || name === "" || name.trim() === "") {
            return res.status(400).json({ message: "Name field cannot be empty or undefined or empty String..." })
        }

        if (email === null || email === undefined) {
            return res.status(400).json({ message: "Email cannot be null or undefined..." })
        }

        const emailRegex = /^[a-zA-Z0-9]{3,}@[a-zA-Z]+\.[a-zA-Z]{2,}$/;

        const emailCheck = emailRegex.test(email);

        if (!emailCheck) {
            return res.status(400).json({ message: "Please Provide a valid email..." })
        }

        const existingEmail = await User.findOne({ email: email }).collation({ locale: "en", strength: 1 })

        if (existingEmail) {
            return res.status(400).json({ message: "User already exists with this email id..." })
        }

        if (password === null || password === undefined || password === "") {
            return res.status(400).json({ message: "Cannot provide password as null or undefined or empty string..." })
        }

        if (password.length < 8) {
            return res.status(400).json({ message: "Please provide minimum 8 length password..." })
        }

        let hashed = await bcrypt.hash(password, Number(process.env.SALT_ROUNDS))

        const newUser = await User.create({ name: name, email: email, password: hashed });
        console.log(newUser);

        return res.status(201).json({ user: { name: newUser.name, email: newUser.email }, message: "New User registered Successfully..." })
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Registration Failed..." })
    }
}

const loginUser = async (req, res) => {
    try {
        const data = req.body;

        const email = data.email;
        const password = data.password

        if (email === null || email === undefined || email === "" || email.trim() === "") {
            return res.status(400).json({ message: "Cannot provide email null or undefined or empty String..." })
        }

        const user = await User.findOne({ email: email })

        if (!user) {
            return res.status(404).json({ message: "User not exists with this email..." })
        }

        const checkPassword = await bcrypt.compare(password, user.password);

        if (!checkPassword) {
            return res.status(400).json({ message: "Please enter correct password..." })
        }

        const token = jwt.sign({ userId: user._id, name: user.name }, process.env.SECRET_KEY, { expiresIn: "1d" });

        const tokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

        await Session.create({ userId: user._id, token: token, tokenExpiry: tokenExpiry });

        return res.status(200).json({ name: user.name, email: user.email, token: token, message: "Login Successful..." })
    }
    catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: "Login Failed..." })
    }
}

const logoutUser = async (req, res) => {
    try {
        let token = req.headers.authorization;
        token = token.substring(token.indexOf(" ") + 1);

        const id = req.userId;

        await Session.deleteOne({ userId: new ObjectId(id), token: token })

        return res.status(200).json({ message: "Logout Successfully..." })

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: "Logout Failed..." })
    }
}

const fetchSalesData = async (req, res) => {
    try {

        console.log("Inside the fetch fn");

        let { limit, pageNo, sortBy, searchBy, search } = req.query;

        limit = limit ? Number(limit) : 10
        pageNo = pageNo ? Number(pageNo) - 1 : 0

        const skipPages = pageNo * limit

        const total = await Sales.countDocuments({ userId: req.userId })
        const totalPages = Math.ceil(total / limit)

        let data;

        if (!searchBy && !search) {
            data = await Sales.find({ userId: req.userId }).skip(skipPages).limit(limit).sort({ [sortBy]: -1 })
        }
        else {
            data = await Sales.find({ userId: req.userId, [searchBy]: search }).skip(skipPages).limit(limit).sort({ [sortBy]: -1 })
        }

        return res.status(200).json({ data: data, totalPages: totalPages, currentPage: pageNo + 1, limit: limit, message: "Sales Data fetched successfully...." })
    }
    catch (error) {
        console.log(error.message);
    }
}

module.exports = { registerUser, loginUser, logoutUser, fetchSalesData }