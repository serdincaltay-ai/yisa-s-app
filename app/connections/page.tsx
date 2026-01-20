'use client';

import { useState, useEffect } from 'react';

export default function ConnectionsPage() {
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkConnections();
  }, []);

  const checkConnections = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/health');
      const data = await res.json();
      setStatus(data);
    } catch (e) {
      setStatus({ error: 'Bağlantı kontrolü başarısız' });
    }
    setLoading(false);
  };

  const testPRAgent = async () => {
    try {
      const res = await fetch('/api/pr-agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'Test PR - Bağlantı Kontrolü',
          body: 'Bu PR otomatik olarak oluşturuldu.',
          files: [{
            path: 'test-connection.md',
            content: `# Test\nOluşturulma: ${new Date().toISOString()}`
          }]
        })
      });
      const data = await res.json();
      alert(data.pr_url ? `PR Oluşturuldu: ${data.pr_url}` : `Hata: ${data.error}`);
    } catch (e) {
      alert('PR Agent testi başarısız');
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Entegrasyonlar / Connections</h1>
      
      <div className="grid gap-4">
        <div className="border rounded-lg p-4">
          <h2 className="font-semibold mb-2">GitHub PR-Agent</h2>
          <p className="text-sm text-gray-600 mb-3">Robotun otomatik PR açması için</p>
          <button 
            onClick={testPRAgent}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Test Et
          </button>
        </div>

        <div className="border rounded-lg p-4">
          <h2 className="font-semibold mb-2">Railway Worker</h2>
          <p className="text-sm text-gray-600">Status: {loading ? 'Kontrol ediliyor...' : (status?.worker || 'Bilinmiyor')}</p>
        </div>

        <div className="border rounded-lg p-4">
          <h2 className="font-semibold mb-2">Supabase</h2>
          <p className="text-sm text-gray-600">Status: {loading ? 'Kontrol ediliyor...' : (status?.supabase || 'Bilinmiyor')}</p>
        </div>

        <div className="border rounded-lg p-4">
          <h2 className="font-semibold mb-2">Vercel</h2>
          <p className="text-sm text-gray-600">Status: Bağlı (Auto-deploy aktif)</p>
        </div>
      </div>

      <button 
        onClick={checkConnections}
        className="mt-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Bağlantıları Yenile
      </button>
    </div>
  );
}
