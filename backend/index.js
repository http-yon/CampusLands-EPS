import express from "express"
import dotenv from "dotenv"
import routes from "./routes/routes.js"

dotenv.config()
const port = process.env.PORT101

const app = express()

app.use("/EPS",routes)
app.use(express.json())

app.listen(port,()=>{
    console.log("THE SERVER IS RUNNING");
})


