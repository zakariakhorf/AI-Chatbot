import express from "express"

let router = express.Router()

let initWebRoutes = (app) => {
 router.get('/', (req , res) => {res.render ("homepage.ejs")})

 return app.use('/',router)


}
export default initWebRoutes