import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: 'privacy', loadComponent: () => import('./components/privacy/privacy.component').then((m) => m.PrivacyComponent) },
    { path: 'dusd', loadComponent: () => import('./components/dusd/dusd.component').then((m) => m.DusdComponent) },

    { path: 'help', loadComponent: () => import('./components/help/help.component').then((m) => m.HelpComponent) },
    { path: 'faq', loadComponent: () => import('./components/help/faq.component').then((m) => m.FaqComponent) },
    { path: 'fee' , loadComponent: () => import('./components/help/fee.component').then((m) => m.FeeComponent) },
    { path: 'subscription', loadComponent: () => import('./components/subscription/subscription.component').then((m) => m.SubscriptionComponent) },
    { path: 'app', loadComponent: () => import('./components/app-intro/app-intro.component').then((m) => m.AppIntroComponent) },
    { path: 'download', loadComponent: () => import('./components/download/download.component').then((m) => m.DownloadComponent) },
    { path: 'support', loadComponent: () => import('./components/support/support.component').then((m) => m.SupportComponent) },
    { path: 'tickets', loadComponent: () => import('./components/support/ticket/ticket.component').then((m) => m.TicketComponent) },
    { path: 'ticket-add', loadComponent: () => import('./components/support/ticket-add/ticket-add.component').then((m) => m.TicketAddComponent) },
    { path: 'news', loadComponent: () => import('./components/news/news.component').then((m) => m.NewsComponent) },
    { path: 'announcements', loadComponent: () => import('./components/help/announcement/announcement-list/announcement-list.component').then((m) => m.AnnouncementListComponent) },
    { path: 'announcements/:lang', loadComponent: () => import('./components/help/announcement/announcement-list/announcement-list.component').then((m) => m.AnnouncementListComponent) },
    { path: 'manual', loadComponent: () => import('./components/manual/manual.component').then((m) => m.ManualComponent), children:
        [
            { path: 'home', loadComponent: () => import('./components/manual/manual.component').then((m) => m.ManualComponent) },
            { path: 'sc', loadComponent: () => import('./components/manual/sc/sc.component').then((m) => m.ScComponent) },
            { path: '', redirectTo: './home', pathMatch: 'full' }
        ]
     },
     { path: '', redirectTo: 'market/home', pathMatch: 'full' },
     { path: '**', loadComponent: () => import('./page-not-found.component').then((m) => m.PageNotFoundComponent) },
];
