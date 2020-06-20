import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DateUtilsService {
  static yyyyMMdd(date) {
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  }

  static getStartDate(currentDate: Date): Date {
    const monthDays = [31, , 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const date = currentDate.getDate();

    // if leap year
    monthDays[1] = year % 4 ? 28 : 29;

    const prevMonthDays = month ? monthDays[month - 1] : 31;
    const prevMonth = month ? month - 1 : 12;
    const prevYear = prevMonth === 12 ? year - 1 : year;
    const prevDate = prevMonthDays - 3 + date;

    return new Date(prevYear, prevMonth, prevDate);
  }
}
