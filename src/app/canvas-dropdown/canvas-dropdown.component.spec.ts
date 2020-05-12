import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CanvasDropdownComponent } from './canvas-dropdown.component';

describe('CanvasDropdownComponent', () => {
  let component: CanvasDropdownComponent;
  let fixture: ComponentFixture<CanvasDropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CanvasDropdownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CanvasDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
