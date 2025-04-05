import { WASI } from "./WasmSystem";

const kMaxEventsPerFrame = 32; // TODO: Keep this in sync with C++

const enum InputType {
    // Touch
    kInputType_TouchStart,  // For all touches:
    kInputType_TouchMove,   //   X,Y = touch position in screen coordinates.
    kInputType_TouchEnd,    //   Force = the force of the touch, with 1.0 being average (and 0.01 being very light).
    kInputType_TouchCancel, //   Touch = a unique identifier for this touch. Constant until touch ends

    // Mouse
    kInputType_MouseMoved,  // X,Y = new mouse position in the focused window coordinates. Origin is in the top left.
    kInputType_MouseScroll, // X,Y = change in wheel position. Units are abstract, but normalized across platforms.

    // Gamepad
    kInputType_StickMovedX, // X = new position normalized from [-1.0, 1.0]. Y = same. Button = stick id. No deadzone.
    kInputType_StickMovedY, // Y = new position normalized from [-1.0, 1.0]. X = same. Button = stick id. No deadzone.
    kInputType_GamepadConnected,    // No other useful information stored (button will be None)
    kInputType_GamepadDisconnected, // No other useful information stored (button will be None)

    // Button (Keyboard, Mouse, or Gamepad)
    kInputType_ButtonUp,   // If the button is analog (such as a gamepad trigger), Force = [0.0, 1.0]
    kInputType_ButtonDown, // ... UTF8 = Unicode character if exists or '\0'. E.g. Shift + e = 'E', but Ctrl + e = '\0'.
};


const enum TGCButton {
    None = 0,

    // Apple TV
    Select,
    Menu,
    Play,

    // Gamepad
    Gamepad_Left,
    Gamepad_Right,
    Gamepad_Up,
    Gamepad_Down,
    Gamepad_X,
    Gamepad_PS_Triangle = Gamepad_X,
    Gamepad_NX_Y = Gamepad_X,
    Gamepad_Y,
    Gamepad_PS_Square = Gamepad_Y,
    Gamepad_NX_X = Gamepad_Y,
    Gamepad_A,
    Gamepad_PS_X = Gamepad_A,
    Gamepad_NX_B = Gamepad_A,
    Gamepad_B,
    Gamepad_PS_Circle = Gamepad_B,
    Gamepad_NX_A = Gamepad_B,
    Gamepad_LeftShoulder,
    Gamepad_RightShoulder,
    Gamepad_LeftTrigger,
    Gamepad_RightTrigger,
    Gamepad_LeftStick,
    Gamepad_RightStick,
    Gamepad_Select,
    Gamepad_Pause,
    Gamepad_Home,

    Gamepad_Primary_Stick_Right,
    Gamepad_Primary_Stick_Up,
    Gamepad_Primary_Stick_Left,
    Gamepad_Primary_Stick_Down,

    Gamepad_Secondary_Stick_Right,
    Gamepad_Secondary_Stick_Up,
    Gamepad_Secondary_Stick_Left,
    Gamepad_Secondary_Stick_Down,

    // For tutorial icons / button legends
    Gamepad_Primary_Stick_Move,
    Gamepad_Secondary_Stick_Move,

    // For range checking gamepad inputs
    Gamepad_First = Gamepad_Left,
    Gamepad_Last = Gamepad_Secondary_Stick_Move,

    // Keyboard
    Digit0,
    Digit1,
    Digit2,
    Digit3,
    Digit4,
    Digit5,
    Digit6,
    Digit7,
    Digit8,
    Digit9,
    KeyA,
    KeyB,
    KeyC,
    KeyD,
    KeyE,
    KeyF,
    KeyG,
    KeyH,
    KeyI,
    KeyJ,
    KeyK,
    KeyL,
    KeyM,
    KeyN,
    KeyO,
    KeyP,
    KeyQ,
    KeyR,
    KeyS,
    KeyT,
    KeyU,
    KeyV,
    KeyW,
    KeyX,
    KeyY,
    KeyZ,
    F1,
    F2,
    F3,
    F4,
    F5,
    F6,
    F7,
    F8,
    F9,
    F10,
    F11,
    F12,
    F13,
    F14,
    F15,
    F16,
    F17,
    F18,
    F19,
    F20,
    Space,
    Left,
    Right,
    Up,
    Down,
    Backspace,
    Delete,
    Comma,
    Period,
    ForwardSlash,
    BackSlash,
    LeftBracket,
    RightBracket,
    Apostrophe,
    BackTick,
    Minus,
    Equals,
    Semicolon,
    Return,
    Escape,
    Alt,
    Shift,
    Command,
    Ctrl,
    Tab,
    Home,
    End,
    PageUp,
    PageDown,
    Keyboard_First = 0,
    Keyboard_Last = PageDown,

    // Mouse
    MouseLeft,
    MouseRight,
    MouseMiddle,
    MouseWheelUp,
    MouseWheelDown,
    Mouse_First = MouseLeft,
    Mouse_Last = MouseWheelDown,

    // Android
    ActionBarBack,

    MAX_BUTTONS
};

