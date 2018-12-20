import { Product } from "./Product";
import { Bid } from "./Bid";

export interface AuctionProduct {
    id: string;
    sequence: number;
    timeoutInMilliseconds: number;
    tickIntervalInMilliseconds: number;
    product: Product;
    startValue: number;
    started: Date;
    ended: Date;
    bids: Bid[];
    lastValidBid: number;
    status: number;
    leftTimeInMilliseconds: number;
}