import { Component, ElementRef, ViewChild } from '@angular/core';
import { Option } from 'src/app/components/controls/dropdown-list/dropdown-list.interfaces';
import { Mode } from './main.enums';
import { MainStateService } from './main.state.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent {

  @ViewChild('mainView') public mainView!: ElementRef<HTMLElement>;
  public mode: Mode;
  public modeOptions: Option[];
  public selectedModeId: number;
  
  constructor(public state: MainStateService) { 
    this.modeOptions = this.getModeOptions();
    this.selectedModeId = 1;
    this.mode = this.getMode(this.selectedModeId);
  }

  public onModeChange(optionId: string): void {
    this.selectedModeId = +optionId;
    this.mode = this.getMode(this.selectedModeId);
  }

  public fullScreenEnabled(): boolean {
    return document.fullscreenEnabled;
  }

  public async toggleFullScreen(): Promise<void> {
    if (document.fullscreenElement) await document.exitFullscreen()
    else await this.mainView.nativeElement.requestFullscreen();
  }

  private getMode(optionId: number): Mode {
    switch(optionId) {
      case 1: return Mode.SHIFT;
      case 2: return Mode.STROBE;
      default: return Mode.SHIFT;
    };
  }

  private getModeOptions(): Option[] {
    return [
      { id: 1, value: 'Shift' },
      { id: 2, value: 'Strobe' },
    ];
  }
}
