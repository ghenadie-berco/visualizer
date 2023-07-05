import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Option } from './dropdown-list.interfaces';

@Component({
  selector: 'app-dropdown-list',
  templateUrl: './dropdown-list.component.html',
  styleUrls: ['./dropdown-list.component.scss']
})
export class DropdownListComponent {

  @Input() public label!: string;
  @Input() public options!: Option[];
  @Input() public value: number | null = null;
  
  @Output() public onValueChange = new EventEmitter<string>();

}
