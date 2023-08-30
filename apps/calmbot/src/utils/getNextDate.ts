export enum DayOfWeek {
  Sunday = 0,
  Monday = 1,
  Tuesday = 2,
  Wednesday = 3,
  Thursday = 4,
  Friday = 5,
  Saturday = 6,
}

export interface TimeOfDay {
  hours: number;
  minutes: number;
  seconds: number;
  milliseconds: number;
}

/*
  Returns the next occuring DayOfWeek after `date`
  if the dayOfWeek is the same as the date, it will go the the next one 
  i.e date = friday Sept 1st, dayOfWeek = friday, the reutrn will be Sept 8th (one week later on the same day)
*/
export default (date: Date, dayOfWeek: DayOfWeek, timeOfDay: TimeOfDay = { hours: 0, minutes: 0, seconds: 0, milliseconds: 0 }) => {
  date = new Date(date.getTime());

  let setDate = date.getDate() + ((dayOfWeek + 7 - date.getDay()) % 7);
  if (setDate === date.getDate()) setDate = date.getDate() + 7;

  date.setDate(setDate);
  date.setHours(timeOfDay.hours, timeOfDay.minutes, timeOfDay.seconds, timeOfDay.milliseconds);
  return date;
};
