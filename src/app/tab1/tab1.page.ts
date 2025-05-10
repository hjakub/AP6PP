import { Component, OnInit } from '@angular/core';
import { CourseService } from '../services/course.service';
import { Course } from '../services/interfaces/course';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: false,
})
export class Tab1Page implements OnInit {

  courses: Course[] = [];

  constructor(private courseService: CourseService) {}

  ngOnInit() {
    this.loadCourses();
  }

  loadCourses() {
    this.courseService.getAllCourses().subscribe({
      next: (data) => {
        this.courses = data;
      },
      error: (err) => {
        console.error('Failed to load courses', err);
      }
    });
  }

  reserve(coachId: number) {
    this.courseService.reserveCourse(coachId).subscribe({
      next: (res) => {
        console.log('Reservation successful', res);
        alert('Reservation successful!');
      },
      error: (err) => {
        console.error('Reservation failed', err);
        alert('Reservation failed!');
      }
    });
  }

  enroll(courseId: number) {
    this.courseService.reserveCourse(courseId).subscribe({
      next: (res) => {
        console.log('Enrollment successful', res);
        alert('Enrollment successful!');
      },
      error: (err) => {
        console.error('Enrollment failed', err);
        alert('Enrollment failed!');
      }
    });
  }

  showInfo() {

  }
}