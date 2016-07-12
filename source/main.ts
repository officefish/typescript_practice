import * as awayjs from "awayjs-full";

import Field from "./entities/field";
// import ChannelField from "./entities/ChannelField";

const MOUSE_DOWN: string = awayjs.MouseEvent.MOUSE_DOWN;
const MOUSE_MOVE: string = awayjs.MouseEvent.MOUSE_MOVE;

class Away3D {

    

    // engine variables
    private _view: awayjs.View;

    // private cameraController: awayjs.HoverController;
    private _cameraController: awayjs.HoverController;

    // navigation variables
    private _timer: awayjs.RequestAnimationFrame;
    private _time: number = 0;
    private _move:boolean = false;
    private _lastPanAngle: number;
    private _lastTiltAngle: number;
    private _lastMouseX: number;
    private _lastMouseY: number;

    // material objects
    private _groundMaterial: awayjs.MethodMaterial;

    // light objects
    private _light: awayjs.DirectionalLight;
    private _lightPicker: awayjs.StaticLightPicker;
    private _direction: awayjs.Vector3D;
    
    // scene objects
    private _loader: awayjs.LoaderContainer;
    private _cubePreflab: awayjs.PrimitiveCubePrefab;
    private _planePreflab: awayjs.PrimitivePlanePrefab;
    private _ground: awayjs.DisplayObjectContainer;
    private _arrow: awayjs.Sprite;

    private _field: Field;
    private arrowPosition: awayjs.Vector3D;
    // private _field: ChannelField;

    private shiftPressed: boolean = false;
    private ctrlPressed: boolean = false;

    private excludeFlag: boolean = false;


    constructor() {
        this.init();
    }

    private init(): void {
        console.log("Init Away3D");
        this.initEngine();
        this.initLights();
        this.initObjects();
        this.initListeners();
    };

    private initEngine(): void {
        console.log("Init Engine");
        this._view = new awayjs.View(new awayjs.DefaultRenderer());

        // setup the camera for optimal shadow rendering
        this._view.camera.projection.far = 2100;

		// setup controller to be used on the camera
        this._cameraController = new awayjs.HoverController(this._view.camera, null, 45, 20, 1000, 10);
    }

    /**
	 * Initialise the lights
	 */
    private initLights(): void {
        console.log("Init Lights");
        this._light = new awayjs.DirectionalLight(-1, -1, 1);
        this._direction = new awayjs.Vector3D(-1, -1, 1);
        this._lightPicker = new awayjs.StaticLightPicker([this._light]);
        this._view.scene.addChild(this._light);
    }

    /**
	 * Initialise the materials
	 */
    private initMaterials(): void {
        this._groundMaterial = new awayjs.MethodMaterial();
        this._groundMaterial.shadowMethod = new awayjs.ShadowSoftMethod(this._light , 10 , 5 );
        this._groundMaterial.shadowMethod.epsilon = 0.2;
        this._groundMaterial.lightPicker = this._lightPicker;
        // this._groundMaterial.specular = 0;
		// this._groundMaterial.mipmap = false;
    }

    /**
	 * Initialise the scene objects
	 */
    private initObjects(): void {
         console.log("Init Objects");
         this._loader = new awayjs.LoaderContainer();
        // this._loader.transform.scale = new awayjs.Vector3D(300, 300, 300);
        // this._loader.z = -200;
        // this._view.scene.addChild(this._loader);
        // this._planePreflab = new awayjs.PrimitivePlanePrefab(null, "triangle", 1000, 1000);
        // this._cubePreflab = new awayjs.PrimitiveCubePrefab(new awayjs.BasicMaterial(), "triangle", 100, 10, 100);

        this._ground = new awayjs.DisplayObjectContainer();
        this._ground.castsShadows = false;
        this._view.scene.addChild(this._ground);

        this._field = new Field();
        this._field.setLightPicker(this._lightPicker);
        this._field.initItems(40, 5, 40, 20, 20);
        this._ground.addChild(this._field);
    }

    /**
	 * Initialise the listeners
	 */
    private initListeners(): void {
        console.log("Init Listeners");
        window.onresize  = (event: UIEvent) => this.onResize(event);
        this.onResize();

        this._timer = new awayjs.RequestAnimationFrame(this.onEnterFrame, this);
        this._timer.start();

        document.onmousedown = (event: MouseEvent) => this.onMouseDown(event);
        document.onmouseup = (event: MouseEvent) => this.onMouseUp(event);
        document.onmousemove = (event: MouseEvent) => this.onMouseMove(event);

        document.onkeydown = (event: KeyboardEvent) => this.onKeyDown(event);
        document.onkeyup = (event: KeyboardEvent) => this.onKeyUp(event);

        let loaderContext: awayjs.LoaderContext = new awayjs.LoaderContext();

        this._loader.addEventListener(awayjs.AssetEvent.ASSET_COMPLETE, (event:awayjs.AssetEvent) => this.onAssetComplete(event));
        // this._loader.addEventListener("loadError", (event: awayjs.LoaderEvent) => this.onLoadError(event));
        // awayjs.AssetLibrary.addEventListener(awayjs.LoaderEvent.LOAD_COMPLETE, (event:awayjs.LoaderEvent) => this.onResourceComplete(event));
        this._loader.load(new awayjs.URLRequest("arrow.3ds"), loaderContext, null, new awayjs.Max3DSParser(false));
        // awayjs.AssetLibrary.load(new awayjs.URLRequest("arrow.3ds"), loaderContext, null, new awayjs.Max3DSParser(false));
    }

    private onLoadError (event: awayjs.LoaderEvent): void {
        console.log ("onLoadError");
    }

