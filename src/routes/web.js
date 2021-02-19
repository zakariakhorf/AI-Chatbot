import express from "express"
import chatBotController from "../controllers/chatBotController.js"
let router = express.Router()

let initWebRoutes = (app) => {
 router.get('/', (req , res) => {res.render ("homepage.ejs")})
 router.get('/webhook', chatBotController.getWebhook)
 router.post('/webhook', chatBotController.postWebhook)
 return app.use('/',router)


}
export default initWebRoutes