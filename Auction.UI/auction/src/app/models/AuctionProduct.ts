import { Product } from "./Product";
import { Bid } from "./Bid";
import { Auction } from "./Auction";

export interface AuctionProduct {
    id: string;
    sequence: number;
    timeoutInMilliseconds: number;
    tickIntervalInMilliseconds: number;
    auction: Auction;
    product: Product;
    initialValue: number;
    incrementValue: number;
    started: Date;
    ended: Date;
    bids: Bid[];
    lastValidBid: Bid;
    status: number;
    leftTimeInMilliseconds: number;
}