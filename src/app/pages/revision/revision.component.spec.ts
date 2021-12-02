import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RevisionComponent } from './revision.component';

describe('RevisionComponent', () => {
  let component: RevisionComponent;
  let fixture: ComponentFixture<RevisionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RevisionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RevisionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
