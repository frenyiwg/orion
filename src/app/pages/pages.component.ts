import { Component, signal } from '@angular/core';

@Component({
  selector: 'pages-root',
  template: `<p>Hola Mundo {{ title() }}</p>`,
})
export class AppPages {
  protected readonly title = signal('orion');
}
