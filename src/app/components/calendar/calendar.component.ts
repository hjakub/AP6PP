import { Component, OnInit } from '@angular/core';
import { CourseService } from 'src/app/services/course.service';
import { Course } from 'src/app/services/interfaces/course';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, IonicModule],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {
  today = new Date();
  month: number = this.today.getMonth();
  year: number = this.today.getFullYear();
  tomorrowDate: number = new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate() + 1).getDate();

  weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  daysWithPadding: (number | null)[] = [];

  eventsToday: { title: string, time: string, color: string }[] = [];
  eventsTomorrow: { title: string, time: string, color: string }[] = [];

  courses: Course[] = [];
  showMonthMenu: boolean = false;
  months: string[] = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];


  constructor(private courseService: CourseService, private router: Router) {}

  ngOnInit() {
    this.courseService.getAllCourses().subscribe(courses => {
      this.courses = courses;
      this.generateCalendar();
      this.buildStaticEvents();
      this.mergeCourseEvents();
    });
  }

  private buildStaticEvents() {
    const [todayEvents, tomorrowEvents] = this.getEvents();
    this.eventsToday    = todayEvents;
    this.eventsTomorrow = tomorrowEvents;
  } 

  private mergeCourseEvents() {
    const toDateString = (d:Date)=>d.toDateString();
    const todayStr     = toDateString(this.today);
    const tomorrow     = new Date(this.today);
    tomorrow.setDate(this.today.getDate()+1);
    const tomStr       = toDateString(tomorrow);

    const courseEvents = this.courses.map(c => {
      const d = new Date(c.start);
      return {
        dateStr: toDateString(d),
        day:     d.getDate(),
        month:   d.getMonth(),
        year:    d.getFullYear(),
        title:   c.serviceName,
        time:    d.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}),
        color:   'blue'
      };
    });

    this.eventsToday.push(
      ...courseEvents
        .filter(e => e.dateStr === todayStr)
        .map(e => ({ title: e.title, time: e.time, color: e.color }))
    );
    this.eventsTomorrow.push(
      ...courseEvents
        .filter(e => e.dateStr === tomStr)
        .map(e => ({ title: e.title, time: e.time, color: e.color }))
    );
  }

  toggleMonthMenu() {
    this.showMonthMenu = !this.showMonthMenu;
  }

  selectMonth(selectedMonth: number) {
    this.month = selectedMonth;
    this.showMonthMenu = false;
    this.generateCalendar();
  }

  getEvents() {
    const eventsToday = [
      { title: 'Ronnie Coleman', time: '08:00', color: 'green' },
      { title: 'KickBoxing', time: '09:00', color: 'red' },
      { title: 'Yoga', time: '10:00', color: 'orange' },
    ];
    const eventsTomorrow = [
      { title: 'Hobby Horsing', time: '13:00', color: 'seagreen' },
      { title: 'Chess', time: '14:00', color: 'purple' },
    ];
    return [eventsToday, eventsTomorrow];
  }

  generateCalendar() {
    const firstDay = new Date(this.year, this.month, 1);
    const lastDay = new Date(this.year, this.month + 1, 0);
    const daysInMonth = lastDay.getDate();

    const startDay = (firstDay.getDay() + 6) % 7; // Monday = 0
    const days: (number | null)[] = Array(startDay).fill(null);

    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    while (days.length % 7 !== 0) {
      days.push(null);
    }

    this.daysWithPadding = days;
  }

  changeMonth(offset: number) {
    this.month += offset;
    if (this.month > 11) {
      this.month = 0;
      this.year++;
    } else if (this.month < 0) {
      this.month = 11;
      this.year--;
    }
    this.generateCalendar();
  }

  getMonthName(): string {
    return new Date(this.year, this.month).toLocaleString('default', { month: 'long' });
  }

  isToday(day: number | null): boolean {
    if (day == null) return false;
    return (
      day === this.today.getDate() &&
      this.month === this.today.getMonth() &&
      this.year === this.today.getFullYear()
    );
  }

  public isCourseOnDay(course: Course, day: number|null): boolean {
    if (day == null) return false;
    const d = new Date(course.start);
    return (
      d.getDate() === day &&
      d.getMonth() === this.month &&
      d.getFullYear() === this.year
    );
  }

  reserve(courseId: number) {
    this.courseService.reserveCourse(courseId).subscribe({
      next: () => alert('Enrollment successful!'),
      error: () => alert('Enrollment failed')
    });
  }

  toMainPage() {
      this.router.navigate(['/tabs/tab1']);
  }
}