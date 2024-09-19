import { ComponentFixture, TestBed } from '@angular/core/testing';
import { McqQuestionsPage } from './mcq-questions.page';

describe('McqQuestionsPage', () => {
  let component: McqQuestionsPage;
  let fixture: ComponentFixture<McqQuestionsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(McqQuestionsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
