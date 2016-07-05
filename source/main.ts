import * as awayjs from "awayjs-full";

import Field from "./entities/field";



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
    private _loader: awayjs.Loader;
    private _cubePreflab: awayjs.PrimitiveCubePrefab;
    private _planePreflab: awayjs.PrimitivePlanePrefab;
    private _ground: awayjs.DisplayObjectContainer;

    private _field: Field;
    
    private shiftPressed: boolean = false;
    private ctrlPressed: boolean = false;


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
        // this._loader = new awayjs.Loader();
        // this._loader.transform.scale = new awayjs.Vector3D(300, 300, 300);
        // this._loader.z = -200;
        // this._view.scene.addChild(this._loader);
        // this._planePreflab = new awayjs.PrimitivePlanePrefab(null, "triangle", 1000, 1000);
        this._cubePreflab = new awayjs.PrimitiveCubePrefab(new awayjs.BasicMaterial(), "triangle", 100, 10, 100);

        this._ground = new awayjs.DisplayObjectContainer(); // <awayjs.DisplayObjectContainer> this._planePreflab.getNewObject();
        // this._ground.material = this._groundMaterial;
        this._ground.castsShadows = false;
        this._view.scene.addChild(this._ground);

        this._field = new Field();
            // eval("this._item.material = new awayjs.BasicMaterial().style.color = 0xFF0000");
        this._field.initItems(20, 5, 20, 50, 50);
        this._ground.addChild(this._field);

        // let item2: awayjs.DisplayObject = <awayjs.DisplayObject> this._cubePreflab.getNewObject();
        // item2.x = 100;
        // this._ground.addChild(item2);



        /*
        let item: awayjs.DisplayObject;
        for (let i: number = 0; i < 10; i ++) {
            for (let j: number = 0; j < 10; j ++) {
                 item = 
                 item.x = 101 * i;
                 item.y = 101 * j;
                 // this._ground.addChild(item);
            }
        }
        */
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
    }

    private onMouseMove(event: MouseEvent) {
        if (this._move) {
            this._cameraController.panAngle = 0.3 * (event.clientX - this._lastMouseX) + this._lastPanAngle;
            this._cameraController.tiltAngle = 0.3 * (event.clientY - this._lastMouseY) + this._lastTiltAngle;
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

