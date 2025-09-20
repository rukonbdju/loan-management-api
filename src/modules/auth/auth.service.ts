import { ENV } from "../../config/env";
import { parseDuration } from "../../utils/parse-duration";
import { JWTPayload } from "./auth.types";
import jwt from 'jsonwebtoken'

export const AuthService = {
    //generate new token
    generateToken: (payload: JWTPayload): { accessToken: string, refreshToken: string } => {
        console.log(payload)
        const accessToken = jwt.sign(payload, ENV.JWT_SECRET, {
            expiresIn: parseDuration(ENV.JWT_EXPIRES_IN),
        });

        const refreshToken = jwt.sign(payload, ENV.JWT_SECRET, {
            expiresIn: parseDuration(ENV.JWT_EXPIRES_IN),
        });
        return { accessToken, refreshToken }
    },

    //verify access token
    verifyAccessToken: (token: string) => {
        return jwt.verify(token, ENV.JWT_SECRET);
    },

    //verify refresh token
    verifyRefreshToken: (token: string) => {
        return jwt.verify(token, ENV.JWT_SECRET,);
    }

}