function isModifier(key: string) {
    switch (key) {
        case 'ShiftLeft':
        case 'ShiftRight':
        case 'AltLeft':
        case 'AltRight':
            return true;
        default:
            return false;
    }
}

function translateMouseButton(button: number): TGCButton {
    switch (button) {
        case 0: return TGCButton.MouseLeft;
        case 1: return TGCButton.MouseMiddle;
        case 2: return TGCButton.MouseRight;

        case 3:
        case 4:
        default:
            return TGCButton.None;
    }
}

function translateKeyboardCode(code: string): TGCButton {
    switch (code) {
        case "Backspace": return TGCButton.Backspace;
        case "Tab": return TGCButton.Tab;
        case "Enter": return TGCButton.Return;
        case "ShiftLeft": return TGCButton.Shift;
        case "ShiftRight": return TGCButton.Shift;
        case "AltLeft": return TGCButton.Alt;
        case "AltRight": return TGCButton.Alt;
        case "Escape": return TGCButton.Escape;
        case "Space": return TGCButton.Space;
        case "PageUp": return TGCButton.PageUp;
        case "PageDown": return TGCButton.PageDown;
        case "End": return TGCButton.End;
        case "Home": return TGCButton.Home;
        case "ArrowLeft": return TGCButton.Left;
        case "ArrowUp": return TGCButton.Up;
        case "ArrowRight": return TGCButton.Right;
        case "ArrowDown": return TGCButton.Down;
        case "Delete": return TGCButton.Delete;
        case "Digit0": return TGCButton.Digit0;
        case "Digit1": return TGCButton.Digit1;
        case "Digit2": return TGCButton.Digit2;
        case "Digit3": return TGCButton.Digit3;
        case "Digit4": return TGCButton.Digit4;
        case "Digit5": return TGCButton.Digit5;
        case "Digit6": return TGCButton.Digit6;
        case "Digit7": return TGCButton.Digit7;
        case "Digit8": return TGCButton.Digit8;
        case "Digit9": return TGCButton.Digit9;
        case "KeyA": return TGCButton.KeyA;
        case "KeyB": return TGCButton.KeyB;
        case "KeyC": return TGCButton.KeyC;
        case "KeyD": return TGCButton.KeyD;
        case "KeyE": return TGCButton.KeyE;
        case "KeyF": return TGCButton.KeyF;
        case "KeyG": return TGCButton.KeyG;
        case "KeyH": return TGCButton.KeyH;
        case "KeyI": return TGCButton.KeyI;
        case "KeyJ": return TGCButton.KeyJ;
        case "KeyK": return TGCButton.KeyK;
        case "KeyL": return TGCButton.KeyL;
        case "KeyM": return TGCButton.KeyM;
        case "KeyN": return TGCButton.KeyN;
        case "KeyO": return TGCButton.KeyO;
        case "KeyP": return TGCButton.KeyP;
        case "KeyQ": return TGCButton.KeyQ;
        case "KeyR": return TGCButton.KeyR;
        case "KeyS": return TGCButton.KeyS;
        case "KeyT": return TGCButton.KeyT;
        case "KeyU": return TGCButton.KeyU;
        case "KeyV": return TGCButton.KeyV;
        case "KeyW": return TGCButton.KeyW;
        case "KeyX": return TGCButton.KeyX;
        case "KeyY": return TGCButton.KeyY;
        case "KeyZ": return TGCButton.KeyZ;
        case "MetaLeft": return TGCButton.Command;
        case "MetaRight": return TGCButton.Command;
        case "F1": return TGCButton.F1;
        case "F2": return TGCButton.F2;
        case "F3": return TGCButton.F3;
        case "F4": return TGCButton.F4;
        case "F5": return TGCButton.F5;
        case "F6": return TGCButton.F6;
        case "F7": return TGCButton.F7;
        case "F8": return TGCButton.F8;
        case "F9": return TGCButton.F9;
        case "F10": return TGCButton.F10;
        case "F11": return TGCButton.F11;
        case "F12": return TGCButton.F12;
        case "Semicolon": return TGCButton.Semicolon;
        case "Equal": return TGCButton.Equals;
        case "Comma": return TGCButton.Comma;
        case "Minus": return TGCButton.Minus;
        case "Period": return TGCButton.Period;
        case "Slash": return TGCButton.ForwardSlash;
        case "Backquote": return TGCButton.BackTick;
        case "BracketLeft": return TGCButton.LeftBracket;
        case "Backslash": return TGCButton.BackSlash;
        case "BracketRight": return TGCButton.RightBracket;
        case "Quote": return TGCButton.Apostrophe;

        case "ControlLeft":
        case "ControlRight":
        case "Pause":
        case "CapsLock":
        case "PrintScreen":
        case "Insert":
        case "AudioVolumeMute":
        case "AudioVolumeDown":
        case "AudioVolumeUp":
        case "ContextMenu":
        case "Numpad0":
        case "Numpad1":
        case "Numpad2":
        case "Numpad3":
        case "Numpad4":
        case "Numpad5":
        case "Numpad6":
        case "Numpad7":
        case "Numpad8":
        case "Numpad9":
        case "NumpadMultiply":
        case "NumpadAdd":
        case "NumpadSubtract":
        case "NumpadDecimal":
        case "NumpadDivide":
        case "NumLock":
        case "ScrollLock":
        default:
            return TGCButton.None;
    }
}

