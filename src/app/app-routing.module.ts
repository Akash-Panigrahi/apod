import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { HomeComponent } from "./pages/home/home.component";
import { ApodComponent } from "./pages/apod/apod.component";
import { IfApodInStorageGuard } from "./guards/if-apod-in-storage.guard";

const routes: Routes = [
  {
    path: "",
    component: HomeComponent,
  },
  {
    path: "apod",
    component: ApodComponent,
    canActivate: [IfApodInStorageGuard],
    data: { title: "Home Component" },
  },
  { path: "**", redirectTo: "", pathMatch: "full" },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
