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
    },

    getGoogleUserInfo: async (code: string) => {
        const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
                code,
                client_id: ENV.GOOGLE_CLIENT_ID,
                client_secret: ENV.GOOGLE_CLIENT_SECRET,
                redirect_uri: ENV.GOOGLE_REDIRECT_URI,
                grant_type: "authorization_code",
            }),
        });

        const tokens = await tokenResponse.json() as any;
        if (!tokens.id_token) {
            throw new Error(tokens.error_description || "Failed to get Google id_token");
        }

        // Decode the ID token to get user info (it's a JWT)
        const decodedToken = jwt.decode(tokens.id_token) as any;
        return {
            googleId: decodedToken.sub,
            email: decodedToken.email,
            name: decodedToken.name,
            picture: decodedToken.picture,
        };
    }
}
