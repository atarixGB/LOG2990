// TODO : Avoir un fichier séparé pour les constantes ?
export const MIN_WIDTH = 250;
export const MIN_HEIGHT = 250;
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
