import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WordslearntPage } from './wordslearnt.page';

describe('WordslearntPage', () => {
  let component: WordslearntPage;
  let fixture: ComponentFixture<WordslearntPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(WordslearntPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
