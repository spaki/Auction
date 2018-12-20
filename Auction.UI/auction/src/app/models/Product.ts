import { Picture } from "./Picture";

export interface Product {
    id: string;
    name: string;
    description: string;
    pictures: Picture[];
}