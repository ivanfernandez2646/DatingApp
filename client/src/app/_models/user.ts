import { tokenName } from '@angular/compiler';

export interface User{
    userName: string;
    token: string;
    photoUrl: string;
    knownAs: string;
    gender: string;
    role: string[];
}