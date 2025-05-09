import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Course } from './interfaces/course';
import { AuthService } from './auth.service'

@Injectable({ providedIn: 'root' })
export class CourseService {
  private requestAllURL = 'http://localhost:8080/api/services';
  private requestSingleURL = 'http://localhost:8080/api/services/';

  constructor(private http: HttpClient, private authService: AuthService) {}

  getAllCourses(): Observable<Course[]> {
    return this.http
      .get<{ data: Course[] }>(this.requestAllURL)
      .pipe(map(resp => resp.data));
  }

  getOneCourse(id: any): Observable<Course> {
    return this.http.get<Course>(`${this.requestSingleURL}${id}`);
  }

  reserveCourse(courseId: number) {
    const headers = this.authService.getAuthHeader();
  
    return this.http.post(
      '/api/bookings',
      {
        serviceId: courseId,
        status: 'Confirmed',
      },
      { headers }
    );
  }
}