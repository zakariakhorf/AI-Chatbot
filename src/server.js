import express from 'express';
import viewEngine from './config/viewEngine'
import initWebRoute from './routes/web'
import bodyParser from "body-parser"

let app = express()

viewEngine(app)
initWebRoute(app)
let port = process.env.PORT || 8080 
app.listen(port , ()=>{
    console.log(`App is running on the port ${port}`)
})