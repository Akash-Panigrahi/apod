import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HeroResolve } from './pages/hero/hero.resolve.service';
import { HeroComponent } from './pages/hero/hero.component';
import { ApodComponent } from './pages/apod/apod.component';
import { IfApodInStorageGuard } from './pages/apod/if-apod-in-storage.guard.service';

const routes: Routes = [
  {
    path: '',
    component: HeroComponent,
    resolve: {
      apod: HeroResolve
    }
  },
  {
    path: 'apod',
    component: ApodComponent,
    canActivate: [IfApodInStorageGuard],
    data: { title: 'Hero Component' }
  },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
  providers: [HeroResolve]
})
export class AppRoutingModule { }
