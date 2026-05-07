import { Router } from "express";
import { AuthController } from "./auth.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

const authRouter = Router();

authRouter.post("/register", AuthController.register);
authRouter.post("/login", AuthController.login);
authRouter.get("/google/callback", AuthController.googleCallback);
authRouter.get("/me", authMiddleware, AuthController.getMe);
authRouter.put("/profile", authMiddleware, AuthController.updateProfile);
authRouter.post("/logout", AuthController.logout);

export default authRouter;
