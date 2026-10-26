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
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function getReferenceMonth(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");

  return `${year}-${month}`;
}

export function getMonthDateRange(referenceMonth: string): { start: string; end: string } {
  const [year, month] = referenceMonth.split("-").map(Number);
  const lastDay = new Date(year, month, 0).getDate();

  return {
    start: `${referenceMonth}-01`,
    end: `${referenceMonth}-${String(lastDay).padStart(2, "0")}`,
  };
}

export function formatDateToDisplay(date: Date): string {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");

  return `${day}/${month}/${date.getFullYear()}`;
}

export function getTimeString(date: Date): string {
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${hours}:${minutes}`;
}

export function getRelativeDayLabel(date: string): string {
  const target = newDateFromString(date);
  const today = new Date();
  const yesterday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1);

  const isSameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  const day = String(target.getDate()).padStart(2, "0");
  const month = getMonthString(target.getMonth())?.slice(0, 3) ?? "";
  const formatted = `${day} ${month}`;

  if (isSameDay(target, today)) return `Hoje, ${formatted}`;
  if (isSameDay(target, yesterday)) return `Ontem, ${formatted}`;

  const weekDay = getWeekDayString(target.getDay()).slice(0, 3);

  return `${weekDay}, ${formatted}`;
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

export function getShortDateString(date: string): string {
  const [, month, day] = date.split("-").map(Number);
  const monthString = getMonthString(month - 1);

  return `${String(day).padStart(2, "0")} ${monthString?.slice(0, 3) ?? ""}`.trim();
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
