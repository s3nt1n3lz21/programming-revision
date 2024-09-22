import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionsLeftComponent } from './questions-left.component';

describe('QuestionsLeftComponent', () => {
  let component: QuestionsLeftComponent;
  let fixture: ComponentFixture<QuestionsLeftComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuestionsLeftComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuestionsLeftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
