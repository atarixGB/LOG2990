import { TestBed } from '@angular/core/testing';
import { Vec2 } from '@app/classes/vec2';
import { CanvasType, Emphasis, Font, TextAlign } from '@app/constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { TextService } from './text.service';


fdescribe('TextService', () => {
  let service: TextService;
  let drawingServiceSpy: jasmine.SpyObj<DrawingService>;
  
  const mouseEventClick = {
    x: 25,
    y: 25,
    button: 0,
} as MouseEvent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
          { provide: DrawingService, useValue: drawingServiceSpy },
      ]
    });
    service = TestBed.inject(TextService);
    drawingServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas']);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should write the first letter', () => {
      service.isWriting = true;
      service.cursorPosition = 0;
      const keyEvent = new KeyboardEvent('keyup', { key: 'a' });
      const spyAddCharacter = spyOn<any>(service, 'addCharacter').and.callThrough();
      const spyWriteCanvas = spyOn<any>(service,'writeOnCanvas' ).and.stub();
      
      service.handleKeyUp(keyEvent);

      expect(spyAddCharacter).toHaveBeenCalled();
      expect(service.cursorPosition).toBe(1);
      expect(spyWriteCanvas).toHaveBeenCalled();
  });

  it('should use backspace when keyup', () => {
    service.isWriting = true;
    service.textInput[0] = "abc";
    service.cursorPosition = 3;
    const keyEvent = new KeyboardEvent('keyup', { key: 'Backspace' });
    const spyWriteCanvas = spyOn<any>(service,'writeOnCanvas' ).and.stub();
   
    service.handleKeyUp(keyEvent);

    expect(service.textInput).toEqual(['ab']);
    expect(spyWriteCanvas).toHaveBeenCalled();
  });

  it('should use delete when keyup', () => {
    service.isWriting = true;
    service.textInput[0] = "abc";
    service.cursorPosition = 1;
    const keyEvent = new KeyboardEvent('keyup', { key: 'Delete' });
    const spyWriteCanvas = spyOn<any>(service,'writeOnCanvas' ).and.stub();
   
    service.handleKeyUp(keyEvent);

    expect(service.textInput).toEqual(['ab']);
    expect(spyWriteCanvas).toHaveBeenCalled();
  });

  it('should put arrow on left of letter using arrow left', () => {
    service.isWriting = true;
    service.textInput[0] = "abc";
    service.cursorPosition = 1;
    const keyEvent = new KeyboardEvent('keyup', { key: 'ArrowLeft' });
    const spyWriteCanvas = spyOn<any>(service,'writeOnCanvas' ).and.stub();
   
    service.handleKeyUp(keyEvent);

    expect(service.cursorPosition).toBe(0);
    expect(spyWriteCanvas).toHaveBeenCalled();
  });

  it('should put arrow on right of letter using arrow right', () => {
    service.isWriting = true;
    service.textInput[0] = "abc";
    service.cursorPosition = 1;
    const keyEvent = new KeyboardEvent('keyup', { key: 'ArrowRight' });
    const spyWriteCanvas = spyOn<any>(service,'writeOnCanvas' ).and.stub();
   
    service.handleKeyUp(keyEvent);

    expect(service.cursorPosition).toBe(2);
    expect(spyWriteCanvas).toHaveBeenCalled();
  });

  it('should put arrow on upper position when using arrow up', () => {
    service.isWriting = true;
    service.currentLine = 1;
    service.textInput[0] = "abc";
    service.textInput[1] = "def";
    service.currentLine = 1;
    service.cursorPosition = 0;
    const keyEvent = new KeyboardEvent('keyup', { key: 'ArrowUp' });
    const spyWriteCanvas = spyOn<any>(service,'writeOnCanvas' ).and.stub();
   
    service.handleKeyUp(keyEvent);

    expect(service.currentLine).toBe(0);
    expect(spyWriteCanvas).toHaveBeenCalled();
  });

  it('should put arrow on lower position when using arrow down', () => {
    service.isWriting = true;
    service.textInput[0] = "abc";
    service.textInput[1] = "def";
    service.currentLine = 0;
    service.cursorPosition = 0;
    service.totalLine = 2
    const keyEvent = new KeyboardEvent('keyup', { key: 'ArrowDown' });
    const spyWriteCanvas = spyOn<any>(service,'writeOnCanvas' ).and.stub();
   
    service.handleKeyUp(keyEvent);

    expect(service.currentLine).toBe(1);
    expect(spyWriteCanvas).toHaveBeenCalled();
  });

  it('should line break when enter', () => {
    service.isWriting = true;
    service.currentLine = 0;
    service.textInput[0] = "abc";
    service.cursorPosition = 0;
    service.totalLine = 1;
    const keyEvent = new KeyboardEvent('keyup', { key: 'Enter' });
    const spyWriteCanvas = spyOn<any>(service,'writeOnCanvas' ).and.stub();
   
    service.handleKeyUp(keyEvent);

    expect(service.currentLine).toBe(1);
    expect(service.totalLine).toBe(2);
    expect(spyWriteCanvas).toHaveBeenCalled();
  });

  it('should cancel line edition when escape pressed', () => {
    service.isWriting = true;
    service.currentLine = 0;
    service.textInput[0] = "abc";
    service.textInput[1] = "def";
    service.cursorPosition = 1;
    service.totalLine = 2;
    const keyEvent = new KeyboardEvent('keyup', { key: 'Escape' });
    const spyWriteCanvas = spyOn<any>(service,'writeOnCanvas' ).and.stub();
   
    service.handleKeyUp(keyEvent);

    expect(service.textInput).toEqual(['']);
    expect(service.cursorPosition).toBe(0);
    expect(service.isWriting).toBeFalsy;
    expect(spyWriteCanvas).toHaveBeenCalled();
  });

  it('should add character on middle of current input', () => {
    service.isWriting = true;
    service.currentLine = 0;
    service.textInput[0] = "ac";
    service.cursorPosition = 1;
    const keyEvent = new KeyboardEvent('keyup', { key: 'b' });
    const spyWriteCanvas = spyOn<any>(service,'writeOnCanvas' ).and.stub();
   
    service.handleKeyUp(keyEvent);

    expect(service.textInput).toEqual(['abc']);
    expect(service.cursorPosition).toBe(2);
    expect(spyWriteCanvas).toHaveBeenCalled();
  });

  it('should add character on middle of current input', () => {
    service.isWriting = true;
    service.currentLine = 0;
    service.textInput[0] = "ac";
    service.cursorPosition = 1;
    const keyEvent = new KeyboardEvent('keyup', { key: 'b' });
    const spyWriteCanvas = spyOn<any>(service,'writeOnCanvas' ).and.stub();
   
    service.handleKeyUp(keyEvent);

    expect(service.textInput).toEqual(['abc']);
    expect(service.cursorPosition).toBe(2);
    expect(spyWriteCanvas).toHaveBeenCalled();
  });

  it('should write text on mouseDown position', () => {
    const expectedResult: Vec2 = { x: 25, y: 25 };
    service.isWriting = false;
    service.currentLine = 0;
    service.textInput[0] = "ac";
    service.cursorPosition = 1;
    service.mouseDownCoord = expectedResult;
    const spyWriteCanvas = spyOn<any>(service,'writeOnCanvas' ).and.stub();
    spyOn<any>(service,'getPositionFromMouse' ).and.returnValue({x:25,y:25});

   
    service.onMouseDown(mouseEventClick);

    expect(service.textInput[0]).toEqual('|');
    expect(service.mouseDownCoord).toEqual(expectedResult);
    expect(spyWriteCanvas).toHaveBeenCalledWith(CanvasType.previewCtx);
  });

  it('should clear value when second clicked', () => {
    const expectedResult: Vec2 = { x: 25, y: 25 };
    service.isWriting = true;
    service.currentLine = 0;
    service.textInput[0] = "ac";
    service.cursorPosition = 1;
    service.mouseDownCoord = expectedResult;
    const spyWrite = spyOn<any>(service,'write' ).and.stub();

    service.onMouseDown(mouseEventClick);

    expect(spyWrite).toHaveBeenCalled();
    expect(service.textInput[0]).toEqual('');
    expect(service.currentLine).toBe(0);
    expect(service.totalLine).toBe(1);
    expect(service.isWriting).toBeFalsy;
  });

  it('should call write on canvas', () => {  
    service.textInput[0] = "ac";
    const spyWrite = spyOn<any>(service, 'writeOnCanvas' ).and.stub();
  
    service.write();

    expect(spyWrite).toHaveBeenCalledWith(CanvasType.baseCtx);
  });

  it('applyAlign should get the selected align and assign to current align', () => {
    service.selectAlign = TextAlign.Center;
    const alignSpy = spyOn(service.alignBinding, 'get').and.callThrough();
    service.changeAlign();
    expect(alignSpy).toHaveBeenCalled();
    expect(service.align).toEqual('center');
  });

  it('applyEmphasis should get the selected emphasis and assign to current emphasis', () => {
    service.selectEmphasis = Emphasis.Bold;
    const emphasisSpy = spyOn(service.emphasisBinding, 'get').and.callThrough();
    service.changeEmphasis();
    expect(emphasisSpy).toHaveBeenCalled();
    expect(service.emphasis).toEqual('bold');
  });

  it('applyFont should get the selected font and assign to current font', () => {
    service.selectFont = Font.Impact;
    const fontSpy = spyOn(service.fontBinding, 'get').and.callThrough();
    service.changeFont();
    expect(fontSpy).toHaveBeenCalled();
    expect(service.font).toEqual('Impact');
  });

  it('applyAlign should get the selected align and assign to current align', () => {
    service.selectAlign = TextAlign.Center;
    const alignSpy = spyOn(service.alignBinding, 'get').and.callThrough();
    service.changeAlign();
    expect(alignSpy).toHaveBeenCalled();
    expect(service.align).toEqual('center');
  });

  it('shoud write on baseCtx', () => {
    const ctx = CanvasType.baseCtx;
    
    service['writeOnCanvas'](ctx);

    expect(drawingServiceSpy.clearCanvas).toHaveBeenCalled();
    expect(drawingServiceSpy.baseCtx.fillText).toHaveBeenCalled();

  });

});
