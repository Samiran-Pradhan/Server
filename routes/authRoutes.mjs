import express  from "express";
import {registerController,loginController,testController} from "../controllers/authController.mjs"
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.mjs";
//rounting object
const router=express.Router()
//routing
//register||method post
router.post('/register',registerController);

//login || post
router.post('/login',loginController)



//test routes
router.get('/test',requireSignIn,isAdmin,testController)
export default router

