import { ReactNode, useState } from "react";
import {
  DataVisualizationBlock,
  DataVizCartesianChart,
  DataVizPieChart,
  DataVizSeries,
} from "../../types";

type DataVisualizationProps = {
  data: DataVisualizationBlock;
};

// Slack cycles this palette across series (line/bar/area) and pie segments.
const PALETTE = ["rgb(191, 77, 26)", "rgb(38, 59, 156)", "rgb(16, 111, 77)", "rgb(217, 76, 117)"];
const colorAt = (i: number) => PALETTE[i % PALETTE.length]!;

// #region helpers ---------------------------------------------------------------

const niceNum = (range: number, round: boolean) => {
  const exp = Math.floor(Math.log10(range || 1));
  const fraction = range / Math.pow(10, exp);
  let nice: number;
  if (round) {
    if (fraction < 1.5) nice = 1;
    else if (fraction < 3) nice = 2;
    else if (fraction < 7) nice = 5;
    else nice = 10;
  } else {
    if (fraction <= 1) nice = 1;
    else if (fraction <= 2) nice = 2;
    else if (fraction <= 5) nice = 5;
    else nice = 10;
  }
  return nice * Math.pow(10, exp);
};

// "Nice", evenly-spaced axis ticks that span [lo, hi].
const niceTicks = (lo: number, hi: number, maxTicks = 5): number[] => {
  if (!isFinite(lo) || !isFinite(hi)) return [0, 1];
  if (lo === hi) {
    if (lo === 0) return [0, 1];
    lo = Math.min(0, lo);
    hi = Math.max(0, hi);
  }
  const range = niceNum(hi - lo, false);
  const spacing = niceNum(range / Math.max(1, maxTicks - 1), true);
  const niceLo = Math.floor(lo / spacing) * spacing;
  const niceHi = Math.ceil(hi / spacing) * spacing;
  const ticks: number[] = [];
  for (let v = niceLo; v <= niceHi + spacing * 0.5; v += spacing) {
    ticks.push(Math.round(v * 1e6) / 1e6);
  }
  return ticks;
};

const strip = (n: number) => String(Math.round(n * 100) / 100);

// Compact axis-tick label: keeps small numbers grouped (1,200) and shortens big ones (15k, 2M).
const formatTick = (n: number): string => {
  if (n === 0) return "0";
  const abs = Math.abs(n);
  if (abs >= 1_000_000) return strip(n / 1_000_000) + "M";
  if (abs >= 10_000) return strip(n / 1_000) + "k";
  return n.toLocaleString("en-US");
};

// "a", "a and b", "a, b, and c" (oxford) / "a, b and c".
const joinList = (items: string[], oxford: boolean): string => {
  if (items.length === 0) return "";
  if (items.length === 1) return items[0]!;
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  const head = items.slice(0, -1).join(", ");
  return `${head}${oxford ? "," : ""} and ${items[items.length - 1]}`;
};

