export interface EventListeners {
    // mouseDown is a function that take 1 parameter of type MouseEvent and return boolean or void
    mouseDown: (event: MouseEvent) => boolean | void;
    // flag for when the MouseEvent changes
    changedMouseDown: boolean;

    contextMenu: (event: MouseEvent) => boolean | void;
    changedContextMenu: boolean;
}
