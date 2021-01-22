import { GenericParams } from "./generic-params";

export class MessageParams extends GenericParams{
    messageId: string;
    username: string;
    container: string = "inbox";

    constructor(){
        super();        
    }
}