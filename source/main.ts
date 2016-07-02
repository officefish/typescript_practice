import * as awayjs from "awayjs-full";

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

    //light objects
    private _light: awayjs.DirectionalLight;
    private _lightPicker: awayjs.StaticLightPicker;
    private _direction: awayjs.Vector3D;

    //scene objects
    private _loader: awayjs.Loader;
    private _plane: awayjs.PrimitivePlanePrefab;
    private _ground: awayjs.DisplayObject;

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
	 * Initialise the scene objects
	 */
    private initObjects(): void {
         console.log("Init Objects");
        // this._loader = new awayjs.Loader();
        // this._loader.transform.scale = new awayjs.Vector3D(300, 300, 300);
        // this._loader.z = -200;
        // this._view.scene.addChild(this._loader);

        this._plane = new awayjs.PrimitivePlanePrefab(null, "triangle", 1000, 1000);
        this._ground = this._plane.getNewObject();
        // this._ground.material = this._groundMaterial;
        this._ground.castsShadows = false;
        this._view.scene.addChild(this._ground);
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
    }

    private onEnterFrame(dt: number): void {
        this._time += dt;
        this._direction.x = -Math.sin(this._time / 4000);
        this._direction.z = -Math.cos(this._time / 4000);
        this._light.direction = this._direction;

        this._view.render();
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

