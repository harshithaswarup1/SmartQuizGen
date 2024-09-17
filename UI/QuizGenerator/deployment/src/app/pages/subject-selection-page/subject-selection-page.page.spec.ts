import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SubjectSelectionPagePage } from './subject-selection-page.page';

describe('SubjectSelectionPagePage', () => {
  let component: SubjectSelectionPagePage;
  let fixture: ComponentFixture<SubjectSelectionPagePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SubjectSelectionPagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
