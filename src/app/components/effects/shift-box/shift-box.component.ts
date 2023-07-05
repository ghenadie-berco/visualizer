// Angular
import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, NgZone } from '@angular/core';
// Enums
import { Direction } from '../../controls/shift-controls/shift.enums';
// WebGL
type ShaderProgram = WebGLProgram;
type Shader = WebGLShader;
type Buffer = WebGLBuffer;
// Constants
const CHANGE_INTERVAL: number = 1;

@Component({
  selector: 'app-shift-box',
  templateUrl: './shift-box.component.html',
  styleUrls: ['./shift-box.component.scss']
})
export class ShiftBoxComponent implements OnInit, OnChanges, OnDestroy {

  @Input() public isOn!: boolean;
  @Input() public direction!: Direction;
  @Input() public loopTime!: number;
  @Input() public background: string = 'green';
  @Input() public boxSize: number = 100;

  public width: number = 100;
  public height: number = 100;
  public topPos: number = 0;
  public leftPos: number = 0;

  private interval: any;
  private animationFrameId: number | null = null;
  private squareXPosition: number = 0.0;
  private gl: WebGLRenderingContext | null = null;
  private shaderProgram: ShaderProgram | null = null;
  private vertexBuffer: Buffer | null = null;

  constructor(private ngZone: NgZone) { }

  public ngOnInit(): void {
    this.resetInterval();

    this.ngZone.runOutsideAngular(() => {
      this.setupWebGL();
      this.animate();
    });
  }

  public async ngOnChanges(changes: SimpleChanges): Promise<void> {
    this.resetInterval();
    for (let key in changes) {
      switch (key) {
        case 'isOn':
          if (changes[key].currentValue) {
            await this.startAnimation(this.direction);
          }
          else {
            await this.resetInterval();
          }
          break;
        case 'speed':
          this.restart();
          break;
        case 'direction':
          await this.startAnimation(changes[key].currentValue);
          break;
      };
    }
  }

  public async ngOnDestroy(): Promise<void> {
    await this.resetInterval();
  }

  // WEB GL

  setupWebGL() {
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    this.gl = this.getWebGLContext(canvas);

    if (!this.gl) {
      alert('WebGL is not supported by your browser.');
      // Perform alternative rendering or show an error message
      return;
    }

    this.setViewport(this.gl, canvas.width, canvas.height);

    this.shaderProgram = this.createShaderProgram(this.gl);
    if (!this.shaderProgram) {
      return;
    }

    const positionAttributeLocation = this.getAttribLocation(this.gl, this.shaderProgram, 'position');
    if (positionAttributeLocation === -1) {
      return;
    }

    this.vertexBuffer = this.createAndBindBuffer(this.gl);
    if (!this.vertexBuffer) {
      return;
    }

    const vertices = this.getSquareVertices();
    this.setBufferData(this.gl, this.vertexBuffer, vertices);

    this.gl.enableVertexAttribArray(positionAttributeLocation);
    this.gl.vertexAttribPointer(positionAttributeLocation, 2, this.gl.FLOAT, false, 0, 0);

    this.clearCanvas(this.gl, 0.0, 0.0, 0.0, 1.0);
  }

  animate() {
    this.updateSquarePosition();
    this.render();

    this.ngZone.runOutsideAngular(() => {
      requestAnimationFrame(() => this.animate());
    });

    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    const canvasWidth = canvas.width / 300;
    const squareWidth = canvasWidth * 0.1; // 10% of canvas width
    if (this.squareXPosition >= canvasWidth + squareWidth) {
      this.squareXPosition = -squareWidth;
      // this.animate();
    }
  }

  updateSquarePosition() {
    const speed = 0.01; // Adjust the speed of the animation
    this.squareXPosition += speed;
  }

  render() {
    if (!this.gl || !this.shaderProgram || !this.vertexBuffer) {
      return;
    }

    this.gl.useProgram(this.shaderProgram);

    const positionAttributeLocation = this.getAttribLocation(this.gl, this.shaderProgram, 'position');

    const vertices = this.getTranslatedSquareVertices(this.squareXPosition);
    this.setBufferData(this.gl, this.vertexBuffer, vertices);

    this.clearCanvas(this.gl, 0.0, 0.0, 0.0, 1.0);

    this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
  }

  getWebGLContext(canvas: HTMLCanvasElement): WebGLRenderingContext | null {
    return canvas.getContext('webgl');
  }

  setViewport(gl: WebGLRenderingContext, width: number, height: number): void {
    gl.viewport(0, 0, width, height);
  }

