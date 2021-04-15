import { Vec2 } from './../../classes/vec2';
import { TestBed } from '@angular/core/testing';

import { MagnetismService } from './magnetism.service';

describe('MagnetismService', () => {
    let service: MagnetismService;
    let topLeftPoint:Vec2;
    let width:number;
    let height:number;


    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(MagnetismService);
        topLeftPoint={x:10,y:10};
        width=10;
        height=10;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('activateMagnetism case TopMiddle ',()=>{

    });

    it('activateMagnetism case RightMiddle ',()=>{

    });

    it('activateMagnetism case LeftMiddle',()=>{

    });

    it('activateMagnetism case BottomMiddle  ',()=>{

    });

    it('activateMagnetism case Center ',()=>{

    });

    it('activateMagnetism case TopRight ',()=>{

    });

    it('activateMagnetism case TopLeft ',()=>{

    });

    it('activateMagnetism case BottomRight ',()=>{

    });
    
    it('activateMagnetism case BottomLeft ',()=>{

    });
});
