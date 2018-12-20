import { User } from "./User";

export interface Bid {
    id: string;
    value: number;
    user: User;
    dateTime: Date;
}