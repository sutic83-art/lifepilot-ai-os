export function MetricCard({ title, value, hint }: { title: string; value: string | number; hint: string }) {
  return (
    <div className="card p-5">
      <div className="text-sm text-slate-500">{title}</div>
      <div className="mt-2 text-3xl font-bold">{value}</div>
      <div className="mt-2 text-sm text-slate-600">{hint}</div>
    </div>
  );
}
