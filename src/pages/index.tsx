import { useState, useEffect } from "react"

export default function Home() {

  const [data, setData] = useState<Array<{ id: string, text: string }> | null>(null)
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [todoText, setTodoText] = useState("")

  const fetchTodos = async () => {
    setIsLoading(true)
    await fetch('/api/todos')
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch((error) => setError(error))
      .finally(() => setIsLoading(false))
  }

  useEffect(() => {
    fetchTodos()
  }, [])

  const handleAddNewTodo = async () => {
    await fetch("/api/todos", {
      method: "POST",
      headers: {
        contentType: "application/json",
      },
      body: JSON.stringify({ text: todoText }),
    }).then((res) => res.json())
      .then(() => fetchTodos())
      .finally(() => {
        setTodoText("")
      })
  }

  const handleDeleteTodo = async (id: string) => {
    setIsLoading(true)
    await fetch(`/api/todos/${id}`, {
      method: "DELETE",
    })
      .then(() => fetchTodos())
      .catch((error) => setError(error))
      .finally(() => setIsLoading(false))
  }

  return (
    <main
      className={`flex flex-col justify-between p-24`}
    >
      <h1>Todo</h1>
      <div className="mb-6">
        <div className="flex">
          <div>
            <label htmlFor="todo-text" className="block mb-2 text-gray-900">Text</label>
            <input
              id="todo-text"
              type="text"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-[200px] p-2.5"
              placeholder="Task"
              value={todoText}
              onChange={(e) => setTodoText(e.currentTarget.value)} />
          </div>
          <button className="ml-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={handleAddNewTodo}>
            Add
          </button>
        </div>
      </div>
      <div>
        {isLoading && <p>Loading...</p>}
        {!isLoading && !error && data && (
          <ul>
            {data.map((todo) => (
              <li key={todo.id} className="flex justify-between">
                <div>{todo.text}</div>
                <button className="ml-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" onClick={() => handleDeleteTodo(todo.id)}>
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  )
}
