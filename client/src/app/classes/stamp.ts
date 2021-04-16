import { Drawable } from './drawable';
import { Vec2 } from './vec2';

export class Stamp extends Drawable {

    private angle :number;
    private positionCoord : Vec2;
    private srcImage :string;
    private scale : number;
    private color: string;

constructor (coord:Vec2, src :string, angle :number, scale :number, color: string){

    super();
    this.positionCoord=coord;
    this.srcImage=src;
    this.angle=angle;
    this.scale=scale;
    this.color = color;
}

draw (ctx: CanvasRenderingContext2D):void {
    ctx.save();

    ctx.translate(this.positionCoord.x,this.positionCoord.y);
    ctx.rotate (this.angle);
    ctx.scale(this.scale,this.scale);
    const image= new Image();
    console.log ('allo');
    image.src=this.srcImage;
    const path = new Path2D(this.srcImage);
    ctx.translate(-image.width/2,-image.height/2);
    ctx.strokeStyle = this.color;
    ctx.fillStyle = this.color;

    ctx.stroke(path);
    ctx.fill(path);
    // ctx.drawImage(image,0,0);

    ctx.restore();
}









}