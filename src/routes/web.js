import express from "express"

let router = express.Router()

let initWebRoutes = (app) => {
 router.get('/',(req,res)=>{
     return res.send('It works GG')
 })

 return app.use('/',router)


}
module.exports = initWebRoutes