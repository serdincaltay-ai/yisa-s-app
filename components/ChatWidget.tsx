                className="p-2 text-slate-400 hover:text-amber-500 hover:bg-slate-800 rounded-lg transition-colors"
                title="Dosya Yükle"
              >
                <Paperclip className="w-5 h-5" />
              </button>
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Mesajınızı yazın... (Shift+Enter: Yeni satır)"
                rows={1}
                className="flex-1 px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 resize-none min-h-[40px] max-h-[120px]"
              />
              <button
                onClick={sendMessage}
                disabled={loading || (!input.trim() && !file)}
                className="p-2 bg-gradient-to-r from-amber-500 to-orange-600 rounded-xl hover:opacity-90 disabled:opacity-50"
              >
                <Send className="w-5 h-5 text-slate-900" />
              </button>
            </div>
            <p className="text-xs text-slate-500 mt-2 text-center">Shift+Enter: Yeni satır | Enter: Gönder</p>
          </div>
        </div>
      )}
    </>
  )
}
