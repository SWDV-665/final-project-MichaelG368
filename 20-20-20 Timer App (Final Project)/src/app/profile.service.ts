import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  profile_info: any = [];

  dataChanged$: Observable<boolean>;

  private dataChangeSubject: Subject<boolean>;

  baseURL = "http://profile-server-mgutierrez2.herokuapp.com";

  constructor(public http: HttpClient) {
    console.log("Hello Profile Service Provider");

    this.dataChangeSubject = new Subject<boolean>();
    this.dataChanged$ = this.dataChangeSubject.asObservable();
  }

 // Function for loading profile
  get_profile_info(): Observable<object[]>{
    return this.http.get(this.baseURL + '/api/profile').pipe(
      map(this.extractData),
      catchError(this.handleError)
    );
  }

  private extractData(res: Response) {
    let body = res;
    return (body || {}) as object[];
  }

  private handleError(error: Response | any) {
    let errMsg: string;
    if (error instanceof Response) {
      const err = error || '';
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Observable.throw(errMsg);
  }

  // Function for creating profile
  create_profile(profile){
    console.log("Creating profile - ", profile);
    this.http.post(this.baseURL + "/api/profile/", profile).subscribe(res => {
      this.profile_info = res;
      this.dataChangeSubject.next(true);
    });
  }

  // Function for editing profile
  edit_profile(profile, index){
    console.log("Editing profile - ", profile);
    this.http.put(this.baseURL + "/api/profile/" + profile._id, profile).subscribe(res => {
      this.profile_info[index] = res;
      this.dataChangeSubject.next(true);
    });
  }

 // Function for deleting profile 
  deleting_profile(profile){
    console.log("Deleting profile - ", profile);
    this.http.delete(this.baseURL + "/api/profile/" + profile._id).subscribe(res => {
      this.profile_info = res;
      this.dataChangeSubject.next(true);
    });
  }

}
