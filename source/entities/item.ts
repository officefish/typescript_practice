
import * as awayjs from "awayjs-full";
import DisplayEvent from "./../events/DisplayEvent";
import Point from "./../geom/point";

const MOUSE_OVER: string = awayjs.MouseEvent.MOUSE_OVER;
const MOUSE_OUT: string = awayjs.MouseEvent.MOUSE_OUT;
const CLICK: string = awayjs.MouseEvent.CLICK;

class Item extends awayjs.DisplayObjectContainer {

    protected static WIDTH: number = 20;
    protected static DEPTH: number = 20;

    private static cubePreFlab: awayjs.PrimitiveCubePrefab;

    private static _lightPicker: awayjs.StaticLightPicker;
    public static set lightPicker(picker: awayjs.StaticLightPicker) {
        Item.overMaterial.lightPicker = picker;
        Item.outMaterial.lightPicker = picker;
        Item.activeMaterial.lightPicker = picker;
        Item.selectMaterial.lightPicker = picker;
    }

    private static _overMaterial: awayjs.MethodMaterial;
    private static get overMaterial(): awayjs.MethodMaterial {
        if (Item._overMaterial === undefined) {
            Item._overMaterial = new awayjs.MethodMaterial(0x98AFC7);
        }
        return Item._overMaterial;
    }
    private static _outMaterial: awayjs.MethodMaterial;
    private static get outMaterial(): awayjs.MethodMaterial {
        if (Item._outMaterial === undefined) {
            Item._outMaterial = new awayjs.MethodMaterial(0xEEEEEE);
        }
        return Item._outMaterial;
    }
    private static _activeMaterial: awayjs.MethodMaterial;
    private static get activeMaterial(): awayjs.MethodMaterial {
        if (Item._activeMaterial === undefined) {
            Item._activeMaterial = new awayjs.MethodMaterial(0x151B8D);
        }
        return Item._activeMaterial;
    }

    private static _selectMaterial: awayjs.MethodMaterial;
    private static get selectMaterial(): awayjs.MethodMaterial {
        if (Item._selectMaterial === undefined) {
            Item._selectMaterial = new awayjs.MethodMaterial(0xFF0000);
        }
        return Item._selectMaterial;
    }

    private static _dispatcher: awayjs.IEventDispatcher;
    public static get dispatcher(): awayjs.IEventDispatcher {
        if (Item._dispatcher === undefined) {
            Item._dispatcher = new awayjs.EventDispatcher();
        }
        return Item._dispatcher;
    }

    protected _body: awayjs.Sprite;
    private _activated: boolean = false;
    private position: Point;

    constructor(xPosition: number, yPosition: number) {
        super();
        this.init();
        this.position = new Point(xPosition, yPosition);
    }

    public static initItemSize (itemWidth: number, itemDepth: number): void {
          Item.WIDTH = itemWidth;
          Item.DEPTH = itemDepth;
          Item.cubePreFlab = new awayjs.PrimitiveCubePrefab(null, "triangle", itemWidth, 10, itemDepth);
    }

    private init(): void {
        this.initObjects();
        this.initListeners();
    };

    protected initObjects(): void {
        this._body = <awayjs.Sprite> Item.cubePreFlab.getNewObject();
        this._body.material = Item.outMaterial;
        this._body.x += Item.WIDTH / 2;
        this._body.z += Item.DEPTH / 2;
        this.addChild(this._body);
    }

    private initListeners(): void {
        this.addEventListener(MOUSE_OVER, (event: awayjs.MouseEvent) => this.onMouseOver(event));
        this.addEventListener(MOUSE_OUT, (event: awayjs.MouseEvent) => this.onMouseOut(event));
        this.addEventListener(awayjs.MouseEvent.CLICK, (event: awayjs.MouseEvent) => this.onClick(event));

    }

     private onClick(event: awayjs.MouseEvent) {
          Item.dispatcher.dispatchEvent(new DisplayEvent(DisplayEvent.ITEM_CLICK, this.position));
     };

    private onMouseOver(event: awayjs.MouseEvent) {
        if (this._activated) {
            return;
        }
        this._body.material = Item.overMaterial;

    };

    private onMouseOut(event: awayjs.MouseEvent) {
        if (this._activated) {
            return;
        }
        this._body.material = Item.outMaterial;
    };

    public activate() {
        this._activated = true;
        this._body.material = Item.activeMaterial;
    }

    public deactivate (overFlag: boolean = true) {
        this._activated = false;
        if (overFlag) {
            this._body.material = Item.overMaterial;
        } else {
           this._body.material = Item.outMaterial;
        }
    }

    public isActive(): boolean {
        return this._activated;
    }

    public select(): void {
        this._activated = true;
        this._body.material = Item.selectMaterial;
    }

    public  exclude (value: number): void {
        this._body.height = value;
        this._body.y = this._body.height / 2;
    }


};



export default Item;