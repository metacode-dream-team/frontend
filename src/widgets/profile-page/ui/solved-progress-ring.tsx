"use client";

import { useEffect, useState } from "react";

type DifficultyZone = "easy" | "medium" | "hard";

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
  focusedZone?: DifficultyZone | null;
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

const RING_SEGMENT_TRANSITION =
  "opacity 0.38s ease, stroke-width 0.38s ease, filter 0.38s ease";

const FILL_DURATION_MS = 900;

function easeOutCubic(t: number): number {
  return 1 - (1 - t) ** 3;
}

function useFillProgress(trigger: string, delayMs: number, enabled: boolean): number {
  const [progress, setProgress] = useState(enabled ? 0 : 1);

  useEffect(() => {
    if (!enabled) {
      setProgress(1);
      return;
    }

    const reducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reducedMotion) {
      setProgress(1);
      return;
    }

    setProgress(0);
    let raf = 0;
    let start = 0;

    const timeout = window.setTimeout(() => {
      const tick = (ts: number) => {
        if (!start) start = ts;
        const t = Math.min((ts - start) / FILL_DURATION_MS, 1);
        setProgress(easeOutCubic(t));
        if (t < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }, delayMs);

    return () => {
      clearTimeout(timeout);
      cancelAnimationFrame(raf);
    };
  }, [trigger, delayMs, enabled]);

  return progress;
}

function RingSegment({
  visible,
  emphasized,
  cx,
  cy,
  r,
  stroke,
  strokeWidth,
  dasharray,
  offset,
}: {
  visible: boolean;
  emphasized?: boolean;
  cx: number;
  cy: number;
  r: number;
  stroke: string;
  strokeWidth: number;
  dasharray: string;
  offset: number;
}) {
  return (
    <circle
      cx={cx}
      cy={cy}
      r={r}
      fill="none"
      stroke={stroke}
      strokeWidth={emphasized ? strokeWidth + 0.75 : strokeWidth}
      strokeLinecap="round"
      strokeDasharray={dasharray}
      strokeDashoffset={offset}
      style={{
        opacity: visible ? 1 : 0,
        transition: RING_SEGMENT_TRANSITION,
        filter: emphasized ? `drop-shadow(0 0 6px ${stroke})` : "none",
      }}
    />
  );
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
  focusedZone = null,
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

  const showEasy = !focusedZone || focusedZone === "easy";
  const showMedium = !focusedZone || focusedZone === "medium";
  const showHard = !focusedZone || focusedZone === "hard";

  const fillTrigger = `${focusedZone ?? "all"}-${visE.toFixed(2)}-${visM.toFixed(2)}-${visH.toFixed(2)}`;
  const staggered = focusedZone == null;

  const easyFill = useFillProgress(fillTrigger, staggered ? 0 : 0, showEasy && visE > 0.15);
  const mediumFill = useFillProgress(fillTrigger, staggered ? 140 : 0, showMedium && visM > 0.15);
  const hardFill = useFillProgress(fillTrigger, staggered ? 280 : 0, showHard && visH > 0.15);

  const easyArc = arcDashSingle(visE * easyFill, GAP_START);
  const mediumArc = arcDashSingle(visM * mediumFill, GAP_START + zoneM);
  const hardArc = arcDashSingle(visH * hardFill, GAP_START + zoneH);

  const centerSolved =
    focusedZone === "easy"
      ? easySolved
      : focusedZone === "medium"
        ? mediumSolved
        : focusedZone === "hard"
          ? hardSolved
          : solved;
  const centerTotal =
    focusedZone === "easy"
      ? easyTotal
      : focusedZone === "medium"
        ? mediumTotal
        : focusedZone === "hard"
          ? hardTotal
          : total;
  const centerLabel =
    focusedZone === "easy"
      ? "Easy"
      : focusedZone === "medium"
        ? "Medium"
        : focusedZone === "hard"
          ? "Hard"
          : "Solved";

  return (
    <div className="flex flex-col items-center">
      <div className="relative flex h-[158px] w-[158px] shrink-0 items-center justify-center max-lg:mx-auto lg:h-[172px] lg:w-[172px] xl:h-[180px] xl:w-[180px]">
        <svg className="h-full w-full" viewBox="0 0 140 140" aria-hidden>
          <g transform={`rotate(-90 ${CX} ${CY})`}>
            <RingSegment
              visible={showEasy && slotE > 0.02}
              cx={CX}
              cy={CY}
              r={R}
              stroke={COLORS.track}
              strokeWidth={STROKE}
              dasharray={trackE.dasharray}
              offset={trackE.offset}
            />
            <RingSegment
              visible={showMedium && slotM > 0.02}
              cx={CX}
              cy={CY}
              r={R}
              stroke={COLORS.track}
              strokeWidth={STROKE}
              dasharray={trackM.dasharray}
              offset={trackM.offset}
            />
            <RingSegment
              visible={showHard && slotH > 0.02}
              cx={CX}
              cy={CY}
              r={R}
              stroke={COLORS.track}
              strokeWidth={STROKE}
              dasharray={trackH.dasharray}
              offset={trackH.offset}
            />
            <RingSegment
              visible={showEasy && visE > 0.15}
              emphasized={focusedZone === "easy"}
              cx={CX}
              cy={CY}
              r={R}
              stroke={COLORS.easy}
              strokeWidth={STROKE}
              dasharray={easyArc.dasharray}
              offset={easyArc.offset}
            />
            <RingSegment
              visible={showMedium && visM > 0.15}
              emphasized={focusedZone === "medium"}
              cx={CX}
              cy={CY}
              r={R}
              stroke={COLORS.medium}
              strokeWidth={STROKE}
              dasharray={mediumArc.dasharray}
              offset={mediumArc.offset}
            />
            <RingSegment
              visible={showHard && visH > 0.15}
              emphasized={focusedZone === "hard"}
              cx={CX}
              cy={CY}
              r={R}
              stroke={COLORS.hard}
              strokeWidth={STROKE}
              dasharray={hardArc.dasharray}
              offset={hardArc.offset}
            />
          </g>
        </svg>

        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
          <div
            key={`${centerLabel}-${centerSolved}-${centerTotal}`}
            className="flex flex-col items-center"
            style={{ animation: "ringCenterIn 0.28s ease-out" }}
          >
            <p className="text-lg font-bold tabular-nums leading-tight tracking-tight text-white max-lg:text-xl lg:text-xl xl:text-2xl">
              {centerSolved}
              <span className="text-sm font-semibold text-zinc-500 max-lg:text-sm lg:text-base">/{centerTotal}</span>
            </p>
            <p className="mt-0.5 text-[11px] font-medium text-zinc-500 max-lg:text-xs">{centerLabel}</p>
          </div>
        </div>
      </div>
      <p className="mt-1 text-[10px] text-zinc-500">{attempting} Attempting</p>
    </div>
  );
}
