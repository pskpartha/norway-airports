import { Component } from '@angular/core';
import { APP_VERSION } from '../../app.constants';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent {
  appVersion = APP_VERSION;
}
