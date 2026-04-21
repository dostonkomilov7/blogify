import { BaseException } from "./base.exception.js";

export class BadRequestException extends BaseException {
    constructor(message) {
        super(message);
        this.status = 401;
        this.name = "Bad Request Exception"
    }
}