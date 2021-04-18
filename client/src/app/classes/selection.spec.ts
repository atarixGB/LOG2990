import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from './canvas-test-helper';
import{SelectionTool} from '@app/classes/selection';
import { Vec2 } from './vec2';

//tslint:disable
fdescribe('Selection', () => {
    let canvasTestHelper:CanvasTestHelper;
    beforeEach(()=>{
        canvasTestHelper=TestBed.inject(CanvasTestHelper);

    });
    it('should create', () => {
        expect(new SelectionTool({} as Vec2,{} as Vec2, 2, 2,)).toBeTruthy();
    });

    it('draw should call clearUnderneathShape',()=>{
        const ctx = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        const selection= new SelectionTool({} as Vec2,{} as Vec2, 2, 2,);
        selection.isEllipse=false;
        selection.isLasso=false;
        selection.image=new ImageData(100,100);
        selection.clearImageDataPolygon=new ImageData(100,100);
        selection.initialOrigin={x:1,y:1};
        selection.polygonCoords=[{x:1,y:1},{x:2,y:2}];
        const spy =spyOn<any>(selection,'clearUnderneathShape').and.stub();
        selection.draw(ctx);
        expect(spy).toHaveBeenCalled();
    });

    it('draw should call printEllipse if isEllipse is true',()=>{
        const ctx = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        const selection= new SelectionTool({} as Vec2,{} as Vec2, 2, 2,);
        selection.isEllipse=true;
        selection.isLasso=false;
        selection.image=new ImageData(100,100);
        selection.clearImageDataPolygon=new ImageData(100,100);
        selection.initialOrigin={x:1,y:1};
        selection.polygonCoords=[{x:1,y:1},{x:2,y:2}];

        const spy= spyOn<any>(selection,'printEllipse');
        selection.draw(ctx);
        expect(spy).toHaveBeenCalled;
    });

    it('draw should call printPolygon if isLasso is true',()=>{
        const ctx = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        const selection= new SelectionTool({} as Vec2,{} as Vec2, 2, 2,);
        selection.isLasso=true;
        selection.isEllipse=false;
        selection.image=new ImageData(100,100);
        selection.clearImageDataPolygon=new ImageData(100,100);
        selection.initialOrigin={x:1,y:1};
        selection.polygonCoords=[{x:1,y:1},{x:2,y:2}];
        const spy= spyOn<any>(selection,'printPolygon');
        selection.draw(ctx);
        expect(spy).toHaveBeenCalled;
    });

    it('draw should call putImagedata if isLasso and isEllipse are false',()=>{
        const ctx = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        
        const selection= new SelectionTool({x:2,y:2} as Vec2,{x:4,y:4} as Vec2, 2, 2,);
        selection.isLasso=false;
        selection.isEllipse=false;
        selection.image=new ImageData(100,100);
        selection.clearImageDataPolygon=new ImageData(100,100);
        selection.initialOrigin={x:1,y:1};
        selection.polygonCoords=[{x:1,y:1},{x:2,y:2}];

        const putImageDataSpy= spyOn<any>(ctx,'putImageData').and.stub();
        spyOn<any>(selection,'clearUnderneathShape').and.stub();
        selection.draw(ctx);
        expect(putImageDataSpy).toHaveBeenCalled();

    });
});
