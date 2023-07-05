import { Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-strobe-box',
  templateUrl: './strobe-box.component.html',
  styleUrls: ['./strobe-box.component.scss']
})
export class StrobeBoxComponent implements OnChanges, OnDestroy {

  @Input() public background: string = 'white';
  @Input() public rate: number = 100;
  @Input() public isOn = false;
  
  public visible = false;

  private interval: any;

  public ngOnChanges(): void {
    this.clearInterval();
    this.interval = setInterval(() => this.toggleVisibility(), this.rate);
  }

  public ngOnDestroy(): void {
    this.clearInterval();
  }
  
  private clearInterval(): void {
    clearInterval(this.interval);
  }

  private toggleVisibility(): void {
    this.visible = true;
    setTimeout(() => this.visible = false, this.rate / 2);
  }

}
