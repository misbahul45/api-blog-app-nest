import { registerAs } from "@nestjs/config";

export default registerAs("jwt", () => ({
    secret:process.env.JWT_SECRET,
    signOption:{
        expiresIn:process.env.JWTT_EXPIRES_IN
    }
}))