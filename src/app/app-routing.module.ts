import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AutoLoginGuard } from './guards/auto-login.guard';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'lists',
    pathMatch: 'full',
  },
  {
    path: 'lists',
    loadChildren: () =>
      import('./pages/lists/lists.module').then((m) => m.ListsPageModule),
    canLoad: [AuthGuard]
  },
  {
    path: 'lists/:id',
    loadChildren: () =>
      import('./pages/list-items/list-items.module').then(
        (m) => m.ListItemsPageModule
      ),
      canLoad: [AuthGuard]
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule),
    canLoad: [AutoLoginGuard] // Check if we should show the introduction or forward to inside
  },
  {
    path: 'signup',
    loadChildren: () => import('./pages/signup/signup.module').then( m => m.SignupPageModule),
    canLoad: [AutoLoginGuard] // Check if we should show the introduction or forward to inside

  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
