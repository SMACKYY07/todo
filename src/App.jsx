import React, { useEffect, useState } from 'react'

export default function App() {
  const [todos, setTodos] = useState(() => {
    const stored = localStorage.getItem("todos");
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos])

  const [text, setText] = useState("");
  const [editing, setEditing] = useState(null);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState("");

  const generateId = () => Date.now().toString(36) + Math.random().toString(36).slice(2);

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedText = text.trim();
    if (!trimmedText) return;

    // Prevent duplicate todos
    const alreadyExists = todos.some(
      (t) => t.text.toLowerCase() === trimmedText.toLowerCase()
    );
    if (alreadyExists && !editing) {
      alert("Task already exists!");
      return;
    }

    if (editing) {
      setTodos(
        todos.map((t) =>
          t.id === editing.id ? { ...t, text: trimmedText } : t
        )
      );
      setEditing(null);
    } else {
      setTodos([
        ...todos,
        { id: generateId(), text: trimmedText, completed: false },
      ]);
    }
    setText("")
  }

  const toggleTodo = (id) => {
    setTodos(
      todos.map((t) =>
        t.id === id ? { ...t, completed: !t.completed } : t
      )
    );
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter((t) => t.id !== id))
  }

  const editTodo = (todo) => {
    setEditing(todo);
    setText(todo.text)
  }

  let filtered = todos
  if (filter === "active")
    filtered = filtered.filter((t) => !t.completed);
  if (filter === "completed")
    filtered = filtered.filter((t) => t.completed);

  if (search)
    filtered = filtered.filter((t) =>
      t.text.toLowerCase().includes(search.toLowerCase())
    )

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-300 font-sans selection:bg-zinc-800 flex items-start justify-center pt-20 px-4">
      <div className="w-full max-w-2xl bg-zinc-900/50 backdrop-blur-xl border border-zinc-800/50 rounded-2xl shadow-2xl overflow-hidden">
        
        {/* Header & Main Input */}
        <div className="p-6 border-b border-zinc-800/50">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-xl font-medium text-zinc-100 tracking-tight">Tasks</h1>
            <div className="flex gap-4 text-xs font-medium text-zinc-500">
              <span>{todos.filter((t) => !t.completed).length} Active</span>
              <span>{todos.filter((t) => t.completed).length} Done</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="relative flex items-center">
            <input 
              type="text" 
              placeholder="What needs to be done?" 
              value={text} 
              onChange={(e) => setText(e.target.value)}
              className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600 transition-all"
            />
            <div className="absolute right-2 flex items-center gap-2">
              {editing && (
                <button 
                  type="button" 
                  onClick={() => { setEditing(null); setText(""); }}
                  className="px-3 py-1.5 text-xs font-medium text-zinc-400 hover:text-zinc-100 transition-colors"
                >
                  Cancel
                </button>
              )}
              <button 
                type="submit"
                className="bg-zinc-100 text-zinc-900 px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-white transition-colors disabled:opacity-50"
                disabled={!text.trim()}
              >
                {editing ? "Save" : "Add"}
              </button>
            </div>
          </form>
        </div>

        {/* Filters & Search */}
        <div className="px-6 py-4 flex flex-col sm:flex-row gap-4 justify-between items-center bg-zinc-900/30">
          <input 
            placeholder="Search tasks..." 
            type="text" 
            value={search} 
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-64 bg-transparent border-b border-zinc-800 px-2 py-1 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors"
          />
          <div className="flex gap-1 bg-zinc-950/50 p-1 rounded-lg border border-zinc-800/50">
            {["all", "active", "completed"].map((f) => (
              <button 
                key={f}
                onClick={() => setFilter(f)} 
                className={`px-3 py-1 rounded-md text-xs font-medium capitalize transition-all ${
                  filter === f 
                    ? "bg-zinc-800 text-zinc-100" 
                    : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Todo List */}
        <div className="p-2 min-h-[320px] max-h-[60vh] overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="h-full flex items-center justify-center pt-20 text-sm text-zinc-600">
              No tasks found.
            </div>
          ) : (
            <div className="flex flex-col gap-1">
              {filtered.map((todo) => (
                <div 
                  key={todo.id}
                  className="group flex items-center justify-between p-3 rounded-xl hover:bg-zinc-800/30 border border-transparent hover:border-zinc-800/50 transition-all"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <button 
                      onClick={() => toggleTodo(todo.id)}
                      className={`flex-shrink-0 w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                        todo.completed 
                          ? "bg-zinc-100 border-zinc-100 text-zinc-900" 
                          : "border-zinc-700 hover:border-zinc-500 text-transparent"
                      }`}
                    >
                      <svg viewBox="0 0 14 14" fill="none" className="w-3 h-3 stroke-current stroke-[2] stroke-linecap-round stroke-linejoin-round">
                        <path d="M3 7.5L4.5 9L10.5 3" />
                      </svg>
                    </button>
                    <span className={`text-sm truncate transition-all duration-200 ${
                      todo.completed ? "text-zinc-600 line-through" : "text-zinc-200"
                    }`}>
                      {todo.text}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => editTodo(todo)}
                      className="p-1.5 text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 rounded-md transition-all text-xs font-medium"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => deleteTodo(todo.id)}
                      className="p-1.5 text-zinc-500 hover:text-red-400 hover:bg-red-400/10 rounded-md transition-all text-xs font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}