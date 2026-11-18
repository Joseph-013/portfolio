import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { captureInitialAnchor } from './app/shared/anchor';

// Take the `#id` out of the URL before anything renders; the Anchor service scrolls to it instead.
captureInitialAnchor();

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
