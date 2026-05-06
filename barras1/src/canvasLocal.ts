export class CanvasLocal {
  protected graphics: CanvasRenderingContext2D;
  protected rWidth: number;
  protected rHeight: number;
  protected maxX: number;
  protected maxY: number;
  protected pixelSize: number;
  protected centerX: number;
  protected centerY: number;

  public constructor(g: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
    this.graphics = g;
    this.rWidth = 12;
    this.rHeight = 8;
    this.maxX = canvas.width - 1;
    this.maxY = canvas.height - 1;
    this.pixelSize = Math.max(this.rWidth / this.maxX, this.rHeight / this.maxY);
    this.centerX = this.maxX / 12;
    this.centerY = (this.maxY / 8) * 7;
  }

  iX(x: number): number { return Math.round(this.centerX + x / this.pixelSize); }
  iY(y: number): number { return Math.round(this.centerY - y / this.pixelSize); }

  drawLine(x1: number, y1: number, x2: number, y2: number) {
    this.graphics.beginPath();
    this.graphics.moveTo(x1, y1);
    this.graphics.lineTo(x2, y2);
    this.graphics.stroke();
  }

  // Método unificado para barras horizontales 3D
  drawBarra3dHorizontal(x: number, y: number, largo: number, grosor: number, color: string) {
    const prof = 0.3; // Profundidad 3D
    const altP = 0.25;

    this.graphics.fillStyle = color;
    this.graphics.beginPath();
    // Cara frontal
    this.graphics.moveTo(this.iX(x), this.iY(y));
    this.graphics.lineTo(this.iX(x + largo), this.iY(y));
    this.graphics.lineTo(this.iX(x + largo), this.iY(y + grosor));
    this.graphics.lineTo(this.iX(x), this.iY(y + grosor));
    this.graphics.closePath();
    this.graphics.fill();
    this.graphics.stroke();

    // Cara de profundidad (lado derecho y superior)
    this.graphics.beginPath();
    this.graphics.moveTo(this.iX(x + largo), this.iY(y));
    this.graphics.lineTo(this.iX(x + largo + prof), this.iY(y + altP));
    this.graphics.lineTo(this.iX(x + largo + prof), this.iY(y + grosor + altP));
    this.graphics.lineTo(this.iX(x + largo), this.iY(y + grosor));
    this.graphics.closePath();
    this.graphics.fill();
    this.graphics.stroke();
  }

  maxH(h: number[]): number {
    let max = Math.max(...h);
    let pot = 10;
    while (pot < max) pot *= 10;
    pot /= 10;
    return Math.ceil(max / pot) * pot;
  }

  paint() {
    let h: number[] = [27, 10, 16, 90, 50, 75, 101, 13, 24, 80];
    let maxEsc = this.maxH(h);
    let colors: string[] = ['magenta', 'red', 'green', 'yellow', 'blue'];

    this.graphics.clearRect(0, 0, this.maxX + 1, this.maxY + 1);
    
    // Ejes
    this.graphics.strokeStyle = 'black';
    this.drawLine(this.iX(0), this.iY(0), this.iX(10), this.iY(0));
    this.drawLine(this.iX(0), this.iY(0), this.iX(0), this.iY(7));

    // Dibujo de barras
    let avanceY = 0.6;
    for (let i = 0; i < h.length; i++) {
      let largo = (h[i] / maxEsc) * 8;
      let yPos = 0.5 + i * avanceY;
      
      this.drawBarra3dHorizontal(0, yPos, largo, 0.4, colors[i % colors.length]);
      
      this.graphics.strokeText(`It ${i + 1}`, this.iX(-1.5), this.iY(yPos + 0.2));
      this.graphics.strokeText(h[i].toString(), this.iX(largo + 0.5), this.iY(yPos + 0.2));
    }
  }
}