export class FInput {
    private wasi: WASI
    private inputCtxPtr: number;
    private eventCount: number = 0;
    private toplevel: HTMLElement;

    constructor() {
        document.body.tabIndex = -1;
    }

    public init(toplevel: HTMLElement, wasi: WASI) {
        this.wasi = wasi;
        this.toplevel = toplevel;
        const getInputCtx = wasi.getInstance().exports.getInputCtx as CallableFunction;
        if (getInputCtx) {
            this.inputCtxPtr = getInputCtx();

            window.addEventListener('contextmenu', (e) => {
                e.preventDefault();
            });

            // https://discussion.evernote.com/topic/114013-web-clipper-chrome-extension-steals-javascript-keyup-events/
            document.addEventListener('keydown', this.onKeyDown, { capture: true });
            document.addEventListener('keyup', (e) => {
                this.pushButtonEvent(InputType.kInputType_ButtonUp, e.charCode, translateKeyboardCode(e.code))
            }, { capture: true });
            this.toplevel.addEventListener('mousedown', (e) => {
                this.pushButtonEvent(InputType.kInputType_ButtonDown, 0, translateMouseButton(e.button));
            });
            this.toplevel.addEventListener('mouseup', (e) => {
                this.pushButtonEvent(InputType.kInputType_ButtonUp, 0, translateMouseButton(e.button));
            });
            this.toplevel.addEventListener('mousemove', (e) => {
                this.pushMouseEvent(InputType.kInputType_MouseMoved, e.clientX, e.clientY);
            });
            this.toplevel.addEventListener('wheel', (e) => {
                this.pushMouseEvent(InputType.kInputType_MouseScroll, e.deltaX, e.deltaY);
            }, { passive: true });
            window.addEventListener("gamepadconnected", (e) => {
                e.gamepad.index
                this.pushButtonEvent(InputType.kInputType_GamepadConnected, 0, 0);
            });
            window.addEventListener("gamepaddisconnected", (e) => {
                this.pushButtonEvent(InputType.kInputType_GamepadDisconnected, 0, 0);
            });

        } else {
            console.warn('Failed to initialize Input system. The WASM module does not export getInputCtx()');
        }
    }

