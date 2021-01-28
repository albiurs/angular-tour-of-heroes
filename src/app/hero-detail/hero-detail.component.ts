import { Component, OnInit } from '@angular/core';
// import { Input } from '@angular/core';  // allow hero to get input data form the parent component's template
import {ActivatedRoute, ParamMap} from '@angular/router';
import { Location } from '@angular/common';

import { Hero } from '../hero';
import { HeroService } from '../hero.service';

// That's the only change you should make to the HeroDetailComponent class. There are no more properties. There's no presentation logic.
// This component simply receives a hero object through its hero property and displays it.
@Component({
  selector: 'app-hero-detail',
  templateUrl: './hero-detail.component.html',
  styleUrls: ['./hero-detail.component.css']
})
export class HeroDetailComponent implements OnInit {

  // @Input()  // allow hero to get input data form the parent component's template
  public hero: Hero | undefined;

  constructor(
    private route: ActivatedRoute,
    private heroService: HeroService,
    private location: Location
  ) { }

  ngOnInit(): void {
    this.getHero();
  }

  getHero(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    // !!!Workaround!!!!
    // @ts-ignore
    this.heroService.getHero(id).subscribe(hero => this.hero = hero);
  }

  goBack(): void {
    this.location.back();
  }

  /**
   * save()
   * save() method, which persists hero name changes using the hero service
   * updateHero() method and then navigates back to the previous view.
   */
  save(): void {
    this.heroService.updateHero(this.hero)
      .subscribe(() => this.goBack());
  }
}
