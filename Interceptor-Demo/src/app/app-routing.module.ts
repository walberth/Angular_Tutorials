import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProtectedComponent } from './protected/protected.component';
import { PublicComponent } from './public/public.component';
import { AuthGuard } from './guard/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: PublicComponent
  },
  {
    path: 'protected',
    canActivate: [AuthGuard],
    component: ProtectedComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes/*, { enableTracing: true }*/)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
