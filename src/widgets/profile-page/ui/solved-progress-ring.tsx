"use client";

interface SolvedProgressRingProps {
  solved: number;
  total: number;
  attempting: number;
  easySolved: number;
  easyTotal: number;
  mediumSolved: number;
  mediumTotal: number;
  hardSolved: number;
  hardTotal: number;
}

/** Видимая дуга ~300° с зазором сверху/снизу. */
const ARC_FRACTION = 300 / 360;
const GAP_DEG = 360 * (1 - ARC_FRACTION);

const COLORS = {
  easy: "#059669",
  medium: "#ca8a04",
  hard: "#e11d48",
  track: "#3f3f46",
} as const;

const CX = 70;
const CY = 70;
const R = 50;
const STROKE = 7;

const C = 2 * Math.PI * R;
const ARC_LEN = C * ARC_FRACTION;
const GAP_START = (GAP_DEG / 2 / 360) * C;

/**
 * Просвет между зонами на треке. При `strokeLinecap="round"` концы дуги
 * выступают примерно на STROKE/2 в сторону щели — зазор должен быть > STROKE,
 * иначе разрез визуально смыкается.
 */
const TRACK_ZONE_GAP = STROKE + 2.6;

/**
 * Зоны по долям задач; длины ужимаем на 2 щели, чтобы сумма + gaps = ARC_LEN.
 */
function zoneSlotsScaled(
  arcLen: number,
  totalProblems: number,
  easyTotal: number,
  mediumTotal: number,
  hardTotal: number,
): { slotE: number; slotM: number; slotH: number } {
  const inner = arcLen - 2 * TRACK_ZONE_GAP;
  const t = totalProblems > 0 ? totalProblems : 1;
  let slotE = inner * (easyTotal / t);
  let slotM = inner * (mediumTotal / t);
  let slotH = inner * (hardTotal / t);
  const sum = slotE + slotM + slotH;
  if (sum > 0 && Math.abs(sum - inner) > 1e-4) {
    const k = inner / sum;
    slotE *= k;
    slotM *= k;
    slotH *= k;
  }
  return { slotE, slotM, slotH };
}

/**
 * Один видимый отрезок на полной окружности без ведущего «dash 0»:
 * при round caps нулевая длина даёт круглую точку в начале path (у нас — в верхнем зазоре).
 */
function arcDashSingle(segmentLen: number, startAlongPath: number): { dasharray: string; offset: number } {
  const len = Math.min(Math.max(segmentLen, 0), C);
  const dasharray = `${len} ${C - len}`;
  /**
   * SVG: dashoffset — вход в повторяющийся паттерн в начале path.
   * Чтобы первая «краска» шла от `startAlongPath` по часовой стрелке, нужно C − start (см. SVG2 §13.5.6).
   */
  const start = ((startAlongPath % C) + C) % C;
  const offset = C - start;
  return { dasharray, offset };
}

/** Небольшой зазор только между двумя цветами на стыке зон (дополнительно к щели в треке). */
function colorJunction(lenA: number, lenB: number): number {
  if (lenA <= 0.05 || lenB <= 0.05) return 0;
  return Math.min(2.2, Math.max(0.5, Math.min(lenA, lenB) * 0.22));
}

