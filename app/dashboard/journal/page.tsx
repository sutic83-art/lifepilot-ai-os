import { auth } from '@/auth';
import { db } from '@/lib/db';
import { DeleteButton } from '@/components/delete-button';
import { EntityForm } from '@/components/entity-form';
import { formatDate } from '@/lib/utils';

export default async function JournalPage() {
  const session = await auth();
  const items = await db.journal.findMany({ where: { userId: session!.user.id }, orderBy: { createdAt: 'desc' } });

  return (
    <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
      <EntityForm
        endpoint="/api/journal"
        submitLabel="Sačuvaj zapis"
        fields={[
          { name: 'title', label: 'Naslov' },
          { name: 'mood', label: 'Mood' },
          { name: 'content', label: 'Sadržaj', type: 'textarea' }
        ]}
      />
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="card p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold">{item.title || 'Journal zapis'}</h2>
                <div className="mt-1 text-sm text-slate-500">{formatDate(item.createdAt)} · Mood: {item.mood || '—'}</div>
                <p className="mt-3 whitespace-pre-wrap text-slate-700">{item.content}</p>
              </div>
              <DeleteButton endpoint={`/api/journal/${item.id}`} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
