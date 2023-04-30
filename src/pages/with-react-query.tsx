import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

const fetchTodos = async () => {
  const res = await fetch('/api/todos')
  return res.json()
}

const postTodos = async (text: string) => {
  return await fetch("/api/todos", {
    method: "POST",
    headers: {
      contentType: "application/json",
    },
    body: JSON.stringify({ text: text }),
  }).then((res) => res.json())
}

const deleteTodo = async (id: string) => {
  return await fetch(`/api/todos/${id}`, {
    method: "DELETE",
  })
}

export default function WithReactQueryPage() {
  const queryClient = useQueryClient()
  const [todoText, setTodoText] = useState("")
  const { data, error, isLoading } = useQuery<Array<{ id: string, text: string }>>(["todos"], fetchTodos)
  const addTodoAction = useMutation(postTodos, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] })
      setTodoText("")
    }
  })
  const deleteTodoAction = useMutation(deleteTodo, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] })
    }
  })


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
              onChange={(e) => setTodoText(e.currentTarget.value)}
            />
          </div>
          <button className="ml-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => {
            addTodoAction.mutate(todoText)
          }}>
            Add
          </button>
        </div>
      </div>
      <div>
        {isLoading && <p>Loading...</p>}
        {!isLoading && !error && data && (
          <ul className="w-1/2">
            {data.map((todo) => (
              <li key={todo.id} className="flex justify-between mb-2">
                <span>{todo.text}</span>
                <button className="ml-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" onClick={() => {
                  deleteTodoAction.mutate(todo.id)
                }}>
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
