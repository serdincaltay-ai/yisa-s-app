"use client"

export default function AssistantPanel() {
  return (
    <div className="fixed bottom-4 right-4 w-[420px] h-[520px] bg-slate-900 border border-slate-700 rounded-2xl flex flex-col">
      <div className="p-3 border-b border-slate-700 text-amber-400 font-bold">
        YİSA-S ASİSTAN
      </div>

      <div className="flex-1 p-3 overflow-y-auto text-slate-300">
        Komut yaz.
      </div>

      <div className="p-3 border-t border-slate-700">
        <input
          className="w-full bg-slate-800 text-white p-2 rounded-xl"
          placeholder="YİSA-S, şunu yap..."
        />
      </div>
    </div>
  )
}