    private onResourceComplete (event:awayjs.LoaderEvent): void {
        console.log ("onResourceComplete");

        // let assets: Array<awayjs.IAsset> = event.assets;
        // let length: number = assets.length;
        // console.log(length);

        // for (let c: number = 0; c < length; c ++) {
            // let asset: awayjs.IAsset = assets[c];
            // console.log (asset.assetType);
        // }
    }

    private onAssetComplete(event: awayjs.AssetEvent): void {
        console.log("onAssetComlete");
        // this._loader.removeEventListener(awayjs.AssetEvent.ASSET_COMPLETE, (event:awayjs.AssetEvent) => this.onAssetComplete(event));

        let asset: awayjs.IAsset = event.asset;

        switch (asset.assetType)
        {
        case awayjs.Sprite.assetType :
                let sprite: awayjs.Sprite = <awayjs.Sprite> asset;
                sprite.castsShadows = true;
                sprite.transform.scaleTo(5, 5, 5);
                sprite.material = new awayjs.MethodMaterial(0xFF0000);
                sprite.addEventListener(MOUSE_DOWN, (event: awayjs.MouseEvent) => this.onArrowMouseDown(event));
                this._arrow = sprite;

   
                // sprite.z = -200;
                // this._field.addChild(sprite);
                this._field.arrow = sprite;
                break;
        }

        /*

        let asset: awayjs.Sprite = event.asset as awayjs.Sprite;
        console.log (asset);
        console.log (asset.transform);

        */

        //this._field.addChild(this._loader);
        // console.log (asset.transform.scale);
        //asset.transform.scale =  new awayjs.Vector3D(300, 300, 300);
        //asset.material = new awayjs.MethodMaterial(0xFF0000);
        //asset.z = -200;
        // this._field.addChild(asset);
        //this._loader.transform.scale = new awayjs.Vector3D(300, 300, 300);
		//this._loader.z = -200;
		//this._view.scene.addChild(this._loader.cont);

        console.log (asset.assetType);


		/*
        switch (asset.assetType)
		{
			case Mesh.assetType :
				var mesh:Mesh = <Mesh> event.asset;
				mesh.castsShadows = true;
				break;
			case MethodMaterial.assetType :
				var material:MethodMaterial = <MethodMaterial> event.asset;
				material.shadowMethod = new ShadowSoftMethod(this._light , 10 , 5 );
				material.shadowMethod.epsilon = 0.2;
				//material.mipmap = false;
				material.lightPicker = this._lightPicker;
				material.gloss = 30;
				material.specular = 1;
				material.color = 0x303040;
				material.ambient = 1;

				break;
		}
        */
    }

    private onArrowMouseDown(event: awayjs.MouseEvent): void {
        console.log("position:");
        console.log (this._arrow.y);
        this.excludeFlag = true;

        //this._arrow.addEventListener(MOUSE_MOVE, (event: awayjs.MouseEvent) => this.onArrowMouseMove(event));
        //this._field.addEventListener();
    }

    private onArrowMouseMove(event: awayjs.MouseEvent): void {
      
    }

    private onEnterFrame(dt: number): void {
        this._time += dt;
        this._direction.x = -Math.sin(this._time / 4000);
        this._direction.z = -Math.cos(this._time / 4000);
        this._light.direction = this._direction;

        this._view.render();

        
    }

    private onKeyDown(event: KeyboardEvent): void {
        switch (event.keyCode) {
            case 17: {
                // ctrl;
                this.ctrlPressed = true;
                break;
            }
            case 16: {
                // shift;
                this.shiftPressed = true;
                break;
            }
            case 8: {
                // backspace
                this._field.clear();
                break;
            }
            case 46: {
                this._field.clear();
                break;
                // delete
            }
        }

        this._field.updateKeys(this.shiftPressed, this.ctrlPressed);
    }

    private onKeyUp(event: KeyboardEvent): void {
        switch (event.keyCode) {
            case 17: {
                // ctrl;
                this.ctrlPressed = false;
                break;
            }
            case 16: {
                // shift;
                this.shiftPressed = false;
                break;
            }
        }
        this._field.updateKeys(this.shiftPressed, this.ctrlPressed);
    }


    /**
	 * Mouse down listener for navigation
	 */
    private onMouseDown(event: MouseEvent): void {
        this._lastPanAngle = this._cameraController.panAngle;
        this._lastTiltAngle = this._cameraController.tiltAngle;
        this._lastMouseX = event.clientX;
        this._lastMouseY = event.clientY;
        this._move = true;
    }

	/**
	 * Mouse up listener for navigation
	 */
    private onMouseUp(event: MouseEvent): void {
        this._move = false;
        if (this.excludeFlag) {
            this.excludeFlag = false;
            this._arrow.y = 0;
            this._field.fix();
        }
    }

    private onMouseMove(event: MouseEvent) {
        if (this.excludeFlag) {
           let yCof = this._arrow.y - event.movementY;
           if (yCof >= 0) {
               this._arrow.y = yCof;
               this._field.exclude(yCof);
           }
           //console.log (this._arrow.y);
        } else {
             if (this._move) {
                this._cameraController.panAngle = 0.3 * (event.clientX - this._lastMouseX) + this._lastPanAngle;
                this._cameraController.tiltAngle = 0.3 * (event.clientY - this._lastMouseY) + this._lastTiltAngle;
             }
        }
       
    }

    /**
	 * stage listener for resize events
	 */
    private onResize(event: UIEvent = null): void {
        // console.log("window.innerWidth: " + window.innerWidth);
        // console.log("window.innerHeight: " + window.innerHeight);

        this._view.y = 0;
        this._view.x = 0;
        this._view.width = window.innerWidth;
        this._view.height = window.innerHeight;
    }
};

window.onload = function () {
    new Away3D();
};

