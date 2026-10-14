export type Month =
  | "Janeiro"
  | "Fevereiro"
  | "Março"
  | "Abril"
  | "Maio"
  | "Junho"
  | "Julho"
  | "Agosto"
  | "Setembro"
  | "Outubro"
  | "Novembro"
  | "Dezembro";

export function getDateOnly(date: Date): string {
  return date.toISOString().split("T")[0];
}

export function getDayFromIsoString(isoString: string) {
  const newDate = isoString.split("T")[0];
  const day = Number(newDate.split("-")[2]);
  return day;
}

export function newDateFromString(date: string) {
  const [year, month, day] = date.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function stringToDateString(
  date: string,
  options = {
    weekNameLength: 0,
  },
) {
  const [year, month, day] = date.split("-").map(Number);
  const monthString = getMonthString(month);

  const weedDay = getWeekDayString(newDateFromString(date).getDay());
  const weekDayFormated = weedDay.slice(0, options.weekNameLength || weedDay.length);

  return `${weekDayFormated}, ${day} de ${monthString} de ${year}`;
}

export function getMonthString(selectedMonth: number): Month | undefined {
  const months: Record<number, Month> = {
    0: "Janeiro",
    1: "Fevereiro",
    2: "Março",
    3: "Abril",
    4: "Maio",
    5: "Junho",
    6: "Julho",
    7: "Agosto",
    8: "Setembro",
    9: "Outubro",
    10: "Novembro",
    11: "Dezembro",
  };

  return months[selectedMonth];
}

export function getMonthNumber(month: Month) {
  const monthsNumber: Record<Month, number> = {
    Janeiro: 0,
    Fevereiro: 1,
    Março: 2,
    Abril: 3,
    Maio: 4,
    Junho: 5,
    Julho: 6,
    Agosto: 7,
    Setembro: 8,
    Outubro: 9,
    Novembro: 10,
    Dezembro: 11,
  };

  return monthsNumber[month];
}

export function getWeekDayString(weekDay: number) {
  const weekDays: Record<number, string> = {
    0: "Domingo",
    1: "Segunda-feira",
    2: "Terça-feira",
    3: "Quarta-feira",
    4: "Quinta-feira",
    5: "Sexta-feira",
    6: "Sábado",
  };

  return weekDays[weekDay];
}

export function getRangedMonths(): Month[] {
  return [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ];
}

export function getRangedYears() {
  const years: number[] = [];
  const currentYear = new Date().getFullYear();

  for (let year = currentYear; year >= 1950; year--) {
    years.push(year);
  }

  return years;
}
