import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LanguageSwitcherComponent } from './language-switcher.component';
import { TranslateService } from '@ngx-translate/core';

describe('LanguageSwitcherComponent', () => {
  let component: LanguageSwitcherComponent;
  let fixture: ComponentFixture<LanguageSwitcherComponent>;
  let translateServiceMock: jasmine.SpyObj<TranslateService>;

  beforeEach(async () => {
    translateServiceMock = jasmine.createSpyObj('TranslateService', ['use']);
    translateServiceMock.currentLang = 'en';

    await TestBed.configureTestingModule({
      declarations: [LanguageSwitcherComponent],
      providers: [
        { provide: TranslateService, useValue: translateServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LanguageSwitcherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with the current language set by TranslateService', () => {
    expect(component.currentLang).toBeDefined();
    expect(component.currentLang.code).toEqual(
      translateServiceMock.currentLang
    );
  });

  it('should switch language when switchLanguage is called', () => {
    const testLanguage = { code: 'es', name: 'Spanish', icon: 'es.svg' };
    component.switchLanguage(testLanguage);

    expect(translateServiceMock.use).toHaveBeenCalledWith(testLanguage.code);
    expect(component.currentLang).toEqual(testLanguage);
  });
});
