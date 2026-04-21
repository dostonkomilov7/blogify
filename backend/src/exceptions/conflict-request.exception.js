import { BaseException } from "./base.exception.js";

export class ConflictRequestException extends BaseException {
    constructor(message) {
        super(message);
        this.status = 409;
        this.name = "Conflict Request Exception";
    }
}