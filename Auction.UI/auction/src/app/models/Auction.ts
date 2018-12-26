import { AuctionProduct } from "./AuctionProduct";

export interface Auction {
    id: string;
    title: string;
    start: Date;
    available: Date;
    ended: Date;
    auctionProducts: AuctionProduct[];
    status: number;
    leftTimeToStartInMilliseconds: number;
    leftTimeToBeAvailableInMilliseconds: number;
}