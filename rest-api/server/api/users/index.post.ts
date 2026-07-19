import { defineEventHandler, readBody, type H3Event} from "h3";
import UserRepository from "./repository";

export default defineEventHandler(async (event: H3Event) => {
    const body = await readBody(event);

    return UserRepository.create(body);
});