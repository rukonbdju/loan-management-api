import { Request, Response, NextFunction } from "express";
import { UserService } from "../user/user.service";
import { AuthService } from "./auth.service";
import { comparePassword } from "./auth.utils";
import { AuthRequest } from "../../middlewares/auth.middleware";
import { parseError } from "../../utils/parseError";
import { ENV } from "../../config/env";

export const AuthController = {
    //user register
    register: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = req.body;
            const result = await UserService.createNewUser(data)
            const { accessToken, refreshToken } = AuthService.generateToken({ userId: String(result._id) })
            console.log({ accessToken, refreshToken })
            res.cookie('accessToken', accessToken, {
                httpOnly: true,
                secure: ENV.MODE === "dev" ? false : true,
                sameSite: 'none',
                maxAge: 24 * 60 * 60 * 1000,
            });

            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: ENV.MODE === "dev" ? false : true,
                sameSite: 'none',
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });
            res.status(201).json({ success: true, data: result })
        } catch (error) {
            const parsedError = parseError(error);
            next(parsedError)
        }
    },

    //user login
    login: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const email = req.body?.email
            const password = req.body?.password
            console.log(password)
            if (!email || !password) {
                return res.status(404).json({ success: false, message: 'Parameter missing' })
            }
            const user = await UserService.findUserByEmail(email)
            console.log(user)
            if (!user) {
                return res.status(404).json({ success: false, message: 'User not found' })
            }
            const isMatch = await comparePassword(password, user.password)
            if (!isMatch) {
                return res.status(403).json({ success: false, message: 'Invalid password' })
            }
            const { accessToken, refreshToken } = AuthService.generateToken({ userId: user.id })
            console.log({ accessToken, refreshToken })
            res.cookie('accessToken', accessToken, {
                httpOnly: true,
                secure: ENV.MODE === "dev" ? false : true,
                sameSite: 'none',
                maxAge: 24 * 60 * 60 * 1000,
            });

            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: ENV.MODE === "dev" ? false : true,
                sameSite: 'none',
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });
            res.status(200).json({ success: true, data: user });
        } catch (err) {
            const parsedError = parseError(err)
            next(parsedError);
        }
    },


    //get logged in user
    getMe: async (req: AuthRequest, res: Response) => {
        try {
            if (!req.userId) return res.status(401).json({ success: false, message: "Not authenticated" });

            const user = await UserService.findUserById(req.userId);

            if (!user) return res.status(404).json({ message: "User not found" });

            res.json({ success: true, data: user });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Server error" });
        }
    },

    //user logout
    logout: async (req: Request, res: Response, next: NextFunction) => {
        res.cookie('accessToken', '', {
            httpOnly: true,
            secure: ENV.MODE === "dev" ? false : true,
            sameSite: 'none',
            maxAge: 24 * 60 * 60 * 1000,
        });

        res.cookie('refreshToken', '', {
            httpOnly: true,
            secure: ENV.MODE === "dev" ? false : true,
            sameSite: 'none',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        res.status(200).json({ success: true, data: null });
    },
}
