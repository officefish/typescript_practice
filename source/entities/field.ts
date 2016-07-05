
import * as awayjs from "awayjs-full";
import Item from "./item";

class Field extends awayjs.DisplayObjectContainer {

    private item: Item;

    public initItems(rows: number, lines?: number): void {
        if (!lines) {
            lines = rows;
        }

        let rowsShift: number = 0;
        if (this.isEven(rows)) {
            rowsShift = Item.WIDTH / 2;
        }
        let linesShift: number = 0;
        if (this.isEven(lines)) {
            linesShift = Item.DEPTH / 2;
        }

        let xPosition: number = -1 * Item.WIDTH * ((rows - 1) / 2);
        let zPosition: number = - 1 * Item.DEPTH * ((lines - 1) / 2);
        xPosition -= rowsShift;
        zPosition -= linesShift;
        let xEscapePosition = xPosition;

        for (let i: number = 0; i < rows; i++) {
            xPosition = xEscapePosition;
            if (i) {
                zPosition += Item.DEPTH;
            }
            for (let j: number = 0; j < lines; j ++) {
                this.item = new Item();
                this.item.x = xPosition;
                this.item.z = zPosition;
                console.log(xPosition, zPosition);
                xPosition += Item.WIDTH;
                this.addChild(this.item);
            }
        }

        console.log (this.numChildren);
    }

    private isEven(value: number): boolean {
        return value % 2 === 0;
    }

};





export default Field;