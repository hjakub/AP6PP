import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Course } from './interfaces/course';

@Injectable({ providedIn: 'root' })
export class CourseService {
  private requestAllURL = 'http://<container-ip>:8080/api/services';
  private requestSingleURL = 'http://<container-ip>:8080/api/services/';

  constructor(private http: HttpClient) {}

  getAllCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(this.requestAllURL);
  }

  getOneCourse(id: any): Observable<Course> {
    const reqUrl = this.requestSingleURL + id.toString();
    return this.http.get<Course>(reqUrl);
  }

  reserveCourse(courseId: number) {
    return this.http.post('http://<container-ip>:8080/api/bookings', { serviceId: courseId, status: 'Confirmed' });
  }
}