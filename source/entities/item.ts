
import * as awayjs from "awayjs-full";

const MOUSE_OVER: string = awayjs.MouseEvent.MOUSE_OVER;
const MOUSE_OUT: string = awayjs.MouseEvent.MOUSE_OUT;

class Item extends awayjs.DisplayObjectContainer {

    public static WIDTH: number = 100;
    public static DEPTH: number = 100;

    private static overPreFlab: awayjs.PrimitiveCubePrefab = new awayjs.PrimitiveCubePrefab(new awayjs.MethodMaterial(0x98AFC7), "triangle", Item.WIDTH, 10, Item.DEPTH);
    private static outPreFlab: awayjs.PrimitiveCubePrefab = new awayjs.PrimitiveCubePrefab(new awayjs.MethodMaterial(0xEEEEEE), "triangle", Item.WIDTH, 10, Item.DEPTH);
    private static activePreFlab: awayjs.PrimitiveCubePrefab = new awayjs.PrimitiveCubePrefab(new awayjs.MethodMaterial(0x151B54), "triangle", Item.WIDTH, 10, Item.DEPTH);


    private _over: awayjs.DisplayObject;
    private _out: awayjs.DisplayObject;
    private _active: awayjs.DisplayObject;
    private _activated: boolean = false;

    constructor() {
        super();
        this.init();
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
        if (this.isActive()) {
            this.deactivate();
        } else {
            this.activate();
        }
    };

    private onMouseOver(event: awayjs.MouseEvent) {
        if (this._activated) {
            return;
        }
        // (<Mesh> event.object).material = this._mouseOverMaterial;
        console.log("mouseover");
        this._over.visible = true;
        this._out.visible = false;

    };

    private onMouseOut(event: awayjs.MouseEvent) {
        // (<Mesh> event.object).material = this._mouseOutMaterial;
        if (this._activated) {
            return;
        }
        console.log("mouseout");
        this._over.visible = false;
        this._out.visible = true;
    };

    public activate() {
        this._activated = true;
        this._over.visible = false;
        this._out.visible = false;
        this._active.visible = true;
    }

    public deactivate () {
        this._activated = false;
        this._over.visible = true;
        this._out.visible = false;
        this._active.visible = false;
    }

    public isActive(): boolean {
        return this._activated;
    }


};



export default Item;