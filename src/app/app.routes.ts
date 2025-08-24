import { Routes } from '@angular/router';


export const routes: Routes = [
    {
        path:'users',
        children:[
            {
                path:'',
                loadComponent: () => import('./features/user-list/user-list').then(m => m.UserList),
            },
            {
                path:':user-id',
                loadComponent: () => import('./features/user-details/user-details').then(m => m.UserDetails),
            }
        ]
    },
    {
        path:'',
        redirectTo:"users",
        pathMatch:'full'
    }
    
];
