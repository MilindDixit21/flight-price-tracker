import { Injectable } from '@angular/core';
import { environment } from '../../../environment/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private baseUrl = environment.apiBase;

  constructor( private http:HttpClient) { }

  // simple test call
  testConnection():Observable<any>{
    return this.http.get<any>(`${this.baseUrl}/flights/test`);
  }
}
