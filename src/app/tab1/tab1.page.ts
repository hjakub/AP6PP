import { Component, OnInit } from '@angular/core';
import { CourseService } from '../services/course.service';
import { UserService } from '../services/user.service';
import { Course } from '../services/interfaces/course';
import { ToastController, Platform } from '@ionic/angular';
import { PaymentService } from '../services/payment.service';
import { SessionService } from '../services/session.service';


@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: false,
})
export class Tab1Page implements OnInit {
  courses: Course[] = [];
  enrollmentErrors: { [courseId: number]: string } = {};
  userBookings: { [courseId: number]: number } = {};
  balance: number = 0;
  roleId: number | null = null;

  constructor(private courseService: CourseService,
              private toastController: ToastController,
              private userService: UserService,
              private paymentService: PaymentService,
              private sessionService: SessionService,
  ) {}

  ngOnInit() {
    this.loadCourses();
    this.loadUserBookings();
    this.sessionService.balance$.subscribe(balance => {
      this.balance = balance;
    });
  }

  ionViewWillEnter() {
    this.enrollmentErrors = {};
    this.balance = this.sessionService.getBalance();
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

  loadUserData() {
    this.userService.getCurrentUser().subscribe({
      next: (user) => {
        this.roleId = user?.roleId ?? null;
      },
      error: (err) => {
        console.error('Failed to load user data:', err);
        this.roleId = null;
      }
    });
  }

  loadUserBookings() {
    this.courseService.getUserBookings().subscribe({
      next: (response) => {
        const bookings = response.data || [];
        this.userBookings = {};
        bookings.forEach((b: any) => {
          this.userBookings[b.serviceId] = b.id;
        });
      },
      error: (err) => {
        console.error('Failed to load user bookings', err);
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
    const course = this.courses.find(c => c.id === courseId);
    if (!course) return;
    const enrollmentCost = course.price; 
    if (this.balance < enrollmentCost) {
      this.presentToast('Insufficient balance to enroll in this course.', 'danger');
      return;
    }
    this.courseService.reserveCourse(courseId).subscribe({
      next: () => {
        course.currentCapacity += 1;
        this.balance -= enrollmentCost;
        this.sessionService.setBalance(this.balance);
        this.presentToast('Enrollment successful!', 'success');
        delete this.enrollmentErrors[courseId];
        this.loadUserBookings();
      },
      error: (err) => {
        const errorMessage = err?.error?.message || 'Enrollment failed';
        this.presentToast(errorMessage, 'danger');
        if (errorMessage === 'User already registered on this service') {
          this.enrollmentErrors[courseId] = 'You are already registered on this service';
        } else if (errorMessage === 'Service capacity is full') {
          this.enrollmentErrors[courseId] = 'Service capacity is full';
        } else if (errorMessage === 'Invalid JWT: UserId claim is missing.') {
          this.enrollmentErrors[courseId] = 'You must log in first to enroll';
        } else {
          this.enrollmentErrors[courseId] = 'Enrollment failed';
        }
      }
    });
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  cancelEnrollment(courseId: number) {
    const bookingId = this.userBookings[courseId];
    if (!bookingId) return;
    const course = this.courses.find(c => c.id === courseId);
    if (!course) return;
    const refundAmount = course.price;
    this.courseService.cancelBooking(bookingId).subscribe({
      next: () => {
        if (course) course.currentCapacity -= 1;
        this.balance += refundAmount;
        this.sessionService.setBalance(this.balance);
        this.presentToast('Booking cancelled successfully!', 'success');
        delete this.userBookings[courseId];
      },
      error: (err) => {
        const errorMessage = err?.error?.message || 'Failed to cancel booking';
        this.presentToast(errorMessage, 'danger');
      }
    });
  }

  clearUserBookings() {
    this.userBookings = {};
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
}