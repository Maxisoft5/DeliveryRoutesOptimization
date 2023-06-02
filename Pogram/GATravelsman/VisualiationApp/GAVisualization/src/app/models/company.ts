import { Carrier } from "./carrier";


export class Company {
    id: number = 0;
    name: string = "";
    carriers: Carrier[] | undefined;
}