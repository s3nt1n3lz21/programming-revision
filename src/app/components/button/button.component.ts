import { Component, Input } from '@angular/core';
import { IButton, emptyButton } from 'src/app/model/IButton';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent {

  constructor() { }

  @Input() button: IButton = emptyButton();
  @Input() click: Function = () => {};
}