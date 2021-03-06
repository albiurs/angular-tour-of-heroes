import { Injectable } from '@angular/core';
/*
RxJS - Reactive Extensions for JavaScript
getting data from the server with the RxJS of() function: https://rxjs.dev/
 */
import { Observable, of } from 'rxjs';
/*
Error handling

Things go wrong, especially when you're getting data from a remote server. The HeroService.getHeroes() method should catch errors and do
something appropriate.

To catch errors, you "pipe" the observable result from http.get() through an RxJS catchError() operator.

Import the catchError symbol from rxjs/operators, along with some other operators you'll need later.
 */
import { catchError, map, tap } from 'rxjs/operators';

/*
HttpClient
----------
HttpClient methods return one value

All HttpClient methods return an RxJS Observable of something.

HTTP is a request/response protocol. You make a request, it returns a single response.

In general, an observable can return multiple values over time. An observable from HttpClient always emits a single value and then
completes, never to emit again.

This particular HttpClient.get() call returns an Observable<Hero[]>; that is, "an observable of hero arrays". In practice, it will only
return a single hero array.
HttpClient.get() returns response data

HttpClient.get() returns the body of the response as an untyped JSON object by default. Applying the optional type specifier, <Hero[]> ,
adds TypeScript capabilities, which reduce errors during compile time.

The server's data API determines the shape of the JSON data. The Tour of Heroes data API returns the hero data as an array.

Other APIs may bury the data that you want within an object. You might have to dig that data out by processing the Observable result with
the RxJS map() operator.

Although not discussed here, there's an example of map() in the getHeroNo404() method included in the sample source code.

 */
