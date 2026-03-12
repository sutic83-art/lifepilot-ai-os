import { auth } from '@/auth';
import { db } from '@/lib/db';
import { DeleteButton } from '@/components/delete-button';
import { EntityForm } from '@/components/entity-form';

export default async function HabitsPage() {
  const session = await auth();
  const items = await db.habit.findMany({ where: { userId: session!.user.id }, orderBy: { createdAt: 'desc' } });

  return (
    <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
      <EntityForm
        endpoint="/api/habits"
        submitLabel="Dodaj naviku"
        fields={[
          { name: 'title', label: 'Naziv' },
          { name: 'frequency', label: 'Frekvencija' },
          { name: 'streak', label: 'Streak', type: 'number' },
          { name: 'status', label: 'Status (GOOD/WARNING/GREAT)' }
        ]}
      />
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="card p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold">{item.title}</h2>
                <div className="mt-3 text-sm text-slate-500">{item.frequency} · {item.streak} dana · {item.status}</div>
              </div>
              <DeleteButton endpoint={`/api/habits/${item.id}`} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
