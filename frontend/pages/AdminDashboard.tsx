import React, { useEffect, useState } from 'react';
import { approveCheatSheet, fetchPendingCheatSheets, rejectCheatSheet } from '../services/apiService';
import { CheatSheet } from '../types';

const AdminDashboard: React.FC = () => {
  const [pendingSheets, setPendingSheets] = useState<CheatSheet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionMessage, setActionMessage] = useState('');

  const loadPendingSheets = async () => {
    setLoading(true);
    setError('');

    try {
      const sheets = await fetchPendingCheatSheets();
      setPendingSheets(sheets);
    } catch (err: any) {
      setError(err.message || 'Failed to load pending cheat sheets.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPendingSheets();
  }, []);

  const handleApprove = async (id: number) => {
    try {
      const response = await approveCheatSheet(id);
      setActionMessage(response.message);
      setPendingSheets(prev => prev.filter(sheet => sheet.id !== id));
    } catch (err: any) {
      setError(err.message || 'Unable to approve cheat sheet.');
    }
  };

  const handleReject = async (id: number) => {
    try {
      const response = await rejectCheatSheet(id);
      setActionMessage(response.message);
      setPendingSheets(prev => prev.filter(sheet => sheet.id !== id));
    } catch (err: any) {
      setError(err.message || 'Unable to reject cheat sheet.');
    }
  };

  return (
    <div className="space-y-8">
      <section className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-text-primary">Admin Review Queue</h1>
          <p className="mt-3 text-text-secondary">
            Review user-submitted cheat sheets. Approved submissions are published to the website immediately.
          </p>
        </div>
        <button
          onClick={loadPendingSheets}
          className="px-4 py-2 rounded-md bg-surface hover:bg-surface-light text-text-primary font-semibold"
        >
          Refresh Queue
        </button>
      </section>

      {actionMessage && <div className="rounded-md border border-green-500/40 bg-green-500/10 px-4 py-3 text-green-300">{actionMessage}</div>}
      {error && <div className="rounded-md border border-red-500/40 bg-red-500/10 px-4 py-3 text-red-300">{error}</div>}

      {loading ? (
        <div className="rounded-lg bg-surface p-8 text-center text-text-secondary">Loading pending submissions...</div>
      ) : pendingSheets.length === 0 ? (
        <div className="rounded-lg bg-surface p-8 text-center text-text-secondary">No pending cheat sheets right now.</div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {pendingSheets.map(sheet => (
            <article key={sheet.id} className="rounded-xl border border-surface-light bg-surface p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="mb-2 flex items-center gap-3">
                    <h2 className="text-2xl font-bold text-text-primary">{sheet.title}</h2>
                    <span className="rounded-full bg-yellow-500/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-yellow-300">
                      Pending
                    </span>
                  </div>
                  <p className="text-text-secondary">{sheet.description}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {sheet.tags.map(tag => (
                      <span key={tag} className="rounded-md bg-surface-light px-2 py-1 text-xs text-text-secondary">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="text-sm text-text-secondary">
                  <p>Category: {sheet.category}</p>
                  <p>Author: {sheet.author.name}</p>
                  <p>Created: {new Date(sheet.createdAt).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                {sheet.content.map(section => (
                  <div key={section.title} className="rounded-lg bg-background/40 p-4">
                    <h3 className="mb-3 text-lg font-semibold text-accent">{section.title}</h3>
                    <div className="space-y-2">
                      {section.commands.map(command => (
                        <div key={`${section.title}-${command.command}`} className="flex flex-col gap-2 rounded-md bg-surface px-3 py-3 md:flex-row md:items-center md:justify-between">
                          <code className="text-sm text-purple-300">{command.command}</code>
                          <span className="text-sm text-text-secondary">{command.description}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => handleApprove(sheet.id)}
                  className="rounded-md bg-primary px-4 py-2 font-semibold text-white hover:bg-primary-hover"
                >
                  Approve & Publish
                </button>
                <button
                  onClick={() => handleReject(sheet.id)}
                  className="rounded-md bg-red-500/80 px-4 py-2 font-semibold text-white hover:bg-red-500"
                >
                  Reject
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
