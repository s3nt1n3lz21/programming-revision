import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RevisionCardComponent } from './revision-card.component';

describe('RevisionCardComponent', () => {
  let component: RevisionCardComponent;
  let fixture: ComponentFixture<RevisionCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RevisionCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RevisionCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
