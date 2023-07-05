import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Option } from '../dropdown-list/dropdown-list.interfaces';
import { Direction } from './shift.enums';

@Component({
  selector: 'app-shift-controls',
  templateUrl: './shift-controls.component.html',
  styleUrls: ['./shift-controls.component.scss']
})
export class ShiftControlsComponent implements OnInit {

  @Input() public isOn!: boolean;
  @Input() public direction!: Direction;
  @Input() public speed!: number;

  @Output() public onToggleOn = new EventEmitter<boolean>();
  @Output() public onDirectionChange = new EventEmitter<Direction>();
  @Output() public onSpeedChange = new EventEmitter<number>();

  public directionOptions: Option[];
  public selectedDirectionId: number | undefined = undefined;
  public speedOptions: Option[];
  public selectedSpeedId: number | undefined = undefined;

  constructor() {
    this.directionOptions = this.getDirectionOptions();
    this.speedOptions = this.getSpeedOptions();
  }

  public ngOnInit(): void {
    this.selectedDirectionId = this.getDirectionId(this.direction);
    this.selectedSpeedId = this.getSpeedId(this.speed);
  }

  public setDirection(optionId: string): void {
    const direction = this.getDirection(+optionId);
    this.onDirectionChange.emit(direction);
  }
  
  public setSpeed(optionId: string): void {
    const speed = this.getSpeed(+optionId);
    this.onSpeedChange.emit(speed);
  }

  private getDirectionOptions(): Option[] {
    return [
      { id: 1, value: 'Left to Right' },
      { id: 2, value: 'Right to Left' },
      { id: 3, value: 'Top to Bottom' },
      { id: 4, value: 'Bottom to Top' },
    ];
  }

  private getDirection(directionId: number): Direction {
    switch(directionId) {
      case 1: return Direction.LTR;
      case 2: return Direction.RTL;
      case 3: return Direction.TTB;
      case 4: return Direction.BTT;
      default: return Direction.LTR;
    };
  }

  private getDirectionId(direction: Direction): number {
    switch(direction) {
      case Direction.LTR: return 1;
      case Direction.RTL: return 2;
      case Direction.TTB: return 3;
      case Direction.BTT: return 4;
      default: return 1;
    };
  }

  private getSpeedOptions(): Option[] {
    return [
      { id: 1, value: '20ms' },
      { id: 2, value: '40ms' },
      { id: 3, value: '60ms' },
      { id: 4, value: '80ms' },
      { id: 5, value: '100ms' },
      { id: 6, value: '200ms' },
      { id: 7, value: '400ms' },
      { id: 8, value: '600ms' },
      { id: 9, value: '800ms' },
      { id: 10, value: '1000ms' },
    ];
  }

  private getSpeed(id: number): number {
    switch(id) {
      case 1: return 20;
      case 2: return 40;
      case 3: return 60;
      case 4: return 80;
      case 5: return 100;
      case 6: return 200;
      case 7: return 400;
      case 8: return 600;
      case 9: return 800;
      case 10: return 1000;
      default: return 100; 
    };
  }

  private getSpeedId(speed: number): number {
    switch(speed) {
      case 20: return 1;
      case 40: return 2;
      case 60: return 3;
      case 80: return 4;
      case 100: return 5;
      case 200: return 6;
      case 400: return 7;
      case 600: return 8;
      case 800: return 9;
      case 1000: return 10;
      default: return 1;
    };
  }

}
