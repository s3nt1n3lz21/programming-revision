import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  navLinks: { path: string; label: string; }[];

  constructor(public router: Router) { 
    this.navLinks = [
      { path: 'revision', label: 'Revision' },
      { path: 'question-list', label: 'All Questions' },
      { path: 'add-question', label: 'Add Question' }
    ];
  }
}
