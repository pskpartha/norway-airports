import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import {
  TranslateModule,
  TranslateLoader,
  TranslateFakeLoader,
} from '@ngx-translate/core';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { AppComponent } from './app.component';
import { By } from '@angular/platform-browser';
import { AirportListComponent } from './components/airport-list/airport-list.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { ActivatedRoute, Router, RouterModule, Routes } from '@angular/router';
import { Location } from '@angular/common';
import { ApiService } from './services/api.service'; // Assuming this is your service

const testRoutes: Routes = [
  { path: '', redirectTo: '/airports', pathMatch: 'full' },
  { path: 'airports', component: AirportListComponent },
  { path: '**', component: NotFoundComponent },
];

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let debugElement: DebugElement;
  let router: Router;
  let location: Location;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: TranslateFakeLoader },
        }),
        RouterModule.forRoot(testRoutes),
      ],
      declarations: [AppComponent, AirportListComponent, NotFoundComponent],
      providers: [
        {
          provide: ApiService,
          useValue: jasmine.createSpyObj('ApiService', ['getAirports']),
        }, // Mock ApiService
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
    router.initialNavigation();
    fixture.detectChanges();
  });

  describe('Component', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should include <app-airport-loc-map> component', () => {
      const element = debugElement.query(By.css('app-airport-loc-map'));
      expect(element).not.toBeNull();
    });
  });

  describe('Routing', () => {
    it('should redirect empty path to /airports', fakeAsync(() => {
      router.navigateByUrl('');
      tick();
      expect(location.path()).toBe('/airports');
    }));

    it('should navigate to not found page for unmatched routes', fakeAsync(() => {
      router.navigateByUrl('/random');
      tick();
      expect(location.path()).toBe('/random');
    }));
  });
});
