import { Injectable } from "@angular/core";
import { Direction } from "src/app/components/controls/shift-controls/shift.enums";

export const DEFAULTS = {
  
  strobeIsOn: false,
  strobeRate: 100,

  shiftIsOn: false,
  shiftDir: Direction.LTR,
  shiftSpeed: 1000,
  shiftBoxSize: 100,
}

@Injectable({
  providedIn: 'root'
})
export class MainStateService {

  public strobeIsOn: boolean = DEFAULTS.strobeIsOn;
  public strobeRate: number = DEFAULTS.strobeRate;

  public shiftIsOn: boolean = DEFAULTS.shiftIsOn;
  public shiftDir: Direction = DEFAULTS.shiftDir;
  public shiftSpeed: number = DEFAULTS.shiftSpeed;
  public shiftBoxSize: number = DEFAULTS.shiftBoxSize;


}