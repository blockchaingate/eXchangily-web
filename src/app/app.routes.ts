import { Routes } from '@angular/router';

export const routes: Routes = [
    {path: '', redirectTo: 'home', pathMatch: 'full'},
    { path: '**', loadComponent: () => import('./page-not-found.component').then((m) => m.PageNotFoundComponent) },
];
