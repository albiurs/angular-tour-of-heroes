import { Component, OnInit } from '@angular/core';
import { Input } from '@angular/core';  // allow hero to get input data form the parent component's template
import {ActivatedRoute, ParamMap} from '@angular/router';
import { Location } from '@angular/common';

import { Hero } from '../hero';
import { HeroService } from '../hero.service';

@Component({
  selector: 'app-hero-detail',
  templateUrl: './hero-detail.component.html',
  styleUrls: ['./hero-detail.component.css']
})
export class HeroDetailComponent implements OnInit {

  // That's the only change you should make to the HeroDetailComponent class. There are no more properties. There's no presentation logic.
  // This component simply receives a hero object through its hero property and displays it.


  @Input()  // allow hero to get input data form the parent component's template
  public hero: Hero | undefined;

  private routeParams: ParamMap | undefined;
  private productIdFromRoute: number | undefined;

  constructor(
    private route: ActivatedRoute,
    private heroService: HeroService,
    private location: Location
  ) { }

  ngOnInit(): void {
    this.routeParams = this.route.snapshot.paramMap;
    this.productIdFromRoute = Number(this.routeParams.get('id'));
    this.getHero();
  }

  getHero(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    // this.heroService.getHero(id).subscribe((hero: Hero | undefined) => this.hero = hero);
    // !!!Workaround!!!!
    // @ts-ignore
    this.heroService.getHero(this.productIdFromRoute).subscribe(hero => this.hero = hero);
  }

}
