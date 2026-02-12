import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'body[root]',
  imports: [RouterOutlet],
  template: `<router-outlet />`,
})
export class App {}
