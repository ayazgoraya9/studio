import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Check, Plus, Trash, Moon, Sun } from 'lucide-react'
import { Input } from '@/components/ui/input'

export default async function Page() {
  const supabase = createClient();
  const { data: todos } = await supabase.from('todos').select();

  return (
    <div className="dark">
      <div className="flex justify-center items-center min-h-screen bg-background font-sans p-4">
        <div className="absolute top-4 right-4 flex items-center">
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
        </div>
        <Card className="w-full max-w-2xl bg-card/50 backdrop-blur-sm border-primary/20 glow-shadow">
          <CardHeader className="text-center">
            <CardTitle className="text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60 py-2">
              Todo List
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              A futuristic and sleek todo list application.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {todos?.map(todo => (
                <div
                  key={todo.id}
                  className={`flex items-center p-4 rounded-lg transition-all duration-300 border ${
                    todo.completed 
                      ? 'border-green-500/20 bg-green-500/10' 
                      : 'border-secondary bg-secondary/50'
                  }`}
                >
                  <div className="flex-1">
                    <p className={`text-lg ${todo.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                      {todo.task}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`rounded-full transition-colors ${
                        todo.completed 
                          ? 'text-green-400 hover:bg-green-500/20' 
                          : 'text-muted-foreground hover:text-primary'
                      }`}
                    >
                      <Check className="w-6 h-6" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive rounded-full transition-colors">
                      <Trash className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between items-center p-6 bg-card/30 rounded-b-lg">
            <div className="relative flex-grow">
                 <Input 
                    type="text" 
                    placeholder="Add a new todo..." 
                    className="pr-12 bg-background/70 border-primary/30 focus:ring-primary/50"
                 />
                <Button variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-primary hover:bg-primary/10">
                    <Plus/>
                </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
