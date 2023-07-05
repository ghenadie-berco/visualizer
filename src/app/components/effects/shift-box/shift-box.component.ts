import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Direction } from '../../controls/shift-controls/shift.enums';
import { Sequence } from './shift-box.interfaces';

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

  public ngOnInit(): void {
    this.resetInterval();
    console.log('init', this.interval);
  }
  
  public async ngOnChanges(changes: SimpleChanges): Promise<void> {
    this.resetInterval();
    console.log('change', this.interval);
    for (let key in changes) {
      switch (key) {
        case 'isOn':
          if (changes[key].currentValue) await this.startAnimation(this.direction);
          else await this.resetInterval();
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
    const start = 0 - this.width;
    const end = 100;
    const distance = end - start;
    const stepSize = distance / this.loopTime;
    this.interval = setInterval(
      async () => await this.shiftLeftPosition(start, end, stepSize),
      this.loopTime
    );
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
