//! Career timeline helpers (UTC). Career start: 1 May 2020.

const CAREER_START: (i32, u32, u32) = (2020, 5, 1);

/// Full calendar years completed since career start.
pub fn completed_years(now_ns: u64) -> u32 {
    let secs = now_ns / 1_000_000_000;
    let end = unix_secs_to_utc_ymd(secs);
    years_between(CAREER_START, end)
}

pub fn current_year(now_ns: u64) -> i32 {
    unix_secs_to_utc_ymd(now_ns / 1_000_000_000).0
}

pub fn experience_plus_label(now_ns: u64) -> String {
    let years = completed_years(now_ns).max(1);
    format!("{}+", years)
}

fn years_between(start: (i32, u32, u32), end: (i32, u32, u32)) -> u32 {
    let mut years = (end.0 - start.0) as u32;
    if (end.1, end.2) < (start.1, start.2) {
        years = years.saturating_sub(1);
    }
    years
}

/// Howard Hinnant civil-from-days algorithm (UTC).
fn unix_secs_to_utc_ymd(secs: u64) -> (i32, u32, u32) {
    let mut days = (secs / 86_400) as i64;
    days += 719_468;
    let era = (if days >= 0 { days } else { days - 146_096 }) / 146_097;
    let doe = days - era * 146_097;
    let yoe = (doe - doe / 1_460 + doe / 36_524 - doe / 146_096) / 365;
    let mut y = yoe + era * 400;
    let doy = doe - (365 * yoe + yoe / 4 - yoe / 100);
    let mp = (5 * doy + 2) / 153;
    let d = doy - (153 * mp + 2) / 5 + 1;
    let m = if mp < 10 { mp + 3 } else { mp - 9 };
    if mp >= 10 {
        y += 1;
    }
    (y as i32, m as u32, d as u32)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn may_2020_start() {
        assert_eq!(unix_secs_to_utc_ymd(1_588_291_200), (2020, 5, 1));
    }
}
