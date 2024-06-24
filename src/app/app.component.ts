import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { APP_LANGUAGES } from './app.constants';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'norway-airports';

  constructor(public translate: TranslateService) {
    const languageCodes = APP_LANGUAGES.map((lang) => lang.code);
    translate.addLangs(languageCodes);
    translate.setDefaultLang('en');
    const browserLang = translate.getBrowserLang();
    translate.use(
      browserLang && languageCodes.includes(browserLang) ? browserLang : 'en'
    );
  }
}