  createShaderProgram(gl: WebGLRenderingContext): ShaderProgram | null {
    const vertexShaderSource = `
      attribute vec2 position;

      void main() {
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;

    const fragmentShaderSource = `
      precision mediump float;

      void main() {
        gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
      }
    `;

    const vertexShader = this.compileShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = this.compileShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

    if (!vertexShader || !fragmentShader) {
      return null;
    }

    const program = this.createProgram(gl, vertexShader, fragmentShader);
    if (!program) {
      return null;
    }

    return program;
  }

  getAttribLocation(gl: WebGLRenderingContext, program: ShaderProgram, name: string): number {
    return gl.getAttribLocation(program, name);
  }

  createAndBindBuffer(gl: WebGLRenderingContext): Buffer | null {
    const vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
      console.error('Failed to create buffer');
      return null;
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    return vertexBuffer;
  }

  setBufferData(gl: WebGLRenderingContext, buffer: Buffer, data: Float32Array): void {
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
  }

  clearCanvas(gl: WebGLRenderingContext, r: number, g: number, b: number, a: number): void {
    gl.clearColor(r, g, b, a);
    gl.clear(gl.COLOR_BUFFER_BIT);
  }

  compileShader(gl: WebGLRenderingContext, type: number, source: string): Shader | null {
    const shader = gl.createShader(type);
    if (!shader) {
      console.error('Failed to create shader');
      return null;
    }
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error('Shader compilation error:', gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }

    return shader;
  }

  createProgram(gl: WebGLRenderingContext, vertexShader: Shader, fragmentShader: Shader): ShaderProgram | null {
    const program = gl.createProgram();
    if (!program) {
      console.error('Failed to create shader program');
      return null;
    }
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Shader program linking error:', gl.getProgramInfoLog(program));
      gl.deleteProgram(program);
      return null;
    }

    return program;
  }

  getSquareVertices(): Float32Array {
    const squareWidth = 0.1;
    const squareHeight = 1.0;

    const halfWidth = squareWidth / 2;
    const halfHeight = squareHeight / 2;

    return new Float32Array([
      -halfWidth, halfHeight,
      -halfWidth, -halfHeight,
      halfWidth, halfHeight,
      halfWidth, -halfHeight
    ]);
  }

  getTranslatedSquareVertices(translation: number): Float32Array {
    const vertices = this.getSquareVertices();
    const translatedVertices = new Float32Array(vertices);

    for (let i = 0; i < translatedVertices.length; i += 2) {
      translatedVertices[i] += translation;
    }

    return translatedVertices;
  }



  // OLD CODE

  private async restart(): Promise<void> {
    await this.resetInterval();
    await this.startAnimation(this.direction);
  }

  private async resetInterval(): Promise<void> {
    return new Promise(resolve => {
      clearInterval(this.interval);
      this.interval = null;
      setTimeout(() => resolve());
    });
  }

  private async startAnimation(dir: Direction): Promise<void> {
    this.setBoxSize();
    switch (dir) {
      case Direction.LTR: await this.shiftLTR(); break;
      // case Direction.RTL: this.shiftRTL(); break;
      // case Direction.TTB: this.shiftTTB(); break;
      // case Direction.BTT: this.shiftBTT(); break;
    };
  }

  private setBoxSize(): void {
    switch (this.direction) {
      case Direction.LTR:
      case Direction.RTL:
        this.width = this.boxSize;
        this.height = 100;
        break;
      case Direction.BTT:
      case Direction.TTB:
        this.height = this.boxSize;
        this.width = 100;

    }
  }

  private async shiftLTR(): Promise<void> {
    // const start = 0 - this.width;
    // const end = 100;
    // const distance = end - start;
    // const stepSize = distance / this.loopTime;
    this.animate();
    // this.interval = setInterval(
    //   async () => await this.animate(),
    //   this.loopTime
    // );
  }

  private async shiftLeftPosition(current: number, end: number, stepSize: number): Promise<void> {
    return new Promise<void>(resolve => {
      setTimeout(
        async () => {
          current++;
          this.leftPos = current;
          if (current < end) return await this.shiftLeftPosition(current, end, stepSize);
          else resolve();
        },
        CHANGE_INTERVAL
      );
    });
  }

  // private shiftRTL(): void {
  //   let start = 100;
  //   this.interval = setInterval(
  //     () => {
  //       start--;
  //       // this.setTransformStyle(start, 0);
  //       if (start === -100) start = 100;
  //     },
  //     this.speed / 100
  //   );
  // }

  // private shiftTTB(): void {
  //   let start = 0;
  //   this.interval = setInterval(
  //     () => {
  //       start++;
  //       // this.setTransformStyle(0, start);
  //       if (start === 100) start = -100;
  //     },
  //     this.speed / 100
  //   );
  // }

  // private shiftBTT(): void {
  //   let start = 100;
  //   this.interval = setInterval(() => {
  //     start--;
  //     // this.setTransformStyle(0, start);
  //     if (start === -100) start = 100;
  //   }, this.speed / 100)
  // }

}
