import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-box',
  templateUrl: './box.component.html',
  styleUrls: ['./box.component.scss']
})
export class BoxComponent {

  @Input() public width: number = 100;
  @Input() public height: number = 100;
  @Input() public background: string = 'orange';
  @Input() public position: 'absolute' | 'relative' = 'absolute';
  @Input() public top: number = 0;
  @Input() public left: number = 0;


}

