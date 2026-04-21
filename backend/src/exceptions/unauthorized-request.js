import { BaseException } from "./base.exception.js";

export class UnauthorizedRequestException extends BaseException{
    constructor(message) {
        super(message);
        this.status = 401;
        this.name = "Unauthorized Request Exception";
    }
}