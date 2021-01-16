import { GenericParams } from "./generic-params";
import { User } from "./user";

export class UserParams extends GenericParams{
    minAge: number = 18;
    maxAge: number = 120;
    gender: string;
    currentUsername: string;
    orderBy: string = "lastActive";

    constructor(user: User){
        //Gender by default is the opposite
        super();
        this.gender = (user.gender == "male" ? "female" : "male");
        this.currentUsername = user.userName;
    }
}
