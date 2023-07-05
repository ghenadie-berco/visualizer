import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-toggle',
  templateUrl: './toggle.component.html',
  styleUrls: ['./toggle.component.scss']
})
export class ToggleComponent {

  @Input() public isOn!: boolean;
  @Input() public label: string = '';

  @Output() public onToggle = new EventEmitter<boolean>();

}
