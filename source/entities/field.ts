
import * as awayjs from "awayjs-full";
import Item from "./item";
import DisplayEvent from "./../events/DisplayEvent";
import Point from "./../geom/point";
import Bresenham from "./../algorithm/bresenham";


class Field extends awayjs.DisplayObjectContainer {

    private item: Item;
    private dispatcher: awayjs.IEventDispatcher;

    private shiftPressed: boolean = false;
    private ctrlPressed: boolean = false;
    private lastClickedItemPosition: Point;

    private static bresenham: Bresenham = new Bresenham();

    private items: Item[][];
    private positions: Point[];

    private rows: number;
    private lines: number;

    constructor() {
        super();
        this.dispatcher = Item.dispatcher;
    }

    public initItems(itemWidth: number, itemHeight: number, itemDepth: number, rows: number, lines?: number): void {
        if (!lines) {
            lines = rows;
        }

        this.lines = lines;
        this.rows = rows;

        // this.dispatcher.removeEventListener()
        this.dispatcher.addEventListener(DisplayEvent.ITEM_CLICK, (event: DisplayEvent) => this.onItemClick(event));

        Item.initItemSize(itemWidth, itemDepth);

        let rowsShift: number = 0;
        if (this.isEven(rows)) {
            rowsShift = itemWidth / 2;
        }
        let linesShift: number = 0;
        if (this.isEven(lines)) {
            linesShift = itemDepth / 2;
        }

        let xPosition: number = -1 * itemWidth * ((rows - 1) / 2);
        let zPosition: number = - 1 * itemDepth * ((lines - 1) / 2);
        xPosition -= rowsShift;
        zPosition -= linesShift;
        let xEscapePosition = xPosition;

        this.items = [];

        for (let i: number = 0; i < rows; i++) {
            xPosition = xEscapePosition;
            if (i) {
                zPosition += itemDepth;
            }
            this.items[i] = [];
            for (let j: number = 0; j < lines; j ++) {
                this.item = new Item(i, j);
                this.item.x = xPosition;
                this.item.z = zPosition;
                console.log(xPosition, zPosition);
                xPosition += itemWidth;
                this.items[i][j] = this.item;
                this.addChild(this.item);
            }
        }
    }

    private drawLine(point: Point): void {

        if (this.lastClickedItemPosition !== undefined) {
            this.positions = Field.bresenham.generatePoints(point.x, point.y, this.lastClickedItemPosition.x, this.lastClickedItemPosition.y);
            for (let i: number = 0; i < this.positions.length; i++) {
                let xPosition: number = this.positions[i].x;
                let yPosition: number = this.positions[i].y;
                this.item = this.items[xPosition][yPosition];
                this.item.activate();
            }
        }
    }

    public clear (): void {
         this.lastClickedItemPosition = undefined;
         for (let i: number = 0; i < this.rows; i++) {
             for (let j: number = 0; j < this.lines; j ++) {
                this.item = this.items[i][j];
                this.item.deactivate(false);
            }
        }
    }

    private isEven(value: number): boolean {
        return value % 2 === 0;
    }

    private onItemClick(event: DisplayEvent): void {
        if (this.shiftPressed || this.ctrlPressed) {
            this.drawLine(event.point);
        }
        this.lastClickedItemPosition = event.point;
    }

    public updateKeys (shiftPressed: boolean, ctrlPressed: boolean): void {
        this.shiftPressed = shiftPressed;
        this.ctrlPressed = ctrlPressed;
    }

};





export default Field;