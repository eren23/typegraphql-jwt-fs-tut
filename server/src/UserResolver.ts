import { Arg, Ctx, Field, Int, Mutation, ObjectType, Query, Resolver, UseMiddleware } from "type-graphql";
import { User } from "./entity/User";
import { hash, compare } from "bcryptjs"
import { MyContext } from "./MyContext";
import { createAccessToken, createRefreshToken } from "./auth";
import { isAuth } from "./isAuth";
import { getConnection } from "typeorm";

@ObjectType()
class LoginResponse {
    @Field()
    accessToken: string
}

@Resolver()
export class UserResolver {
    @Query(() => String)
    async hello() { return "hi" }

    @Query(() => String)
    @UseMiddleware(isAuth)
    async bye(
        @Ctx() { payload }: MyContext
    ) {
        return `your user id is! ${payload?.userId}`
    }

    @Query(() => [User])
    async users() { return User.find() }

    @Mutation(() => Boolean)
    async register(
        @Arg("email") email: string,
        @Arg("password") password: string,

    ) {
        const hashedPassword = await hash(password, 10)
        try {

            await User.insert({
                email,
                password: hashedPassword
            });

            return true

        } catch (error) {
            console.log(error);
            return false
        }

    }

    @Mutation(() => Boolean)
    async revokeRefreshTokensForUser(
        @Arg("userId", () => Int) userId: number
    ) {
        await getConnection().getRepository(User).increment({ id: userId }, "tokenVersion", 1)
        return true;
    }

    @Mutation(() => LoginResponse)
    async login(
        @Arg("email") email: string,
        @Arg("password") password: string,
        @Ctx() { res }: MyContext
    ): Promise<LoginResponse> {

        const user = await User.findOne({ where: { email } })
        if (!user) {
            throw new Error("invalid login attempt")
        }

        const valid = await compare(password, user.password)
        if (!valid) {
            throw new Error("invalid login attempt")
        }

        //login success
        res.cookie("jid", createRefreshToken(user), { httpOnly: true })
        return {
            accessToken: createAccessToken(user)
        };
    }
}