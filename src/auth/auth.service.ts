import {
    BadRequestException,
    ForbiddenException,
    Injectable,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto, SignUpDto } from './dto';
import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwt: JwtService,
        private config: ConfigService,
    ) { }

    async signup(dto: SignUpDto) {
        // generate the password hash
        const hash = await argon.hash(dto.password);

        const userExists = await this.prisma.user.findFirst({
            where: {
                email: dto.email
            }
        })

        if (userExists)
            throw new BadRequestException("This email is already in use.")

        // save the new user in the db
        try {
            const user = await this.prisma.user.create({
                data: {
                    firstName: dto.firstName,
                    lastName: dto.lastName,
                    email: dto.email,
                    hash,
                },
            });

            return this.signToken(`${user.firstName} ${user.lastName}`, user.id, user.email);
        } catch (error) {
            console.error(error);
            if (
                error instanceof
                PrismaClientKnownRequestError
            ) {
                if (error.code === 'P2002') {
                    throw new ForbiddenException(
                        'Credentials taken',
                    );
                }
            }
            throw error;
        }
    }

    async signin(dto: AuthDto) {
        // find the user by email
        const user =
            await this.prisma.user.findUnique({
                where: {
                    email: dto.email,
                },
            });
        // if user does not exist throw exception
        if (!user)
            throw new ForbiddenException(
                'User not found.',
            );

        // compare password
        const pwMatches = await argon.verify(
            user.hash,
            dto.password,
        );
        // if password incorrect throw exception
        if (!pwMatches)
            throw new ForbiddenException(
                'Username or password incorrect.',
            );
        return this.signToken(`${user.firstName} ${user.lastName}`, user.id, user.email);
    }

    async signToken(
        userFullName: string,
        userId: string,
        email: string,
    ): Promise<{ access_token: string, refresh_token: string }> {
        const payload = {
            sub: userId,
            email,
            fullName: userFullName
        };

        const accessTokenSecret = this.config.get('JWT_SECRET');
        const refreshTokenSecret = this.config.get('JWT_REFRESH_SECRET');

        const accessToken = await this.jwt.signAsync(
            payload,
            {
                expiresIn: '15m',
                secret: accessTokenSecret,
            },
        );

        const refreshToken = await this.jwt.signAsync(payload, {
            expiresIn: '7d',
            secret: refreshTokenSecret,
        });

        return {
            access_token: accessToken,
            refresh_token: refreshToken
        };
    }

    async refreshToken(refreshToken: string): Promise<{ access_token: string }> {
        try {
            const payload = this.jwt.verify(refreshToken, {
                secret: this.config.get('JWT_REFRESH_SECRET'),
            });

            return this.signToken(payload.fullName, payload.sub, payload.email);
        } catch (error) {
            throw new ForbiddenException('Invalid refresh token');
        }
    }

}