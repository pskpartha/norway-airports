import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { APP_LANGUAGES } from '../../../app.constants';
import { ILanguage } from '../../../models/language.model';

@Component({
  selector: 'app-language-switcher',
  templateUrl: './language-switcher.component.html',
  styleUrl: './language-switcher.component.scss',
})
export class LanguageSwitcherComponent implements OnInit {
  availableLanguages = APP_LANGUAGES;
  langFlagAssetUrl = './assets/icons/flags/';
  currentLang!: ILanguage;

  constructor(private translate: TranslateService) {}

  ngOnInit() {
    this.currentLang = this.availableLanguages.find(
      (item) => item.code === this.translate.currentLang
    )!;
  }

  switchLanguage(lang: ILanguage) {
    this.translate.use(lang.code);
    this.currentLang = lang;
  }
}