import { HttpClient, HttpHeaders } from '@angular/common/http';

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

  private heroesUrl = 'api/heroes';  // URL to web api

  /*
  The heroes web API expects a special header in HTTP save requests.
  That header is in the httpOptions constant defined in the HeroService.
   */
  httpOptions = {
    headers: new HttpHeaders(
      {'Content-Type': 'application/json'}
    )
  };

  /*
  messageService
  This is a typical "service-in-service" scenario: you inject the MessageService into the HeroService
  which is injected into the HeroesComponent.
  */
  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) { }

  // get HEROES directly from the mock
  // getHeroes(): Hero[] {
  //   return HEROES;
  // }


  /**
   * getHeroes()
   * GET heroes from the server
   */
  /*
  .pipe
  Now extend the observable result with the pipe() method and give it a catchError() operator.

  tap()
  Tap into the Observable:
  The HeroService methods will tap into the flow of observable values and send a message, via the log() method, to the message area at the
  bottom of the page.
  They'll do that with the RxJS tap() operator, which looks at the observable values, does something with those values, and passes them
  along. The tap() call back doesn't touch the values themselves.
  Here is the final version of getHeroes() with the tap() that logs the operation.

  catchError()
  The catchError() operator intercepts an Observable that failed. The operator then passes the error to the error handling function.
   */
  getHeroes(): Observable<Hero[]> {
    // direct log to messageService
    // this.messageService.add('HeroService: fetched heroes');

    // get heroes form the mock
    // return of(HEROES);  // of(HEROES) returns an Observable<Hero[]> that emits a single value, the array of mock heroes.

    // GET heroes from the server
    return this.http.get<Hero[]>(this.heroesUrl)
      .pipe(
        tap(_ => this.log('fetched heroes')),
        catchError(this.handleError<Hero[]>('getHeroes()', []))
      );
  }

  /**
   * getHero()
   * GET hero by id. Will 404 if id not found
   * @param id  id of the Hero object
   */
  /*
  Get hero by id

  Most web APIs support a get by id request in the form :baseURL/:id.

  Here, the base URL is the heroesURL defined in the Heroes and HTTP section (api/heroes) and id is the number of the hero that you want to
  retrieve. For example, api/heroes/11.

  Update the HeroService getHero() method with the following to make that request:
   */
  getHero(id: number): Observable<Hero> {
    // this.log(`fetched hero id=${id}`);

    // const hero: Hero | undefined = HEROES.find(el => el.id === id);
    // return of(hero);

    // get the Hero from the mock
    // !!!Workaround!!!
    // @ts-ignore
    // return of(HEROES.find(hero => hero.id === id));

    // get the Hero from the API
    const url = `${this.heroesUrl}/${id}`;
    return this.http.get<Hero>(url).pipe(
      tap(_ => this.log(`fetched hero id=${id}`)),
      catchError(this.handleError<Hero>(`getHero(id=${id})`))
    );
  }


  // == save methods ==
  /**
   * addHero()
   *
   * POST: add a new hero to the server
   *
   * addHero() differs from updateHero() in two ways:
   *
   * It calls HttpClient.post() instead of put().
   * It expects the server to generate an id for the new hero, which it returns
   * in the Observable<Hero> to the caller.
   *
   * @param hero  New Hero object to be added to the Heroes list.
   */
  public addHero(hero: Hero): Observable<Hero> {
    return this.http.post<Hero>(this.heroesUrl, hero, this.httpOptions).pipe(
      tap((newHero: Hero) => this.log(`added hero \w id=${hero.id}`)),
      catchError(this.handleError('addHero()'))
    );
  }


  /**
   * updateHero()
   * Uses http.put() to persist the changed hero on the server.
   *
   * The HttpClient.put() method takes three parameters:
   * - the URL
   * - the data to update (the modified hero in this case)
   * - options
   *
   * The URL is unchanged. The heroes web API knows which hero to update by looking at the hero's id.
   *
   * The heroes web API expects a special header in HTTP save requests.
   * That header is in the httpOptions constant defined in the HeroService.
   *
   * @param hero  Hero object
   */
  public updateHero(hero: Hero): Observable<object> {
    return this.http.put(this.heroesUrl, hero, this.httpOptions).pipe(
      tap(_ => this.log(`updated Hero id=${hero.id}`)),
      catchError(this.handleError('updateHero(hero: Hero)'))
    );
  }


  /**
   * deleteHero()
   *
   * DELETE: delete the hero from the server
   *
   * Note the following key points:
   * - deleteHero() calls HttpClient.delete().
   * - The URL is the heroes resource URL plus the id of the hero to delete.
   * - You don't send data as you did with put() and post().
   * - You still send the httpOptions.
   */
  public deleteHero(hero: Hero | number): Observable<Hero> {
    const id = typeof hero === 'number' ? hero : hero.id;
    const url = `${this.heroesUrl}/${id}`;

    return this.http.delete<Hero>(url, this.httpOptions).pipe(
      tap(_ => this.log(`deleted Hero id=${id}`)),
      catchError(this.handleError<Hero>('deleteHero(hero: Hero | number)'))
    );
  }


  /**
   * searchHeroes()
   *
   *  GET heroes whose name contains search term
   *
   *  The method returns immediately with an empty array if there is no search term. The rest of it closely resembles getHeroes(), the only
   *  significant difference being the URL, which includes a query string with the search term.
   */
  public searchHeroes(term: string): Observable<Hero[]> {
    if (!term.trim()) {
      // if not search term, return empty hero array.
      return of([]);
    }
    return this.http.get<Hero[]>(`${this.heroesUrl}/?name=${term}`).pipe(
      tap(x => x.length ?
        this.log(`found heroes matching "${term}"`) :
        this.log(`no heroes matching "${term}"`)),
      catchError(this.handleError<Hero[]>('searchHeroes', []))
    );
  }



  /**
   * handleError<T>()
   *
   * Handle Http operation that failed.
   * Let the app continue.
   *
   * After reporting the error to the console, the handler constructs a user friendly message and returns a safe value to the app so the
   * app can keep working.
   *
   * Because each service method returns a different kind of Observable result, handleError() takes a type parameter so it can return the
   * safe value as the type that the app expects.
   *
   * The following handleError() method reports the error and then returns an innocuous result so that the application keeps working.
   *
   * The following handleError() will be shared by many HeroService methods so it's generalized to meet their different needs.
   *
   * Instead of handling the error directly, it returns an error handler function to catchError that it has configured with both the name
   * of the operation that failed and a safe return value.
   *
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T): any {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /** Log a HeroService message with the MessageService */
  private log(message: string): void {
    this.messageService.add(`HeroService: ${message}`);
  }
}
