
import { FInput } from './FInput';
import { GITHUB_REVISION_URL, IS_DEVELOPMENT} from './version';
import { WASI } from './WasmSystem';

class Main {
    public toplevel: HTMLElement;
    public canvas: HTMLCanvasElement;
    public paused: boolean = false;
    
    private wasi = new WASI();
    private wasm: WebAssembly.WebAssemblyInstantiatedSource;
    private input = new FInput();
    
    constructor() {
        this.init();
    }

    public async init() {
        console.log(`Source for this build available at ${GITHUB_REVISION_URL}`);
        
        const wasmImports = {
            ...this.wasi.imports,
        }
        const url = new URL('http://localhost:8080/triangle.wasm' )
        this.wasm = await WebAssembly.instantiateStreaming(fetch(url), wasmImports);
        this.wasi.initialize(this.wasm.instance);

        this.toplevel = document.createElement('div');
        document.body.appendChild(this.toplevel);

        (this.wasm.instance.exports.init as CallableFunction)();
        this.input.init(this.toplevel, this.wasi);

        this.canvas = document.createElement('canvas');

        // Initialize Viewer
        
        this.toplevel.appendChild(this.canvas);
        window.onresize = this._onResize.bind(this);
        this._onResize();

        this._makeUI();

        this._updateLoop(window.performance.now());

        if (!IS_DEVELOPMENT) {
            // Initialize Rollbar/Sentry for error reporting
        }
    }

    public setPaused(v: boolean): void {
        if (this.paused === v)
            return;

        this.paused = true;
        if (!this.paused)
            window.requestAnimationFrame(this._updateLoop);
    }

    private _updateLoop = (time: number) => {
        if (this.paused)
            return;
        
        this.input.update();

        const update = this.wasm.instance.exports.update as CallableFunction;
        update();

        window.requestAnimationFrame(this._updateLoop);
    };

    private _onResize() {
        // Handle canvas resize
    }

    private _makeUI() {
        // Add any UI to the DOM
    }
}

// Google Analytics
declare var gtag: (command: string, eventName: string, eventParameters: { [key: string]: string }) => void;

// Declare a "main" object for easy access.
declare global {
    interface Window {
        main: any;
    }
}

window.main = new Main();

// Debug utilities.
declare global {
    interface Window {
        debug: any;
    }
}
