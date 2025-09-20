import { Router } from "express";
import { AuthController } from "./auth.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

const authRouter = Router();

authRouter.post("/register", AuthController.register);
authRouter.post("/login", AuthController.login);
authRouter.get("/me", authMiddleware, AuthController.getMe);
authRouter.get("/logout", AuthController.logout);

export default authRouter;
