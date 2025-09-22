const express = require("express")
const dotenv = require("dotenv").config()
const app = express();
const connection = require("./Database/conn.js")
const userRouter = require("./routes/userRoute.js")

connection();

const port = process.env.PORT || 4000;

app.use("/user", userRouter)
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})