import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { User, UserApiResponse } from '../../shared/interfaces/user.interface';
import { Observable, switchMap, throwError, timer } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersList {
  protected http: HttpClient = inject(HttpClient);
  getuserList(currentPage:number){
    return this.http.get<UserApiResponse>(`${environment.baseUrl}`
      ,{
      params: new HttpParams().set('page', currentPage)
  }
)
  }

  updateUser(user: User): Observable<any> {
    const updateUrl = `${environment.baseUrl}/${user.id}`;
    return this.http.put(updateUrl, user);
  }

  createUser(user: Partial<User>) {
     return this.http.post<User>(environment.baseUrl, user);
  }
}
