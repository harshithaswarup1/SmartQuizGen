import { ComponentFixture, TestBed } from '@angular/core/testing';
import { QuiztypeselectionPage } from './quiztypeselection.page';

describe('QuiztypeselectionPage', () => {
  let component: QuiztypeselectionPage;
  let fixture: ComponentFixture<QuiztypeselectionPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(QuiztypeselectionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
