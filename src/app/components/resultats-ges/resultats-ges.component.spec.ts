import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultatsGESComponent } from './resultats-ges.component';

describe('ResultatsGESComponent', () => {
  let component: ResultatsGESComponent;
  let fixture: ComponentFixture<ResultatsGESComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResultatsGESComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResultatsGESComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
