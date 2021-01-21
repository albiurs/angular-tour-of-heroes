import { Component, OnInit } from '@angular/core';
import { Input } from '@angular/core';  // allow hero to get input data form the parent component's template

import { Hero } from '../hero';

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

  constructor() { }

  ngOnInit(): void {
  }

}
