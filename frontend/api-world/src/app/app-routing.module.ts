import { HeroResolve } from './hero/hero.resolve.service';
import { HeroComponent } from './hero/hero.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { HomeComponent } from './home/home.component';
import { ApodComponent } from './apod/apod.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      {
        path: '',
        component: HeroComponent,
        resolve: {
          apod: HeroResolve
        }
      },
      { path: 'apod', component: ApodComponent }
    ]
  },
  { path: '404', component: PageNotFoundComponent },
  { path: '**', redirectTo: '404', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
  providers: [HeroResolve]
})
export class AppRoutingModule { }
