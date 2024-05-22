import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class RefreshJwtStrategy extends PassportStrategy(
    Strategy,
    'jwt-refresh'
) {
    constructor(
        config: ConfigService,
        private prisma: PrismaService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: config.get('JWT_REFRESH_SECRET'),
        });
    }

    async validate(payload: {
        sub: string;
        email: string;
    }) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: payload.sub,
            },
        });
        delete user.hash;
        return user;
    }
}