const csvCell = (v: string) => (/[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v);

const downloadCsv = (filename: string, header: string[], rows: string[][]) => {
  if (typeof document === "undefined") return;
  const csv = [header, ...rows].map((row) => row.map(csvCell).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};

// #endregion

// #region models ----------------------------------------------------------------

type CartesianModel = {
  categories: string[];
  series: { name: string; color: string; values: (number | null)[] }[];
  xLabel?: string;
  yLabel?: string;
};

const buildCartesianModel = (chart: DataVizCartesianChart): CartesianModel => {
  const seriesIn = chart.series || [];
  const axis = chart.axis_config || {};

  let categories = axis.categories && axis.categories.length > 0 ? axis.categories.slice() : [];
  if (categories.length === 0) {
    // Fall back to the labels of the longest series, preserving their order.
    let longest: DataVizSeries | undefined;
    for (const s of seriesIn) {
      if (!longest || (s.data?.length || 0) > (longest.data?.length || 0)) longest = s;
    }
    categories = (longest?.data || []).map((d) => d.label);
  }

  const series = seriesIn.map((s, i) => {
    const byLabel = new Map<string, number>();
    (s.data || []).forEach((d) => byLabel.set(d.label, d.value));
    const values = categories.map((category, idx) => {
      if (byLabel.has(category)) return byLabel.get(category)!;
      const point = (s.data || [])[idx];
      return point ? point.value : null;
    });
    return { name: s.name ?? `Series ${i + 1}`, color: colorAt(i), values };
  });

  return { categories, series, xLabel: axis.x_label, yLabel: axis.y_label };
};

type PieModel = {
  segments: { label: string; value: number; color: string; pct: number }[];
  total: number;
};

const buildPieModel = (chart: DataVizPieChart): PieModel => {
  const segs = (chart.segments || []).filter((s) => typeof s.value === "number");
  const total = segs.reduce((sum, s) => sum + Math.max(0, s.value), 0);
  const segments = segs.map((s, i) => ({
    label: s.label,
    value: s.value,
    color: colorAt(i),
    pct: total > 0 ? Math.round((Math.max(0, s.value) / total) * 100) : 0,
  }));
  return { segments, total };
};

// #endregion

// #region cartesian chart -------------------------------------------------------

const VIEW_W = 520;
const VIEW_H = 300;
const MARGIN = { top: 14, right: 16, bottom: 48, left: 60 };

const CartesianChart = (props: {
  model: CartesianModel;
  type: "line" | "bar" | "area";
  ariaLabel: string;
}) => {
  const { model, type, ariaLabel } = props;
  const { categories, series, xLabel, yLabel } = model;

  const plotLeft = MARGIN.left;
  const plotRight = VIEW_W - MARGIN.right;
  const plotTop = MARGIN.top;
  const plotBottom = VIEW_H - MARGIN.bottom;
  const plotW = plotRight - plotLeft;
  const plotH = plotBottom - plotTop;

  const values: number[] = [];
  series.forEach((s) => s.values.forEach((v) => v != null && values.push(v)));
  let dataMin = values.length ? Math.min(...values) : 0;
  let dataMax = values.length ? Math.max(...values) : 1;
  // Bars and areas are anchored at zero; lines reference zero only when they cross it.
  if (type !== "line") {
    dataMin = Math.min(0, dataMin);
    dataMax = Math.max(0, dataMax);
  } else if (dataMin < 0) {
    dataMax = Math.max(0, dataMax);
  }

  const ticks = niceTicks(dataMin, dataMax, 5);
  const domainMin = ticks[0]!;
  const domainMax = ticks[ticks.length - 1]!;
  const span = domainMax - domainMin || 1;

  const yOf = (v: number) => plotTop + (1 - (v - domainMin) / span) * plotH;
  const count = categories.length;
  const xPoint = (i: number) =>
    count <= 1 ? plotLeft + plotW / 2 : plotLeft + (i / (count - 1)) * plotW;
  const bandWidth = count > 0 ? plotW / count : plotW;
  const xBand = (i: number) => plotLeft + (i + 0.5) * bandWidth;

  const baselineY = yOf(Math.min(Math.max(0, domainMin), domainMax));
  const showZeroLine = domainMin < 0 && domainMax > 0;

  const groupWidth = bandWidth * 0.7;
  const barWidth = series.length > 0 ? groupWidth / series.length : groupWidth;

  return (
    <svg
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      role="img"
      aria-label={ariaLabel}
      preserveAspectRatio="xMidYMid meet"
      className="w-full h-auto text-black-secondary dark:text-dark-text-max slack_blocks_to_jsx__data_visualization_chart"
      style={{ fontFamily: "Lato, Slack-Lato, sans-serif" }}
    >
      {/* gridlines + y-axis ticks */}
      {ticks.map((t, i) => {
        const y = yOf(t);
        return (
          <g key={`grid-${i}`}>
            <line
              x1={plotLeft}
              y1={y}
              x2={plotRight}
              y2={y}
              stroke="currentColor"
              strokeOpacity={t === 0 && showZeroLine ? 0.45 : 0.16}
            />
            <text
              x={plotLeft - 8}
              y={y}
              textAnchor="end"
              dominantBaseline="central"
              fill="currentColor"
              fontSize={11}
            >
              {formatTick(t)}
            </text>
          </g>
        );
      })}

      {/* area fills (drawn under the lines) */}
      {type === "area" &&
        series.map((s, si) => {
          const pts = s.values
            .map((v, i) => (v == null ? null : ([xPoint(i), yOf(v)] as [number, number])))
            .filter((p): p is [number, number] => p !== null);
          if (pts.length === 0) return null;
          const line = pts.map(([x, y], i) => `${i === 0 ? "M" : "L"} ${x} ${y}`).join(" ");
          const area = `${line} L ${pts[pts.length - 1]![0]} ${baselineY} L ${pts[0]![0]} ${baselineY} Z`;
          return (
            <g key={`area-${si}`}>
              <path d={area} fill={s.color} fillOpacity={0.22} />
              <path
                d={line}
                fill="none"
                stroke={s.color}
                strokeWidth={2}
                strokeLinejoin="round"
                strokeLinecap="round"
              />
            </g>
          );
        })}

      {/* lines */}
      {type === "line" &&
        series.map((s, si) => {
          const pts = s.values
            .map((v, i) => (v == null ? null : ([xPoint(i), yOf(v)] as [number, number])))
            .filter((p): p is [number, number] => p !== null);
          if (pts.length === 0) return null;
          const line = pts.map(([x, y], i) => `${i === 0 ? "M" : "L"} ${x} ${y}`).join(" ");
          return (
            <g key={`line-${si}`}>
              <path
                d={line}
                fill="none"
                stroke={s.color}
                strokeWidth={2}
                strokeLinejoin="round"
                strokeLinecap="round"
              />
              {pts.map(([x, y], i) => (
                <circle key={i} cx={x} cy={y} r={2.5} fill={s.color} />
              ))}
            </g>
          );
        })}

      {/* bars */}
      {type === "bar" &&
        series.map((s, si) => (
          <g key={`bar-${si}`}>
            {s.values.map((v, i) => {
              if (v == null) return null;
              const groupStart = xBand(i) - groupWidth / 2;
              const x = groupStart + si * barWidth;
              const valueY = yOf(v);
              const y = Math.min(valueY, baselineY);
              const h = Math.max(1, Math.abs(valueY - baselineY));
              return (
                <rect
                  key={i}
                  x={x}
                  y={y}
                  width={Math.max(1, barWidth - 1)}
                  height={h}
                  rx={2}
                  fill={s.color}
                />
              );
            })}
          </g>
        ))}

      {/* x-axis category labels */}
      {categories.map((c, i) => (
        <text
          key={`x-${i}`}
          x={type === "bar" ? xBand(i) : xPoint(i)}
          y={plotBottom + 16}
          textAnchor="middle"
          fill="currentColor"
          fontSize={11}
        >
          {c}
        </text>
      ))}

      {/* axis titles */}
      {xLabel && (
        <text
          x={(plotLeft + plotRight) / 2}
          y={VIEW_H - 6}
          textAnchor="middle"
          fill="currentColor"
          fontSize={12}
        >
          {xLabel}
        </text>
      )}
      {yLabel && (
        <text
          transform={`translate(14 ${(plotTop + plotBottom) / 2}) rotate(-90)`}
          textAnchor="middle"
          fill="currentColor"
          fontSize={12}
        >
          {yLabel}
        </text>
      )}
    </svg>
  );
};

// #endregion

// #region pie chart -------------------------------------------------------------

const polar = (cx: number, cy: number, r: number, deg: number): [number, number] => {
  const a = ((deg - 90) * Math.PI) / 180;
  return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
};

const pieSlice = (cx: number, cy: number, r: number, start: number, end: number) => {
  const [sx, sy] = polar(cx, cy, r, start);
  const [ex, ey] = polar(cx, cy, r, end);
  const large = end - start > 180 ? 1 : 0;
  return `M ${cx} ${cy} L ${sx} ${sy} A ${r} ${r} 0 ${large} 1 ${ex} ${ey} Z`;
};

const PieChart = (props: { model: PieModel; ariaLabel: string }) => {
  const { model, ariaLabel } = props;
  const cx = 110;
  const cy = 110;
  const r = 92;

  const segs = model.segments.filter((s) => Math.max(0, s.value) > 0);
  if (segs.length === 0 || model.total <= 0) return null;

  let angle = 0;
  const arcs = segs.map((s) => {
    const fraction = Math.max(0, s.value) / model.total;
    const start = angle;
    const end = angle + fraction * 360;
    angle = end;
    return { color: s.color, start, end, full: fraction >= 0.999 };
  });

  return (
    <svg
      viewBox="0 0 220 220"
      role="img"
      aria-label={ariaLabel}
      preserveAspectRatio="xMidYMid meet"
      className="w-[200px] h-[200px] max-w-full text-white-primary dark:text-dark-bg-secondary slack_blocks_to_jsx__data_visualization_chart"
    >
      {arcs.map((a, i) =>
        a.full ? (
          <circle key={i} cx={cx} cy={cy} r={r} fill={a.color} stroke="currentColor" strokeWidth={2} />
        ) : (
          <path
            key={i}
            d={pieSlice(cx, cy, r, a.start, a.end)}
            fill={a.color}
            stroke="currentColor"
            strokeWidth={2}
            strokeLinejoin="round"
          />
        ),
      )}
    </svg>
  );
};

// #endregion

// #region shared UI -------------------------------------------------------------

const Legend = (props: { items: { name: string; color: string }[] }) => {
  if (props.items.length === 0) return null;
  return (
    <div
      aria-hidden="true"
      className="mt-2 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 slack_blocks_to_jsx__data_visualization_legend"
    >
      {props.items.map((item, i) => (
        <span
          key={i}
          className="inline-flex items-center gap-1.5 text-small text-black-secondary dark:text-dark-text-secondary"
        >
          <span
            className="inline-block w-2.5 h-2.5 rounded-sm shrink-0 slack_blocks_to_jsx__data_visualization_swatch"
            style={{ backgroundColor: item.color }}
          />
          {item.name}
        </span>
      ))}
    </div>
  );
};

const DataTable = (props: { header: string[]; rows: string[][] }) => (
  <div className="overflow-x-auto slack_blocks_to_jsx__data_visualization_table">
    <table className="border-collapse text-small">
      <thead>
        <tr>
          {props.header.map((h, i) => (
            <th
              key={i}
              className="px-2.5 py-1.5 text-left font-semibold border-b border-gray-200 dark:border-dark-border whitespace-nowrap"
            >
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {props.rows.map((row, ri) => (
          <tr key={ri}>
            {row.map((cell, ci) => (
              <td
                key={ci}
                className="px-2.5 py-1.5 border-b border-gray-100 dark:border-dark-border/60 whitespace-nowrap"
              >
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const TableIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className="w-4 h-4">
    <rect x="2" y="3" width="12" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
    <path d="M2 6.5h12M6.5 6.5V13" stroke="currentColor" strokeWidth="1.3" />
  </svg>
);

const DownloadIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className="w-4 h-4">
    <path
      d="M8 2.5v7m0 0 2.5-2.5M8 9.5 5.5 7"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M3 11v1.5A1.5 1.5 0 0 0 4.5 14h7a1.5 1.5 0 0 0 1.5-1.5V11"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
    />
  </svg>
);

// #endregion

export const DataVisualization = (props: DataVisualizationProps) => {
  const { title, chart, block_id } = props.data;
  const [showTable, setShowTable] = useState(false);

  if (!chart || !chart.type) return null;

  let chartNode: ReactNode = null;
  let legendItems: { name: string; color: string }[] = [];
  let tableHeader: string[] = [];
  let tableRows: string[][] = [];

  if (chart.type === "pie") {
    const model = buildPieModel(chart);
    if (model.segments.length === 0) return null;

    const ariaLabel =
      `Pie chart${title ? `: ${title}` : ""}, with ${model.segments.length} ` +
      `segment${model.segments.length === 1 ? "" : "s"}. Segments: ` +
      `${joinList(
        model.segments.map((s) => `${s.label} (${s.pct}%)`),
        true,
      )}.`;

    chartNode = (
      <div className="flex flex-col items-center">
        <PieChart model={model} ariaLabel={ariaLabel} />
      </div>
    );
    legendItems = model.segments.map((s) => ({ name: `${s.label} · ${s.pct}%`, color: s.color }));
    tableHeader = ["Segment", "Value", "Percent"];
    tableRows = model.segments.map((s) => [s.label, String(s.value), `${s.pct}%`]);
  } else {
    const model = buildCartesianModel(chart);
    if (model.series.length === 0 || model.categories.length === 0) return null;

    const typeName = chart.type === "line" ? "Line" : chart.type === "bar" ? "Bar" : "Area";
    const names = model.series.map((s) => s.name);
    const axisSentence =
      model.xLabel && model.yLabel
        ? ` The X axis is ${model.xLabel}, the Y axis is ${model.yLabel}.`
        : "";
    const ariaLabel =
      `${typeName} chart${title ? `: ${title}` : ""}.${axisSentence} ` +
      `There ${names.length === 1 ? "is" : "are"} ${names.length} series: ${joinList(names, false)}.`;

    chartNode = <CartesianChart model={model} type={chart.type} ariaLabel={ariaLabel} />;
    legendItems = model.series.map((s) => ({ name: s.name, color: s.color }));
    tableHeader = [model.xLabel || "", ...model.series.map((s) => s.name)];
    tableRows = model.categories.map((category, i) => [
      category,
      ...model.series.map((s) => {
        const v = s.values[i];
        return v == null ? "" : String(v);
      }),
    ]);
  }

  return (
    <div
      id={block_id}
      className="my-2 w-full max-w-[540px] rounded-lg border border-black-primary/[0.13] dark:border-dark-border bg-white-primary dark:bg-dark-bg-secondary px-3 py-2.5 slack_blocks_to_jsx__data_visualization"
    >
      <div className="flex items-start gap-2">
        {title && (
          <h3 className="flex-1 min-w-0 m-0 text-header font-semibold leading-snug text-black-primary dark:text-dark-text-primary slack_blocks_to_jsx__data_visualization_title">
            {title}
          </h3>
        )}
        <div className="flex items-center gap-0.5 shrink-0 ml-auto" role="group">
          <button
            type="button"
            aria-label="View as table"
            aria-pressed={showTable}
            onClick={() => setShowTable((v) => !v)}
            className={`p-1 rounded text-black-secondary dark:text-dark-text-secondary hover:bg-black-primary/[0.06] dark:hover:bg-white-primary/[0.08] slack_blocks_to_jsx__data_visualization_action ${
              showTable ? "bg-black-primary/[0.08] dark:bg-white-primary/[0.1]" : ""
            }`}
          >
            <TableIcon />
          </button>
          <button
            type="button"
            aria-label="Download chart data"
            onClick={() => downloadCsv(`${title || "chart"}.csv`, tableHeader, tableRows)}
            className="p-1 rounded text-black-secondary dark:text-dark-text-secondary hover:bg-black-primary/[0.06] dark:hover:bg-white-primary/[0.08] slack_blocks_to_jsx__data_visualization_action"
          >
            <DownloadIcon />
          </button>
        </div>
      </div>

      <div className="mt-1.5">
        {showTable ? (
          <DataTable header={tableHeader} rows={tableRows} />
        ) : (
          <>
            {chartNode}
            <Legend items={legendItems} />
          </>
        )}
      </div>
    </div>
  );
};
