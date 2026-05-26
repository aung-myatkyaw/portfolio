/** Career start: May 2020 — single source of truth for experience duration on the site. */
export const CAREER_START = { year: 2020, month: 5, day: 1 };

export function getCareerStartDate() {
  return new Date(CAREER_START.year, CAREER_START.month - 1, CAREER_START.day);
}

/** Full calendar years completed since career start (0 until first May anniversary). */
export function getCompletedYears(asOf = new Date()) {
  const start = getCareerStartDate();
  let years = asOf.getFullYear() - start.getFullYear();
  const monthDiff = asOf.getMonth() - start.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && asOf.getDate() < start.getDate())) {
    years -= 1;
  }
  return Math.max(0, years);
}

/** e.g. "6+" for résumé-style display */
export function getExperiencePlusLabel(asOf = new Date()) {
  const years = getCompletedYears(asOf);
  return `${Math.max(1, years)}+`;
}

/** e.g. "6+ years" */
export function getExperienceSummary(asOf = new Date()) {
  return `${getExperiencePlusLabel(asOf)} years`;
}

/** e.g. "6+ Years in Cloud & Security" */
export function getHomeExperienceTagline(asOf = new Date()) {
  return `${getExperiencePlusLabel(asOf)} Years in Cloud & Security`;
}

/** e.g. "May 2020 – present" */
export function getCareerRangeLabel() {
  return 'May 2020 – present';
}

export function getCurrentYear(asOf = new Date()) {
  return asOf.getFullYear();
}
