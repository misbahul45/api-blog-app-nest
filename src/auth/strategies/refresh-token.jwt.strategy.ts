import { Inject, Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ConfigType } from "@nestjs/config";
import { AUTHTYPES } from "src/types/auth.types";
import { AuthService } from "../auth.service";
import refreshConfig from "../config/refresh.config";

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, "refresh-jwt") {
    constructor(
        @Inject(refreshConfig.KEY) private refreshConfiguration: ConfigType<typeof refreshConfig>,
        private authService: AuthService
    ) {
        const config = {
            jwtFromRequest: ExtractJwt.fromBodyField("refresh"),
            secretOrKey: refreshConfiguration.secret,
            ignoreExpiration: false,
        };
        super(config);
    }

    async validate(payload: AUTHTYPES.AuthJwtPayload) {
        const userId = payload.sub;
        return this.authService.validateRefreshToken(userId);
    }
}