    public update() {
        const gamepad = navigator.getGamepads()[0];
        if (!gamepad) { return; }

        // TODO: Gamepad input polling
    }

    private onKeyDown = (e: KeyboardEvent) => {
        if (isModifier(e.code)) {
            e.preventDefault();
        } else {
            if (!this._hasFocus()) return;
        }

        if (e.repeat) { return; }

        this.pushButtonEvent(InputType.kInputType_ButtonDown, e.charCode, translateKeyboardCode(e.code))

    };

    private _hasFocus() {
        return document.activeElement === document.body || document.activeElement === this.toplevel;
    }

    private pushButtonEvent(type: InputType, utf8: number, button: TGCButton) {
        if (this.eventCount >= kMaxEventsPerFrame) { return; }

        const view = this.wasi.getDataView();
        const writeBufHead = view.getUint32(this.inputCtxPtr + 4, true);
        const writeBufPtr = writeBufHead + this.eventCount * 40;

        this.wasi.clock_time_get(0, 1, writeBufPtr);    // timestamp: In system time format
        view.setFloat32(writeBufPtr + 8, 0.0, true);    // x
        view.setFloat32(writeBufPtr + 12, 0.0, true);   // y
        view.setFloat32(writeBufPtr + 16, 0.0, true);   // force
        view.setUint32(writeBufPtr + 20, type, true);   // type
        view.setUint32(writeBufPtr + 24, utf8, true);   // utf8
        view.setUint32(writeBufPtr + 32, button, true); // button

        const eventCount = view.getUint32(this.inputCtxPtr + 12, true);
        view.setUint32(this.inputCtxPtr + 12, eventCount + 1, true);
    }

    private pushMouseEvent(type: InputType, x: number, y: number) {
        if (this.eventCount >= kMaxEventsPerFrame) { return; }

        const view = this.wasi.getDataView();
        const writeBufHead = view.getUint32(this.inputCtxPtr + 4, true);
        const writeBufPtr = writeBufHead + this.eventCount * 40;

        this.wasi.clock_time_get(0, 1, writeBufPtr);            // timestamp: In system time format
        view.setFloat32(writeBufPtr + 8, x, true);              // x
        view.setFloat32(writeBufPtr + 12, y, true);             // y
        view.setFloat32(writeBufPtr + 16, 0.0, true);           // force
        view.setUint32(writeBufPtr + 20, type, true);           // type
        view.setUint32(writeBufPtr + 24, 0, true);              // utf8
        view.setUint32(writeBufPtr + 32, TGCButton.None, true); // button

        const eventCount = view.getUint32(this.inputCtxPtr + 12, true);
        view.setUint32(this.inputCtxPtr + 12, eventCount + 1, true);
    }

    private pushAxisEvent(type: InputType, button: TGCButton, x: number, y: number) {
        if (this.eventCount >= kMaxEventsPerFrame) { return; }

        const view = this.wasi.getDataView();
        const writeBufHead = view.getUint32(this.inputCtxPtr + 4, true);
        const writeBufPtr = writeBufHead + this.eventCount * 40;

        this.wasi.clock_time_get(0, 1, writeBufPtr);    // timestamp: In system time format
        view.setFloat32(writeBufPtr + 8, x, true);      // x
        view.setFloat32(writeBufPtr + 12, y, true);     // y
        view.setFloat32(writeBufPtr + 16, 0.0, true);   // force
        view.setUint32(writeBufPtr + 20, type, true);   // type
        view.setUint32(writeBufPtr + 24, 0, true);      // utf8
        view.setUint32(writeBufPtr + 32, button, true); // button

        const eventCount = view.getUint32(this.inputCtxPtr + 12, true);
        view.setUint32(this.inputCtxPtr + 12, eventCount + 1, true);
    }
}