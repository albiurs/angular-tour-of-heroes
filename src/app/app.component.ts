import { Component } from '@angular/core';

// You always import the Component symbol from the Angular core library and annotate the component class with @Component.
// @Component is a decorator function that specifies the Angular metadata for the component.
@Component({
  // selector: 'app-root': the component's CSS element selector
  // 'app-root', matches the name of the HTML element that identifies the app root template.
  selector: 'app-root',
  templateUrl: './app.component.html',  // the location of the component's template file
  styleUrls: ['./app.component.css']    // the location of the component's private CSS styles
})
export class AppComponent {
  public title = 'Tour of Heroes';
}
