
import * as awayjs from "awayjs-full";
import Item from "./Item";
import DisplayEvent from "./../events/DisplayEvent";
import Point from "./../geom/point";
import Bresenham from "./../algorithm/bresenham";
import CMYK from "./../algorithm/cmyk";
import FieldMatrix from "./../data/fieldMatrix";



class Field extends awayjs.DisplayObjectContainer {

   

    private item: Item;
    private dispatcher: awayjs.IEventDispatcher;

    private shiftPressed: boolean = false;
    private ctrlPressed: boolean = false;
    private lastClickedItemPosition: Point;

    private static bresenham: Bresenham = new Bresenham();
    private static cmyk: CMYK = new CMYK();

    protected items: Item[][];
    private positions: Point[];

    private rows: number;
    private lines: number;

    private lightPicker: awayjs.StaticLightPicker;

    private itemWidth: number;
    private itemDepth: number;

    protected matrix: number[][];

    private _arrow: awayjs.Sprite;
    private contour: Point[];

    constructor() {
        super();
        this.dispatcher = Item.dispatcher;
    }

    public set arrow (value: awayjs.Sprite) {
        this._arrow = value;
    }

    public setLightPicker(picker: awayjs.StaticLightPicker) {
        this.lightPicker = picker;
        Item.lightPicker = picker;
    }

    public initItems(itemWidth: number, itemHeight: number, itemDepth: number, rows: number, lines?: number): void {
        if (!lines) {
            lines = rows;
        }

        this.itemWidth = itemWidth;
        this.itemDepth = itemDepth;

        this.lines = lines;
        this.rows = rows;
        this.matrix = FieldMatrix.getMatrix(rows, lines);

        // this.dispatcher.removeEventListener()
        this.dispatcher.addEventListener(DisplayEvent.ITEM_CLICK, (event: DisplayEvent) => this.onItemClick(event));

        this.initItemSize(itemWidth, itemDepth);

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
                this.item = this.initItem(i, j);
                this.item.x = xPosition;
                this.item.z = zPosition;
                xPosition += itemWidth;
                this.items[i][j] = this.item;
                this.addChild(this.item);
            }
        }
    }

    protected initItemSize(itemWidth: number, itemDepth: number) {
         Item.initItemSize(itemWidth, itemDepth);
    }

    protected initItem (xPosition: number, yPosition: number): Item {
        let item: Item = new Item(xPosition, yPosition);
        return item;
    }

    private drawLine(point: Point): void {

        if (this.lastClickedItemPosition !== undefined) {
            this.positions = Field.bresenham.generatePoints(point.x, point.y, this.lastClickedItemPosition.x, this.lastClickedItemPosition.y);
            for (let i: number = 0; i < this.positions.length; i++) {
                let xPosition: number = this.positions[i].x;
                let yPosition: number = this.positions[i].y;
                this.item = this.items[xPosition][yPosition];
                this.matrix[xPosition][yPosition] = FieldMatrix.FULL;
                this.item.activate();
            }
        }
    }

    public clear (): void {
         this.lastClickedItemPosition = undefined;
         for (let i: number = 0; i < this.rows; i++) {
             for (let j: number = 0; j < this.lines; j ++) {
                this.item = this.items[i][j];
                this.matrix[i][j] = FieldMatrix.EMPTY;
                this.item.deactivate(false);
            }
        }
    }

    private isEven(value: number): boolean {
        return value % 2 === 0;
    }

    private onItemClick(event: DisplayEvent): void {
        let point: Point = event.point;
        let item: Item = this.items[point.x][point.y];
        if (item.isActive()) {
            if (this.ctrlPressed) {
               this.selectControur(point);
            } else {
                this.matrix[point.x][point.y] = FieldMatrix.EMPTY;
                item.deactivate();
            }
        } else {
            if (this.shiftPressed) {
                this.drawLine(event.point);
            }
            this.matrix[point.x][point.y] = FieldMatrix.FULL;
            item.activate();
            this.lastClickedItemPosition = event.point;
        }


    }

    protected selectControur (point: Point): void {
         let contour: Point[] = Field.cmyk.getContour(point, this.matrix);
         if (contour !== undefined) {
             this.contour = contour;
             let position: Point;
             for (let i: number = 0; i < contour.length; i ++) {
                 position = contour[i];
                 this.item = this.items[position.x][position.y];
                 this.item.select();
             }
             this.item = this.items[point.x][point.y];
             this._arrow.x = this.item.x  + this.itemWidth / 2;
             this._arrow.y = this.item.y;
             this._arrow.z = this.item.z + this.itemDepth / 2;
             this.addChild(this._arrow);


         }
    }

    public exclude (value: number) {
         let position: Point;
         for (let i: number = 0; i < this.contour.length; i ++) {
             position = this.contour[i];
             this.item = this.items[position.x][position.y];
             this.item.exclude(value);
        }
    }

    public fix (): void {
         this.removeChild(this._arrow);
         let position: Point;
         for (let i: number = 0; i < this.contour.length; i ++) {
             position = this.contour[i];
             this.item = this.items[position.x][position.y];
             this.item.activate();
        }
    }

    public updateKeys (shiftPressed: boolean, ctrlPressed: boolean): void {
        this.shiftPressed = shiftPressed;
        this.ctrlPressed = ctrlPressed;
    }

};





export default Field;