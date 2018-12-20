import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


const routes: Routes = [
    { path: '', loadChildren: 'src/app/_components/main/main.module#MainModule' },
    { path: '**', loadChildren: 'src/app/_components/page-not-found/page-not-found.module#PageNotFoundModule' }
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes)
    ],
    exports: [
        RouterModule
    ]
})

export class RoutingModule { }