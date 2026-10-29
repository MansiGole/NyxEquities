/**
 * Dynamic Wall Street Market Clock Engine
 * Tracks live trading session state on the New York Stock Exchange (NYSE / TradFi)
 * Timezone: America/New_York (EST / EDT)
 */

export interface MarketStatus {
  isOpen: boolean;
  mode: "OPEN" | "CLOSED";
  statusText: string;
  badgeLabel: string;
  countdownText: string;
  timeString: string;
  weekday: string;
  hour: number;
  minute: number;
  second: number;
}

export function getMarketStatus(date: Date = new Date()): MarketStatus {
  try {
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: "America/New_York",
      year: "numeric",
      month: "numeric",
      day: "numeric",
      weekday: "short",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: false,
    });

    const parts = formatter.formatToParts(date);
    const map: Record<string, string> = {};
    for (const p of parts) map[p.type] = p.value;

    const hour = parseInt(map.hour || "0", 10);
    const minute = parseInt(map.minute || "0", 10);
    const second = parseInt(map.second || "0", 10);
    const weekday = map.weekday || "Mon";

    const currentMinutes = hour * 60 + minute;
    const openMinutes = 9 * 60 + 30; // 09:30 AM ET
    const closeMinutes = 16 * 60; // 04:00 PM ET

    const isWeekday = weekday !== "Sat" && weekday !== "Sun";
    const isOpen =
      isWeekday && currentMinutes >= openMinutes && currentMinutes < closeMinutes;

    let countdownText = "";
    let statusText = "";
    let badgeLabel = "";
    const mode = isOpen ? "OPEN" : "CLOSED";

    if (isOpen) {
      statusText = "NYSE: OPEN (Regular Trading)";
      badgeLabel = "NYSE: OPEN";
      const remainingMins = closeMinutes - currentMinutes;
      const h = Math.floor(remainingMins / 60);
      const m = remainingMins % 60;
      countdownText = `Closes in ${h}h ${m}m`;
    } else {
      statusText = "NYSE: CLOSED (Off-Hours Yield Active)";
      badgeLabel = "NYSE: CLOSED";

      let daysToAdd = 0;
      if (weekday === "Fri") {
        daysToAdd = currentMinutes >= closeMinutes ? 3 : 0;
      } else if (weekday === "Sat") {
        daysToAdd = 2;
      } else if (weekday === "Sun") {
        daysToAdd = 1;
      } else {
        daysToAdd = currentMinutes >= closeMinutes ? 1 : 0;
      }

      let diffMinutes = 0;
      if (daysToAdd === 0) {
        diffMinutes = openMinutes - currentMinutes;
      } else {
        const minutesRemainingToday = 24 * 60 - currentMinutes;
        const fullDaysMinutes = (daysToAdd - 1) * 24 * 60;
        diffMinutes = minutesRemainingToday + fullDaysMinutes + openMinutes;
      }

      const h = Math.floor(diffMinutes / 60);
      const m = diffMinutes % 60;
      countdownText = `Opens in ${h}h ${m}m`;
    }

    const timeString = `${String(hour).padStart(2, "0")}:${String(
      minute
    ).padStart(2, "0")}:${String(second).padStart(2, "0")} ET`;

    return {
      isOpen,
      mode,
      statusText,
      badgeLabel,
      countdownText,
      timeString,
      weekday,
      hour,
      minute,
      second,
    };
  } catch (err) {
    console.warn("Market status calculation fallback:", err);
    return {
      isOpen: false,
      mode: "CLOSED",
      statusText: "NYSE: CLOSED (Off-Hours Yield Active)",
      badgeLabel: "NYSE: CLOSED",
      countdownText: "Opens in 14h 30m",
      timeString: "20:00:00 ET",
      weekday: "Fri",
      hour: 20,
      minute: 0,
      second: 0,
    };
  }
}

