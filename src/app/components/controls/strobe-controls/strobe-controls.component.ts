import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Option } from '../dropdown-list/dropdown-list.interfaces';

@Component({
  selector: 'app-strobe-controls',
  templateUrl: './strobe-controls.component.html',
  styleUrls: ['./strobe-controls.component.scss']
})
export class StrobeControlsComponent implements OnInit {

  @Input() public isOn!: boolean;
  @Input() public rate!: number;

  @Output() public onToggleOn = new EventEmitter<boolean>();
  @Output() public onRateChange = new EventEmitter<number>();

  public rateOptions: Option[];
  public selectedRateId: number | undefined = undefined;

  constructor() {
    this.rateOptions = this.getRateOptions();
  }

  public ngOnInit(): void {
    this.selectedRateId = this.getRateId(this.rate);
  }

  public setRate(optionId: string): void {
    const rate = this.getRate(+optionId);
    this.onRateChange.emit(rate);
  }

  private getRate(id: number): number {
    switch(id) {
      case 1: return 100;
      case 2: return 200;
      case 3: return 400;
      case 4: return 600;
      case 5: return 800;
      case 6: return 1000;
      default: return 100; 
    };
  }

  private getRateId(rate: number): number {
    switch(rate) {
      case 100: return 1;
      case 200: return 2;
      case 400: return 3;
      case 600: return 4;
      case 800: return 5;
      case 1000: return 6;
      default: return 1;
    };
  }

  private getRateOptions(): Option[] {
    return [
      { id: 1, value: '100ms' },
      { id: 2, value: '200ms' },
      { id: 3, value: '400ms' },
      { id: 4, value: '600ms' },
      { id: 5, value: '800ms' },
      { id: 6, value: '1000ms' },
    ];
  }

}
