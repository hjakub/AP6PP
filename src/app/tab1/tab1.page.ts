import { Component, OnInit } from '@angular/core';
import { CourseService } from '../services/course.service';
import { Course } from '../services/interfaces/course';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: false,
})
export class Tab1Page implements OnInit {

  courses: Course[] = [];
  enrollmentErrors: { [courseId: number]: string } = {};

  constructor(private courseService: CourseService, private toastController: ToastController) {}

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
      this.presentToast('Enrollment successful!', 'success');
      delete this.enrollmentErrors[courseId];
    },
    error: (err) => {
      const errorMessage = err?.error?.message || 'Enrollment failed';
      console.error('Enrollment failed', err);

      this.presentToast(errorMessage, 'danger');

      if (errorMessage === 'User already registered on this service') {
        this.enrollmentErrors[courseId] = 'You are already registered on this service';
      } else if (errorMessage === 'Service capacity is full') {
        this.enrollmentErrors[courseId] = 'Service capacity is full';
      } else {
        this.enrollmentErrors[courseId] = 'Enrollment failed';
      }
    }
  });
}


async presentToast(message: string, color: 'success' | 'danger' | 'warning' = 'success') {
  const toast = await this.toastController.create({
    message,
    duration: 3000,
    color,
    position: 'top'
  });
  await toast.present();
}


  showInfo() {

  }
}