import dotenv from"dotenv"
import express from 'express';
import viewEngine from './config/viewEngine.js'
import initWebRoute from './routes/web.js'
import bodyParser from "body-parser"


let app = express()


// use body-parser to post
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))

dotenv.config()
viewEngine(app)
initWebRoute(app)
let port = process.env.PORT || 5000
app.listen(port , ()=>{
    console.log(`App is running on the port ${port}`)
})