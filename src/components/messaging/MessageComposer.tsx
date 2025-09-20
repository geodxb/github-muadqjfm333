@@ .. @@
           <button
             onClick={() => fileInputRef.current?.click()}
             className="px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
           >
-            <Paperclip size={16} className="mr-2 inline" />
             Attach
           </button>
           <button
             onClick={handleSendMessage}
             disabled={!message.trim() && attachments.length === 0}
             className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
           >
-            <Send size={16} className="mr-2 inline" />
             Send
           </button>