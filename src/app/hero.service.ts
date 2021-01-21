import { Injectable } from '@angular/core';
// getting data from the server with the RxJS of() function: https://rxjs.dev/
import { Observable, of } from 'rxjs';

import { Hero } from './hero';
import { HEROES } from './mock-heroes';
import { MessageService } from './message.service';

/**
 * @Injectable() services
 *
 * Notice that the new service imports the Angular Injectable symbol and annotates the class with the @Injectable() decorator. This marks
 * the class as one that participates in the dependency injection system. The HeroService class is going to provide an injectable service,
 * and it can also have its own injected dependencies.
 * The @Injectable() decorator accepts a metadata object for the service, the same way the @Component() decorator did for your component
 * classes.
 *
 * Get hero data
 *
 * The HeroService could get hero data from anywhere—a web service, local storage, or a mock data source.
 * Removing data access from components means you can change your mind about the implementation anytime, without touching any components.
 * They don't know how the service works.
 *
 * The implementation in this tutorial will continue to deliver mock heroes.
 */

/*
Provide the HeroService

You must make the HeroService available to the dependency injection system before Angular can inject it into the HeroesComponent by
registering a provider. A provider is something that can create or deliver a service; in this case, it instantiates the HeroService class to
provide the service.
To make sure that the HeroService can provide this service, register it with the injector, which is the object that is responsible for
choosing and injecting the provider where the app requires it.
By default, the Angular CLI command ng generate service registers a provider with the root injector for your service by including provider
metadata, that is providedIn: 'root' in the @Injectable() decorator.

@Injectable({
  providedIn: 'root',
})

When you provide the service at the root level, Angular creates a single, shared instance of HeroService and injects into any class that
asks for it. Registering the provider in the @Injectable metadata also allows Angular to optimize an app by removing the service if it turns
out not to be used after all.
 */
@Injectable({
  providedIn: 'root'
})
export class HeroService {

  constructor(
    /*
    This is a typical "service-in-service" scenario: you inject the MessageService into the HeroService
    which is injected into the HeroesComponent.
     */
    private messageService: MessageService
  ) { }

  // get HEROES directly from the mock
  // getHeroes(): Hero[] {
  //   return HEROES;
  // }
  getHeroes(): Observable<Hero[]> {
    // TODO: send the message _after_ fetching the heroes
    this.messageService.add('HeroService: fetched heroes');
    return of(HEROES);  // of(HEROES) returns an Observable<Hero[]> that emits a single value, the array of mock heroes.
  }
}
