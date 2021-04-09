import { Injectable } from '@angular/core';
import { Vec2 } from './../../../classes/vec2';
import { MIN_GRID_SQUARE_SIZE, SelectionBox } from './../../../constants';
import { Size } from './../../../interfaces-enums/size';

@Injectable({
    providedIn: 'root',
})
export class MagnetismService {
    squareSize: number = MIN_GRID_SQUARE_SIZE;
    anchorPoint: SelectionBox = SelectionBox.TopLeft;

    constructor() {}

    activateMagnetism(topLeftPoint:Vec2, size:Size):Vec2{
      const intersectionCoord =this.calculateClosestIntersection(topLeftPoint,size);
      switch (this.anchorPoint) {
        case SelectionBox.TopMiddle: {
            intersectionCoord.x = intersectionCoord.x - size.width / 2;
            intersectionCoord.y = intersectionCoord.y;
            break;
        }
        case SelectionBox.RightMiddle: {
            intersectionCoord.x = intersectionCoord.x - size.width;
            intersectionCoord.y = intersectionCoord.y - size.height / 2;
            break;
        }
        case SelectionBox.LeftMiddle: {
            intersectionCoord.x = intersectionCoord.x;
            intersectionCoord.y = intersectionCoord.y - size.height / 2;
            break;
        }
        case SelectionBox.BottomMiddle: {
            intersectionCoord.x = intersectionCoord.x - size.width / 2;
            intersectionCoord.y = intersectionCoord.y - size.height;
            break;
        }
        case SelectionBox.Center: {
            intersectionCoord.x = intersectionCoord.x - size.width / 2;
            intersectionCoord.y = intersectionCoord.y - size.height / 2;
            break;
        }
        case SelectionBox.TopRight: {
            intersectionCoord.x = intersectionCoord.x - size.width;
            intersectionCoord.y = intersectionCoord.y;
            break;
        }
        case SelectionBox.TopLeft: {
            intersectionCoord.x = intersectionCoord.x;
            intersectionCoord.y = intersectionCoord.y;
            break;
        }
        case SelectionBox.BottomRight: {
            intersectionCoord.x = intersectionCoord.x - size.width;
            intersectionCoord.y = intersectionCoord.y - size.height;
            break;
        }
        case SelectionBox.BottomLeft: {
            intersectionCoord.x = intersectionCoord.x;
            intersectionCoord.y = intersectionCoord.y - size.height;
            break;
        }
    }
    return intersectionCoord;

    }
    private calculateClosestIntersection(topLeftPoint: Vec2, size: Size) {
        const intersectionCoord = this.locateAnchorPoint(topLeftPoint, size);
        if (intersectionCoord.x % this.squareSize > this.squareSize / 2) {
            intersectionCoord.x = Math.floor(intersectionCoord.x / this.squareSize) * this.squareSize + this.squareSize;
        } else {
            intersectionCoord.x = Math.floor(intersectionCoord.x / this.squareSize) * this.squareSize;
        }

        if (intersectionCoord.y % this.squareSize > this.squareSize / 2) {
            intersectionCoord.y = Math.floor(intersectionCoord.y / this.squareSize) * this.squareSize + this.squareSize;
        } else {
            intersectionCoord.y = Math.floor(intersectionCoord.y / this.squareSize) * this.squareSize;
        }
        return intersectionCoord;
    }

    private locateAnchorPoint(topLeftPoint: Vec2, size: Size): Vec2 {
      const intersectionCoord: Vec2 = { x: 0, y: 0 };
      switch (this.anchorPoint) {
          case SelectionBox.TopMiddle: {
              intersectionCoord.x = topLeftPoint.x + size.width / 2;
              intersectionCoord.y = topLeftPoint.y;
              break;
          }
          case SelectionBox.RightMiddle: {
              intersectionCoord.x = topLeftPoint.x + size.width;
              intersectionCoord.y = topLeftPoint.y + size.height / 2;
              break;
          }
          case SelectionBox.LeftMiddle: {
              intersectionCoord.x = topLeftPoint.x;
              intersectionCoord.y = topLeftPoint.y + size.height / 2;
              break;
          }
          case SelectionBox.BottomMiddle: {
              intersectionCoord.x = topLeftPoint.x + size.width / 2;
              intersectionCoord.y = topLeftPoint.y + size.height;
              break;
          }
          case SelectionBox.Center: {
              intersectionCoord.x = topLeftPoint.x + size.width / 2;
              intersectionCoord.y = topLeftPoint.y + size.height / 2;
              break;
          }
          case SelectionBox.TopRight: {
              intersectionCoord.x = topLeftPoint.x + size.width;
              intersectionCoord.y = topLeftPoint.y;
              break;
          }
          case SelectionBox.TopLeft: {
              intersectionCoord.x = topLeftPoint.x;
              intersectionCoord.y = topLeftPoint.y;
              break;
          }
          case SelectionBox.BottomRight: {
              intersectionCoord.x = topLeftPoint.x + size.width;
              intersectionCoord.y = topLeftPoint.y + size.height;
              break;
          }
          case SelectionBox.BottomLeft: {
              intersectionCoord.x = topLeftPoint.x;
              intersectionCoord.y = topLeftPoint.y + size.height;
              break;
          }
      }
      return intersectionCoord;
  }
}
