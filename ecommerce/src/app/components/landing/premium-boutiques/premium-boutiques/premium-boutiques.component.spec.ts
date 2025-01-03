import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PremiumBoutiquesComponent } from './premium-boutiques.component';

describe('PremiumBoutiquesComponent', () => {
  let component: PremiumBoutiquesComponent;
  let fixture: ComponentFixture<PremiumBoutiquesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PremiumBoutiquesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PremiumBoutiquesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
