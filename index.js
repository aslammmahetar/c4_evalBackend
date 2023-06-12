const express = require('express')
const app = express()
require("dotenv").config()
const port = process.env.port
const cors = require("cors")
const { connection } = require('./db')
const { userRouter } = require('./Routes/user.route')
const { postRouter } = require('./Routes/post.route')
app.use(express.json())
app.use(cors())

app.use("/users", userRouter)
app.use("/posts", postRouter)

app.listen(port, async () => {
    try {
        await connection
        console.log(`c4 app listening on port ${port}!`)
    } catch (error) {
        console.log(error)
    }
})