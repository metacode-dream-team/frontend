interface MonkeytypeModeFilterProps {
  mode: "time" | "words";
  value: string;
  onModeChange: (mode: "time" | "words") => void;
  onValueChange: (value: string) => void;
}

const timeOptions = ["15s", "30s", "60s"];
const wordsOptions = ["10", "25", "50", "100"];

export function MonkeytypeModeFilter({
  mode,
  value,
  onModeChange,
  onValueChange,
}: MonkeytypeModeFilterProps) {
  const options = mode === "time" ? timeOptions : wordsOptions;

  return (
    <div className="flex items-center gap-2">
      <select
        value={mode}
        onChange={(event) => onModeChange(event.target.value as "time" | "words")}
        className="rounded-md border border-slate-700 bg-slate-900 px-2 py-1 text-xs text-slate-200"
      >
        <option value="time">Time</option>
        <option value="words">Words</option>
      </select>

      <select
        value={value}
        onChange={(event) => onValueChange(event.target.value)}
        className="rounded-md border border-slate-700 bg-slate-900 px-2 py-1 text-xs text-slate-200"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}
