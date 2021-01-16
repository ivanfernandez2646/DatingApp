import { GenericParams } from "./generic-params";

export class LikeParams extends GenericParams {
    predicate: string = "liked";

    constructor(){
        super();
    }
}