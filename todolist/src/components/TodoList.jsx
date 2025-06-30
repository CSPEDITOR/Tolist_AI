import React, { useState } from "react";
import "../index.css"; // Tailwind
import GeminiPopup from "./Geminipopup";
// ✅ Import from separate file

function TodoList() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");

  const addTodo = () => {
    if (newTodo.trim() !== "") {
      setTodos([...todos, newTodo]);
      setNewTodo("");
    }
  };

  const deleteTodo = (indexToDelete) => {
    setTodos(todos.filter((_, i) => i !== indexToDelete));
  };

  const handleInput = (e) => setNewTodo(e.target.value);

  const enter = (e) => {
    e.preventDefault();
    addTodo();
  };

  const handleAddTask = (task) => setTodos((prev) => [...prev, task]);

  const handleDeleteAll = () => setTodos([]);

  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black min-h-screen text-white flex items-center justify-center p-6">
      <form
        className="bg-gray-950 p-8 rounded-2xl shadow-2xl w-[70%] max-w-md"
        onSubmit={enter}
      >
        <h1 className="text-3xl font-bold text-center mb-6 text-blue-400">
          🌟 Todo List{" "}
          {todos.length > 0 && (
            <span className={todos.length === 1 ? "text-red-500" : "text-green-400"}>
              {todos.length}
            </span>
          )}
        </h1>

        <div className="flex gap-3 mb-6">
          <input
            className="flex-1 px-4 py-2 rounded-xl bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={newTodo}
            onChange={handleInput}
            placeholder="Enter your task..."
          />
          <button
            type="submit"
            onClick={addTodo}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-xl transition duration-200"
          >
            Add
          </button>
        </div>

        <div>
          <ol className="space-y-3 max-h-[250px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
            {todos.length > 0 ? (
              todos.map((todo, index) => (
                <li
                  key={index}
                  className="bg-gray-800 w-[90%] mx-auto px-4 py-2 rounded-xl border border-gray-700 flex justify-between items-center hover:bg-gray-600 transition duration-200 break-words"
                >
                  <span>
                    {index + 1}. {todo}
                  </span>
                  <button
                    onClick={() => deleteTodo(index)}
                    className="ml-4 bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-sm"
                  >
                    🗑️ Delete
                  </button>
                </li>
              ))
            ) : (
              <p className="text-center text-gray-400">No tasks added yet 🚀</p>
            )}
          </ol>
        </div>
      </form>

      {/* ✅ Use GeminiPopup as an imported component */}
      <GeminiPopup onAddTask={handleAddTask} onDeleteAll={handleDeleteAll}/>
      
    </div>
  );
}

export default TodoList;
