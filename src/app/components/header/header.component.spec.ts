import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  TranslateModule,
  TranslateService,
  TranslateLoader,
  TranslateFakeLoader,
} from '@ngx-translate/core';
import { HeaderComponent } from './header.component';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let translate: TranslateService;
  let debugElement: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: TranslateFakeLoader },
        }),
      ],
      declarations: [HeaderComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    translate = TestBed.inject(TranslateService);

    // Set up translations
    translate.setTranslation('en', { 'HOME.LOGO_TITLE': 'Welcome' });
    translate.setTranslation('et', { 'HOME.LOGO_TITLE': 'Tere tulemast' });
    translate.use('en');

    debugElement = fixture.debugElement;
    fixture.detectChanges();
    fixture.detectChanges();
  });

  it('should display the correct English title', () => {
    const logoText = debugElement.query(By.css('.logo-text')).nativeElement;
    expect(logoText.textContent).toContain('Welcome');
  });

  it('should display the correct Estonian title when language is switched to Et', () => {
    translate.use('et');
    fixture.detectChanges();
    const logoText = debugElement.query(By.css('.logo-text')).nativeElement;
    expect(logoText.textContent).toContain('Tere tulemast');
  });
});
