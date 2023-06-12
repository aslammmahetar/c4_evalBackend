const express = require("express")

const userRouter = express.Router()

const bcrypt = require("bcrypt")

const jwt = require("jsonwebtoken")

require("dotenv").config()

const { UserModel } = require("../Model/user.model")

userRouter.post("/register", async (req, res) => {
    const { name, email, gender, password, age, city, is_married } = req.body
    try {
        const user = await UserModel.findOne({ email })
        if (user) {
            res.status(200).json({ msg: "User already exist, please login" })
        } else {
            bcrypt.hash(password, 5, async (err, hash) => {
                if (err) {
                    res.json(400).json({ msg: err })
                } else {
                    const newUser = new UserModel({ name, email, gender, age, city, is_married, password: hash })
                    await newUser.save()
                    res.status(200).json({ msg: "User has been registered successfully in" })
                }
            })
        }
    } catch (error) {
        res.status(400).json({ error: error })
    }
})

userRouter.post("/login", async (req, res) => {
    const { email, password } = req.body
    try {
        const user = await UserModel.findOne({ email })
        if (user) {
            bcrypt.compare(password, user.password, (err, result) => {
                if (result) {
                    const token = jwt.sign({ userId: user._id, user: user.name }, process.env.secretkey)
                    res.status(200).json({ msg: "Logged in successfully", token })
                } else {
                    res.status(400).json({ msg: err.message })
                }
            })
        } else {
            res.status(400).json({ msg: "user does not exist" })
        }
    } catch (error) {
        res.status(400).json({ msg: error })
    }
})

module.exports = { userRouter }