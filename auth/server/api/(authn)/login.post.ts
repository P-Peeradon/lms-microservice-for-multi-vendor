import { defineHandler, HTTPError, readBody, type H3Event } from "h3";
import passwordHelper from "../../../helper/password";
import jweTokenHelper from "#helper/jweToken.ts";
import { Role, University } from "#helper/interface.ts";

interface LoginRequestBody {
    username: string;
    password: string;
}

export default defineHandler(async (event: H3Event) => {
    const body: LoginRequestBody | undefined = await readBody<LoginRequestBody>(event);
    const { username, password } = body ?? {};

    if (!username || !password) {
        return new HTTPError({
            statusCode: 400,
            message: "Username and password are required."
        });
    }

    const correctPassword: boolean = await passwordHelper.verifyPassword(username, password);

    if (!correctPassword) {
        return new HTTPError({
            statusCode: 401,
            message: "Invalid username or password."
        });
    }

    const token = await jweTokenHelper.generateJWEToken({ shadowID: username, issuedBy: University.unimelb, role: [Role.Student] }, process.env.JWE_SECRET);

    const ipAddress = event.req.headers.get('x-forwarded-for') || '';
    const userAgent = event.req.headers.get('user-agent') || '';

    event.res.headers.set("Content-Type", "application/json");
    event.res.headers.set("Access-Control-Allow-Origin", "*");
    event.res.status = 200;
    event.res.statusText = "OK";

    return {
        message: "Login successful",
        username,
        password
    };
});