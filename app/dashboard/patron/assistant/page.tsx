export default function AssistantPage() {
  return (
    <main className="h-screen flex flex-col">
      <header className="p-4 border-b font-bold">
        Patron Asistanı
      </header>

      <section className="flex-1 p-4 overflow-y-auto">
        <div className="text-gray-500">Asistan hazır.</div>
      </section>

      <footer className="p-4 border-t">
        <textarea
          className="w-full p-3 border rounded"
          placeholder="Komut yaz..."
        />
      </footer>
    </main>
  );
}