export function SolvedProgressRing({
  solved,
  total,
  attempting,
  easySolved,
  easyTotal,
  mediumSolved,
  mediumTotal,
  hardSolved,
  hardTotal,
}: SolvedProgressRingProps) {
  const { slotE, slotM, slotH } = zoneSlotsScaled(ARC_LEN, total, easyTotal, mediumTotal, hardTotal);

  const lenE = easyTotal > 0 ? slotE * (easySolved / easyTotal) : 0;
  const lenM = mediumTotal > 0 ? slotM * (mediumSolved / mediumTotal) : 0;
  const lenH = hardTotal > 0 ? slotH * (hardSolved / hardTotal) : 0;

  const jEM = colorJunction(lenE, lenM);
  const jMH = colorJunction(lenM, lenH);

  /** jEM: укорочение easy у щели E|M (между зонами уже TRACK_ZONE_GAP — не сдвигаем старт M/H внутрь зоны). */
  const visE = Math.max(0, lenE - jEM);
  const zoneM = slotE + TRACK_ZONE_GAP;
  const zoneH = slotE + TRACK_ZONE_GAP + slotM + TRACK_ZONE_GAP;
  /** Стык M|H только укорачивает medium с конца; цвет M и H начинается с начала своего трека. */
  const visM = Math.max(0, lenM - jMH);
  const visH = Math.max(0, lenH);

  const trackE = arcDashSingle(slotE, GAP_START);
  const trackM = arcDashSingle(slotM, GAP_START + zoneM);
  const trackH = arcDashSingle(slotH, GAP_START + zoneH);

  const easyArc = arcDashSingle(visE, GAP_START);
  const mediumArc = arcDashSingle(visM, GAP_START + zoneM);
  const hardArc = arcDashSingle(visH, GAP_START + zoneH);

  return (
    <div className="flex flex-col items-center">
      <div className="relative flex h-[148px] w-[148px] shrink-0 items-center justify-center">
        <svg className="h-full w-full" viewBox="0 0 140 140" aria-hidden>
          <g transform={`rotate(-90 ${CX} ${CY})`}>
            {slotE > 0.02 ? (
              <circle
                cx={CX}
                cy={CY}
                r={R}
                fill="none"
                stroke={COLORS.track}
                strokeWidth={STROKE}
                strokeLinecap="round"
                strokeDasharray={trackE.dasharray}
                strokeDashoffset={trackE.offset}
              />
            ) : null}
            {slotM > 0.02 ? (
              <circle
                cx={CX}
                cy={CY}
                r={R}
                fill="none"
                stroke={COLORS.track}
                strokeWidth={STROKE}
                strokeLinecap="round"
                strokeDasharray={trackM.dasharray}
                strokeDashoffset={trackM.offset}
              />
            ) : null}
            {slotH > 0.02 ? (
              <circle
                cx={CX}
                cy={CY}
                r={R}
                fill="none"
                stroke={COLORS.track}
                strokeWidth={STROKE}
                strokeLinecap="round"
                strokeDasharray={trackH.dasharray}
                strokeDashoffset={trackH.offset}
              />
            ) : null}
            {visE > 0.15 ? (
              <circle
                cx={CX}
                cy={CY}
                r={R}
                fill="none"
                stroke={COLORS.easy}
                strokeWidth={STROKE}
                strokeLinecap="round"
                strokeDasharray={easyArc.dasharray}
                strokeDashoffset={easyArc.offset}
              />
            ) : null}
            {visM > 0.15 ? (
              <circle
                cx={CX}
                cy={CY}
                r={R}
                fill="none"
                stroke={COLORS.medium}
                strokeWidth={STROKE}
                strokeLinecap="round"
                strokeDasharray={mediumArc.dasharray}
                strokeDashoffset={mediumArc.offset}
              />
            ) : null}
            {visH > 0.15 ? (
              <circle
                cx={CX}
                cy={CY}
                r={R}
                fill="none"
                stroke={COLORS.hard}
                strokeWidth={STROKE}
                strokeLinecap="round"
                strokeDasharray={hardArc.dasharray}
                strokeDashoffset={hardArc.offset}
              />
            ) : null}
          </g>
        </svg>

        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
          <p className="text-lg font-bold tabular-nums leading-tight tracking-tight text-white">
            {solved}
            <span className="text-sm font-semibold text-zinc-500">/{total}</span>
          </p>
          <p className="mt-0.5 text-[10px] font-medium text-zinc-500">Solved</p>
        </div>
      </div>
      <p className="mt-1 text-[10px] text-zinc-500">{attempting} Attempting</p>
    </div>
  );
}
