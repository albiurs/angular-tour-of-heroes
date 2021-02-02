import { Component, OnInit } from '@angular/core';

import { Observable, Subject } from 'rxjs';
import {debounce, debounceTime, distinctUntilChanged, switchMap} from 'rxjs/operators';

import { Hero } from '../hero';
import { HeroService } from '../hero.service';

@Component({
  selector: 'app-hero-search',
  templateUrl: './hero-search.component.html',
  styleUrls: ['./hero-search.component.css']
})
export class HeroSearchComponent implements OnInit {

  // Notice the declaration of heroes$ as an Observable:
  public heroes$: Observable<Hero[]> | undefined;

  // The searchTerms RxJS subject:
  // A Subject is both a source of observable values and an Observable itself. You can subscribe to a Subject as you would any Observable.
  // You can also push values into that Observable by calling its next(value) method as the search() method does.
  private searchTerms = new Subject<string>();

  public constructor(
    private heroService: HeroService
  ) { }


  /**
   * search()
   *
   * this.searchTerms.next(term)
   * Push a search term into the observable stream.
   * A Subject is both a source of observable values and an Observable itself. You can subscribe to a Subject as you would any Observable.
   * You can also push values into that Observable by calling its next(value) method as the search() method does.
   * Every time the user types in the textbox, the binding calls search() with the textbox value, a "search term". The searchTerms becomes
   * an Observable emitting a steady stream of search terms.
   * @param term  search term
   */
  public search(term: string): void {
    this.searchTerms.next(term);
  }


  /**
   * ngOnInit()
   *
   * Chaining RxJS operators
   * Passing a new search term directly to the searchHeroes() after every user keystroke would create an excessive amount of HTTP requests,
   * taxing server resources and burning through data plans.
   *
   * Instead, the ngOnInit() method pipes the searchTerms observable through a sequence of RxJS operators that reduce the number of calls to
   * the searchHeroes(), ultimately returning an observable of timely hero search results (each a Hero[]).
   *
   * Each operator works as follows:
   * - debounceTime(300) waits until the flow of new string events pauses for 300 milliseconds before passing along the latest string.
   *   You'll never make requests more frequently than 300ms.
   * - distinctUntilChanged() ensures that a request is sent only if the filter text changed.
   * - switchMap() calls the search service for each search term that makes it through debounce() and distinctUntilChanged(). It cancels and
   *   discards previous search observables, returning only the latest search service observable.
   *
   * With the switchMap operator (https://www.learnrxjs.io/learn-rxjs/operators/transformation/switchmap), every qualifying key event can
   * trigger an HttpClient.get() method call. Even with a 300ms pause between requests, you could have multiple HTTP requests in flight and
   * they may not return in the order sent.
   *
   * switchMap() preserves the original request order while returning only the observable from the most recent HTTP method call. Results
   * from prior calls are canceled and discarded.
   *
   * Note that canceling a previous searchHeroes() Observable doesn't actually abort a pending HTTP request. Unwanted results are simply
   * discarded before they reach your application code.
   */
  public ngOnInit(): void {
    this.heroes$ = this.searchTerms.pipe(
      // wait 300ms after each keystroke before considering the term
      debounceTime(300),

      // ignore new term if same as previous term
      distinctUntilChanged(),

      // switch to new search observable each time the term changes
      switchMap((term: string) => this.heroService.searchHeroes(term))
    );
  }

}
