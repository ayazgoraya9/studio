import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Check, Plus, Trash } from 'lucide-react'

export default function Page() {
  const todos = [
    { id: 1, text: 'Do the dishes', completed: false },
    { id: 2, text: 'Walk the dog', completed: true },
    { id: 3, text: 'Finish the project', completed: false },
  ];

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <Card className="w-full max-w-lg shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center text-gray-800 dark:text-gray-200">
            Todo List
          </CardTitle>
          <CardDescription className="text-center text-gray-500 dark:text-gray-400">
            A simple and attractive todo list application.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {todos.map(todo => (
              <div
                key={todo.id}
                className={`flex items-center p-4 rounded-lg transition-all duration-300 ${
                  todo.completed ? 'bg-green-100 dark:bg-green-900/50' : 'bg-white dark:bg-gray-800'
                }`}
              >
                <div className="flex-1">
                  <p className={`text-lg ${todo.completed ? 'line-through text-gray-500' : 'text-gray-800 dark:text-gray-200'}`}>
                    {todo.text}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`rounded-full ${todo.completed ? 'text-green-500' : 'text-gray-400 hover:text-green-500'}`}
                  >
                    <Check className="w-6 h-6" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-gray-400 hover:text-red-500 rounded-full">
                    <Trash className="w-6 h-6" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between items-center p-6">
          <Button variant="outline" className="w-full">
            <Plus className="mr-2" />
            Add New Todo
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
