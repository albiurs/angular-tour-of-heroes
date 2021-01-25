import { NgModule } from '@angular/core';
// Notice that the CommonModule references and declarations array are unnecessary, so are no longer part of AppRoutingModule. The following
// sections explain the rest of the AppRoutingModule in more detail.
// import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router'; // import RouterModule and Routes so the app can have routing functionality

// HeroesComponent will give the Router somewhere to go once you configure the routes
import { HeroesComponent } from './heroes/heroes.component';


/*
configure your routes
Routes tell the Router which view to display when a user clicks a link or pastes a URL into the browser address bar.
Since app-routing.module.ts already imports HeroesComponent, you can use it in the routes array:
A typical Angular Route has two properties:
    - path: a string that matches the URL in the browser address bar.
    - component: the component that the router should create when navigating to this route.

 */
const routes: Routes = [
  { path: 'heroes', component: HeroesComponent }
];


/*
RouterModule.forRoot()
The @NgModule metadata initializes the router and starts it listening for browser location changes.
The following line adds the RouterModule to the AppRoutingModule imports array
and configures it with the routes in one step by calling RouterModule.forRoot().

Next, AppRoutingModule exports RouterModule so it will be available throughout the app.
 */
@NgModule({
  imports: [
    // CommonModule,
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
