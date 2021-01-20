import { Component, OnInit } from '@angular/core';

import { Hero } from '../hero';   // import the Hero interface
import { HEROES } from '../mock-heroes';

@Component({
  // The CSS element selector, 'app-heroes', matches the name of the HTML element that identifies this component
  // within a parent component's template.
  // Remember that app-heroes is the element selector for the HeroesComponent. So add an
  // <app-heroes> element to the AppComponent template file, just below the title.
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.css']
})
export class HeroesComponent implements OnInit {

  // implementation of type Hero interface
  heroDummy: Hero = {
    id: 1,
    name: 'Windstorm'
  };

  heroes = HEROES;



  constructor() { }

  // The ngOnInit() is a lifecycle hook. Angular calls ngOnInit() shortly after creating a component.
  // It's a good place to put initialization logic.
  ngOnInit(): void {
  }

}
