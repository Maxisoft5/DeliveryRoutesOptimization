import { Distance } from "./distance"
import { Duration } from "./duration"

export class Leg {
    distance!: Distance;
    duration: Duration | undefined;
}