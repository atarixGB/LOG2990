// TODO : Avoir un fichier séparé pour les constantes ?
export const DEFAULT_WIDTH = 1000;
export const DEFAULT_HEIGHT = 800;
// TODO : Déplacer ça dans un fichier séparé accessible par tous

export enum MouseButton {
    Left = 0,
    Middle = 1,
    Right = 2,
    Back = 3,
    Forward = 4,
}

export enum TypeOfJunctions {
    REGULAR = 0,
    CIRCLE = 1,
}

export const DEFAULT_LINE_THICKNESS = 1;
export const MIN_ERASER_THICKNESS = 5;

export const DEFAULT_ERASER_COLOR = '#FFF';
export const DEFAULT_JUNCTION_RADIUS = 2;

export enum ToolList {
    Pencil = 0,
    Eraser = 1,
    Line = 2,
    Rectangle = 3,
    Ellipse = 4,
}
export const COLOR_WIN_WIDTH = '500px';

export const WIDTH = 20;
export const HEIGHT = 200;
export const ONE_SIX = 0.17;
export const ONE_THREE = 0.33;
export const ONE_TWO = 0.5;
export const TWO_THREE = 0.67;
export const FIVE_SIX = 0.83;

export const COLOR_POSITION = ['first', 'second'];

export const COLOR_HISTORY = 10;
export const COLOR_ORDER = 2;
export const MAX_DEC_RANGE = 255;
export const OPACITY_POS_ALPHA = 3;
export const HEX_BASE = 16;
export const HEX_VALIDATOR = RegExp('^[a-fA-F0-9 ]+');