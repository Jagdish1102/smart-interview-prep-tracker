import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { provideHttpClient } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';

bootstrapApplication(AppComponent, {
  providers: [
    provideAnimationsAsync(),
    provideRouter(routes),
    provideHttpClient(),
    importProvidersFrom(MatSnackBarModule)
  ]
}).catch(err => console.error(err));