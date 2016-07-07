
import * as awayjs from "awayjs-full";
import DisplayEvent from "./../events/DisplayEvent";
import Point from "./../geom/point";

const MOUSE_OVER: string = awayjs.MouseEvent.MOUSE_OVER;
const MOUSE_OUT: string = awayjs.MouseEvent.MOUSE_OUT;
const CLICK: string = awayjs.MouseEvent.CLICK;

class Item extends awayjs.DisplayObjectContainer {

    private static WIDTH: number = 20;
    private static DEPTH: number = 20;

    private static overPreFlab: awayjs.PrimitiveCubePrefab = new awayjs.PrimitiveCubePrefab(new awayjs.MethodMaterial(0x98AFC7), "triangle", Item.WIDTH, 10, Item.DEPTH);
    private static outPreFlab: awayjs.PrimitiveCubePrefab = new awayjs.PrimitiveCubePrefab(new awayjs.MethodMaterial(0xEEEEEE), "triangle", Item.WIDTH, 10, Item.DEPTH);
    private static activePreFlab: awayjs.PrimitiveCubePrefab = new awayjs.PrimitiveCubePrefab(new awayjs.MethodMaterial(0x151B54), "triangle", Item.WIDTH, 10, Item.DEPTH);


    private _over: awayjs.DisplayObject;
    private _out: awayjs.DisplayObject;
    private _active: awayjs.DisplayObject;
    private _activated: boolean = false;

    private position: Point;

    private static _dispatcher: awayjs.IEventDispatcher;

    public static get dispatcher(): awayjs.IEventDispatcher {
        if (Item._dispatcher === undefined) {
            Item._dispatcher = new awayjs.EventDispatcher();
        }
        return Item._dispatcher;
    }

    constructor(xPosition: number, yPosition: number) {
        super();
        this.init();
        this.position = new Point(xPosition, yPosition);
    }

    public static initItemSize (itemWidth: number, itemDepth: number): void {
          Item.WIDTH = itemWidth;
          Item.DEPTH = itemDepth;
          Item.overPreFlab = new awayjs.PrimitiveCubePrefab(new awayjs.MethodMaterial(0x98AFC7), "triangle", itemWidth, 10, itemDepth);
          Item.outPreFlab = new awayjs.PrimitiveCubePrefab(new awayjs.MethodMaterial(0xEEEEEE), "triangle", itemWidth, 10, itemDepth);
          Item.activePreFlab = new awayjs.PrimitiveCubePrefab(new awayjs.MethodMaterial(0x151B54), "triangle", itemWidth, 10, itemDepth);
    }

    private init(): void {
        this.initObjects();
        this.initListeners();
    };

    private initObjects(): void {
        this._over = Item.overPreFlab.getNewObject();
        this._out = Item.outPreFlab.getNewObject();
        this._active = Item.activePreFlab.getNewObject();
        this._over.x = this._active.x = this._out.x += Item.WIDTH / 2;
        this._over.z = this._active.z = this._out.z += Item.DEPTH / 2;
        this.addChild(this._active);
        this._active.visible = false;
        this.addChild(this._out);
        this._over.visible = false;
        this.addChild(this._over);

    }

    private initListeners(): void {
        this.addEventListener(MOUSE_OVER, (event: awayjs.MouseEvent) => this.onMouseOver(event));
        this.addEventListener(MOUSE_OUT, (event: awayjs.MouseEvent) => this.onMouseOut(event));
        this.addEventListener(awayjs.MouseEvent.CLICK, (event: awayjs.MouseEvent) => this.onClick(event));

    }

     private onClick(event: awayjs.MouseEvent) {
        // if (this.isActive()) {
            // this.deactivate();
        // } else {
            Item.dispatcher.dispatchEvent(new DisplayEvent(DisplayEvent.ITEM_CLICK, this.position));
            // this.activate();
        // }
    };

    private onMouseOver(event: awayjs.MouseEvent) {
        if (this._activated) {
            return;
        }
        // (<Mesh> event.object).material = this._mouseOverMaterial;
        this._over.visible = true;
        this._out.visible = false;

    };

    private onMouseOut(event: awayjs.MouseEvent) {
        // (<Mesh> event.object).material = this._mouseOutMaterial;
        if (this._activated) {
            return;
        }
        this._over.visible = false;
        this._out.visible = true;
    };

    public activate() {
        this._activated = true;
        this._over.visible = false;
        this._out.visible = false;
        this._active.visible = true;
    }

    public deactivate (overFlag: boolean = true) {
        this._activated = false;
        if (overFlag) {
            this._over.visible = true;
            this._out.visible = false;
        } else {
            this._over.visible = false;
            this._out.visible = true;
        }
        this._active.visible = false;
    }

    public isActive(): boolean {
        return this._activated;
    }

    public select(): void {
        this._activated = true;
        this._over.visible = true;
        this._out.visible = false;
        this._active.visible = false;
    }


};



export default Item;