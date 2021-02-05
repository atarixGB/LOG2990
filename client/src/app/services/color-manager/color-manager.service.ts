import { ColorOrder } from './../../interfaces-enums/color-order';
//this service is responsible of the storage of our 10 selected colors
//it will also handle the conversion from hex code to RGB
import { Injectable } from '@angular/core';
import { ColorChoice } from '../../interfaces-enums/color-order';
import { RGBA } from '../../interfaces-enums/rgba';

const NUMBER_OF_HISTORY_COLORS = 10; //we can store the last 10 chosen colors
const COLOR_CHOICE = 2; //we have 2 color choices primary and secondary color


@Injectable({
    providedIn: 'root',
})
export class ColorManagerService {
    //2 arrays of the interface RGBA
    selectedColors: RGBA[];
    oldColors: RGBA[];

    constructor() {
        this.oldColors = new Array<RGBA>();
        this.selectedColors = new Array<RGBA>();
        let temp = new Array<RGBA>();

        for (let i = 0; i < COLOR_CHOICE + NUMBER_OF_HISTORY_COLORS; i++) {
            temp = i < COLOR_CHOICE ? this.selectedColors : this.oldColors;
            temp.push({
              Dec: {Red:0,Green:0,Blue:0,Alpha:1},
              Hex:{Red:"0", Green:"0",Blue:"0"},
              inString:"rgba(0,0,0,1)"
            });
        }
        this.updateWithHex(ColorOrder.primaryColor,"ff","0","0");
        this.updateWithHex(ColorOrder.secondaryColor,"0","ff","0");
    }

    isHexColor(hexRed:string,hexGreen:string,hexBlue:string){
      return (hexRed.length===2) && (hexGreen.length===2)&&(hexBlue.length===2) && 
    }
    updateWithHex(colorOrder:ColorOrder,redCode:string,greenCode:string,blueCode:string){


    }
}
