'use client';

import { useEffect, useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { Save } from 'lucide-react';
import type { UserSettings } from '@/types';

const SETTINGS_KEY = 'ce_lab_user_settings';

const DEFAULT_SETTINGS: UserSettings = {
  _id: 'local',
  userId: 'local',
  defaultProvider: 'openai',
  favouriteModel: 'gpt-4o',
  theme: 'dark',
  evaluationEnabled: true,
  autoSave: true,
  defaultSystemPrompt: '',
};

export default function SettingsPage() {
  const { settings, setSettings } = useAppStore();
  const [form, setForm] = useState<Partial<UserSettings>>({});
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(SETTINGS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        setForm(parsed);
        setSettings(parsed);
      } else {
        setForm(DEFAULT_SETTINGS);
        setSettings(DEFAULT_SETTINGS);
      }
    } catch {
      setForm(DEFAULT_SETTINGS);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(form));
    setSettings(form as UserSettings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>

      <div className="p-3 rounded-lg bg-secondary/50 text-xs text-muted-foreground">
        Settings are saved locally in your browser (GitHub Pages has no backend).
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="rounded-xl border border-border bg-card p-6 space-y-4">
          <h2 className="font-semibold">Defaults</h2>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm text-muted-foreground">Default Provider</label>
              <select
                value={form.defaultProvider || 'openai'}
                onChange={(e) => setForm({ ...form, defaultProvider: e.target.value })}
                className="w-full p-2 rounded-lg bg-secondary border border-input text-foreground"
              >
                <option value="openai">OpenAI</option>
                <option value="gemini">Gemini</option>
                <option value="groq">Groq (Free)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-sm text-muted-foreground">Favourite Model</label>
              <input
                type="text"
                value={form.favouriteModel || ''}
                onChange={(e) => setForm({ ...form, favouriteModel: e.target.value })}
                className="w-full p-2 rounded-lg bg-secondary border border-input text-foreground"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <label className="text-sm text-muted-foreground">Theme</label>
              <select
                value={form.theme || 'dark'}
                onChange={(e) => setForm({ ...form, theme: e.target.value as 'dark' | 'light' })}
                className="p-2 rounded-lg bg-secondary border border-input text-foreground"
              >
                <option value="dark">Dark</option>
                <option value="light">Light</option>
              </select>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 space-y-4">
          <h2 className="font-semibold">Behaviour</h2>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="eval"
              checked={form.evaluationEnabled ?? true}
              onChange={(e) => setForm({ ...form, evaluationEnabled: e.target.checked })}
              className="rounded"
            />
            <label htmlFor="eval" className="text-sm">Auto-evaluate responses</label>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="autosave"
              checked={form.autoSave ?? true}
              onChange={(e) => setForm({ ...form, autoSave: e.target.checked })}
              className="rounded"
            />
            <label htmlFor="autosave" className="text-sm">Auto-save experiments</label>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 space-y-4">
          <h2 className="font-semibold">Default System Prompt</h2>
          <textarea
            value={form.defaultSystemPrompt || ''}
            onChange={(e) => setForm({ ...form, defaultSystemPrompt: e.target.value })}
            rows={6}
            className="w-full p-3 rounded-lg bg-secondary border border-input text-foreground text-sm font-mono"
          />
        </div>

        <button
          type="submit"
          className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium flex items-center gap-2 hover:opacity-90 transition-opacity"
        >
          <Save className="h-4 w-4" />
          {saved ? 'Saved!' : 'Save Settings'}
        </button>
      </form>
    </div>
  );
}
