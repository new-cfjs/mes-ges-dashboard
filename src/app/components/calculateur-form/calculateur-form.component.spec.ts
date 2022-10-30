import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalculateurFormComponent } from './calculateur-form.component';

describe('CalculateurFormComponent', () => {
  let component: CalculateurFormComponent;
  let fixture: ComponentFixture<CalculateurFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CalculateurFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalculateurFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
