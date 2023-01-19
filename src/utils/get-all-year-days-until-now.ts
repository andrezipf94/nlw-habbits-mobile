import dayjs from 'dayjs';

export function getAllYearDaysUntilNow() {
    const firstDayOfTheYear = dayjs().startOf('year');
    const today = new Date();
    const days = [];

    let currentComparingDate = firstDayOfTheYear;
    while(currentComparingDate.isBefore(today)) {
        days.push(currentComparingDate.toDate());
        currentComparingDate = currentComparingDate.add(1, 'day');
    }
    return days;
}