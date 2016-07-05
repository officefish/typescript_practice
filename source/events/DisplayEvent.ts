import * as awayjs from "awayjs-full";
import Point from "./../geom/point";


class DisplayEvent extends awayjs.MouseEvent {

    public static ITEM_CLICK: string = "itemClick";

    public point: Point;
    constructor(type: string, point: Point ) {
        super(type);
        this.point = point;
    }

     // Override the protected method
    public clone(): DisplayEvent {
        // If we want we can still explicitely call the initial method
        return new DisplayEvent(this.type, this.point);
    }
}
export default DisplayEvent;