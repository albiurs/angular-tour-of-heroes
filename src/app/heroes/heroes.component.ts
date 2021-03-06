import { Component, OnInit } from '@angular/core';

import { Hero } from '../hero';   // import the Hero interface
// import { HEROES } from '../mock-heroes';
import { HeroService } from '../hero.service';
import { MessageService } from '../message.service';

// @Component({})
// The CSS element selector, 'app-heroes', matches the name of the HTML element that identifies this component
// within a parent component's template.
// Remember that app-heroes is the element selector for the HeroesComponent. So add an
// <app-heroes> element to the AppComponent template file, just below the title.
@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.css']
})
export class HeroesComponent implements OnInit {

  // public heroes = HEROES;   // HEROES mock
  public heroes: Hero[] = [];  // access HEROES mock through the HeroService

  // implementation of single hero of type Hero interface
  // heroDummy: Hero = {
  //   id: 1,
  //   name: 'Windstorm'
  // };

  // cleaned up:
  // public selectedHero: Hero | undefined;

  /*
  Constructor(){}
  The parameter simultaneously defines a private heroService property and identifies it as a HeroService injection site.
  When Angular creates a HeroesComponent, the Dependency Injection system sets the heroService parameter to the singleton instance of
  HeroService.
   */
  public constructor(
    private heroService: HeroService,
  ) { }

  // The ngOnInit() is a lifecycle hook. Angular calls ngOnInit() shortly after creating a component.
  // It's a good place to put initialization logic.
  // init this.heroes right after constructing
  public ngOnInit(): void {
    this.getHeroes();
  }

  /*
  Observable.subscribe() is the critical difference.

  The previous version assigns an array of heroes to the component's heroes property. The assignment occurs synchronously, as if the
  server could return heroes instantly or the browser could freeze the UI while it waited for the server's response.

  That won't work when the HeroService is actually making requests of a remote server.

  The new version waits for the Observable to emit the array of heroes—which could happen now or several minutes from now. The subscribe()
  method passes the emitted array to the callback, which sets the component's heroes property.

  This asynchronous approach will work when the HeroService requests heroes from the server.
   */
  public getHeroes(): void {
    // this.heroes = this.heroService.getHeroes(); // get Heros mock array directly from the mock
    this.heroService.getHeroes().subscribe(heroes => this.heroes = heroes);
  }

  /*
  Method cleaned up
   */
  // public onSelect(hero: Hero): void {
  //   this.selectedHero = hero;
  //
  //   // add message each time a Hero is selected
  //   this.messageService.add(`HeroesComponent: Selected Hero id=${hero.id}`);
  // }


  /**
   * add()
   * In response to a click event, call the component's click handler, add(), and
   * then clear the input field so that it's ready for another name.
   *
   * When the given name is non-blank, the handler creates a Hero-like object from
   * the name (it's only missing the id) and passes it to the services addHero() method.
   *
   * When addHero() saves successfully, the subscribe() callback receives the new
   * hero and pushes it into to the heroes list for display.
   *
   * @param name  Name of the new Hero
   */
  public add(name: string): void {
    name = name.trim();
    if (!name) { return; }
    this.heroService.addHero({ name } as Hero)
      .subscribe(hero => {
        this.heroes.push(hero);
      });
  }


  /**
   * delete()
   *
   * Although the component delegates hero deletion to the HeroService, it remains responsible for updating its own list of heroes. The
   * component's delete() method immediately removes the hero-to-delete from that list, anticipating that the HeroService will succeed on
   * the server.
   *
   * There's really nothing for the component to do with the Observable returned by heroService.delete() but it must subscribe anyway.
   *
   * If you neglect to subscribe(), the service will not send the delete request to the server. As a rule, an Observable does nothing until
   * something subscribes.
   *
   * Confirm this for yourself by temporarily removing the subscribe(), clicking "Dashboard", then clicking "Heroes". You'll see the full
   * list of heroes again.
   *
   * @param hero  Hero object to be deleted
   */
  public delete(hero: Hero): void {
    this.heroes = this.heroes.filter(h => h !== hero);
    this.heroService.deleteHero(hero).subscribe();
  }

}
