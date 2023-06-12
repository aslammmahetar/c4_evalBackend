const express = require("express")
const { PostModel } = require("../Model/post.model")
const postRouter = express.Router()

const { auth } = require("../Middleware/auth.midddleware")
postRouter.use(auth)

postRouter.get("/", async (req, res) => {
    try {
        const posts = await PostModel.find({ userId: req.body.userId })
        res.status(200).json({ msg: "Here is your posts", posts })
    } catch (error) {
        res.status(400).json({ msg: error })
    }
})

postRouter.post("/add", async (req, res) => {
    try {
        const notes = new PostModel(req.body)
        await notes.save()
        res.status(200).json({ msg: "post has been added" })
    } catch (error) {
        res.status(400).json({ msg: error })
    }
})

postRouter.patch("/update/:postid", async (req, res) => {
    const { postid } = req.params
    const userIdinUserDoc = req.body.userId
    try {
        const post = await PostModel.findOne({ _id: postid })
        const userIdInPostDoc = post.userId
        if (userIdInPostDoc == userIdinUserDoc) {
            await PostModel.findByIdAndUpdate({ _id: postid }, req.body)
            res.status(200).json({ msg: "Updated" })
        } else {
            res.status(200).json({ msg: "Post not found" })
        }
    } catch (error) {
        res.status(400).json({ msg: error })
    }
})

postRouter.delete("/delete/:postid", async (req, res) => {
    const { postid } = req.params
    const userIdinUserDoc = req.body.userId
    try {
        const post = await PostModel.findOne({ _id: postid })
        const userIdInPostDoc = post.userId
        if (userIdInPostDoc == userIdinUserDoc) {
            await PostModel.findByIdAndDelete({ _id: postid })
            res.status(200).json({ msg: "Deleted" })
        } else {
            res.status(200).json({ msg: "Post not found" })
        }
    } catch (error) {
        res.status(400).json({ msg: error })
    }
})

module.exports = { postRouter }