import { User } from "./User";
import { AuctionProduct } from "./AuctionProduct";

export interface Bid {
    id: string;
    value: number;
    user: User;
    dateTime: Date;
    auctionProduct: AuctionProduct
}