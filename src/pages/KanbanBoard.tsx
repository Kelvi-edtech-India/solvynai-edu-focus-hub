
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Layout, Plus, MoreHorizontal, User, Calendar } from 'lucide-react';
import { useTasks, Task } from '@/hooks/useTasks';

interface Column {
  id: string;
  title: string;
  tasks: Task[];
}

const KanbanBoard = () => {
  const { tasks, loading, error, addTask, updateTask } = useTasks();
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [activeColumn, setActiveColumn] = useState<string | null>(null);

  const handleAddTask = async (columnId: string) => {
    if (newTaskTitle.trim()) {
      await addTask({
        title: newTaskTitle.trim(),
        priority: 'medium',
        status: columnId as 'todo' | 'in-progress' | 'review' | 'done',
        description: ''
      });
      
      setNewTaskTitle('');
      setActiveColumn(null);
    }
  };

  const moveTask = async (taskId: string, newStatus: string) => {
    await updateTask(taskId, { status: newStatus as 'todo' | 'in-progress' | 'review' | 'done' });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  const getColumnColor = (columnId: string) => {
    switch (columnId) {
      case 'todo': return 'border-t-4 border-t-blue-500';
      case 'in-progress': return 'border-t-4 border-t-yellow-500';
      case 'review': return 'border-t-4 border-t-purple-500';
      case 'done': return 'border-t-4 border-t-green-500';
      default: return 'border-t-4 border-t-gray-500';
    }
  };

  const columns: Column[] = [
    {
      id: 'todo',
      title: 'To Do',
      tasks: tasks.filter(task => task.status === 'todo')
    },
    {
      id: 'in-progress',
      title: 'In Progress',
      tasks: tasks.filter(task => task.status === 'in-progress')
    },
    {
      id: 'review',
      title: 'Review',
      tasks: tasks.filter(task => task.status === 'review')
    },
    {
      id: 'done',
      title: 'Done',
      tasks: tasks.filter(task => task.status === 'done')
    }
  ];

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading tasks...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 space-y-6">
        <Card className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
          <CardHeader>
            <CardTitle className="text-red-800 dark:text-red-200">Error</CardTitle>
            <CardDescription className="text-red-700 dark:text-red-300">
              {error}
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-pink-500 to-pink-600 text-white border-0">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-2xl">
            <Layout className="h-6 w-6" />
            <span>Kanban Board</span>
          </CardTitle>
          <CardDescription className="text-pink-100">
            Visualize your workflow and track task progress
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {columns.map((column) => (
          <Card key={column.id} className={`bg-white dark:bg-gray-800 border-0 shadow-sm ${getColumnColor(column.id)}`}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg text-gray-900 dark:text-white">
                  {column.title}
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary" className="text-xs">
                    {column.tasks.length}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setActiveColumn(column.id)}
                    className="h-6 w-6 p-0"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-3">
              {/* Add Task Input */}
              {activeColumn === column.id && (
                <div className="space-y-2">
                  <Input
                    placeholder="Enter task title"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddTask(column.id)}
                    className="bg-gray-50 dark:bg-gray-700 text-sm"
                  />
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      onClick={() => handleAddTask(column.id)}
                      className="flex-1"
                    >
                      Add
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setActiveColumn(null)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}

              {/* Tasks */}
              {column.tasks.map((task) => (
                <Card key={task.id} className="border border-gray-200 dark:border-gray-600 hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-3">
                    <div className="space-y-2">
                      <div className="flex items-start justify-between">
                        <h4 className="font-medium text-sm text-gray-900 dark:text-white leading-tight">
                          {task.title}
                        </h4>
                        <div className="relative">
                          <Button variant="ghost" size="sm" className="h-5 w-5 p-0">
                            <MoreHorizontal className="h-3 w-3" />
                          </Button>
                          {/* You can add a dropdown menu here for task actions */}
                        </div>
                      </div>
                      
                      {task.description && (
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {task.description}
                        </p>
                      )}
                      
                      <div className="flex items-center justify-between">
                        <Badge className={`${getPriorityColor(task.priority)} text-xs`}>
                          {task.priority}
                        </Badge>
                        
                        {task.due_date && (
                          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                            <Calendar className="h-3 w-3 mr-1" />
                            {new Date(task.due_date).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                        <User className="h-3 w-3 mr-1" />
                        You
                      </div>

                      {/* Move task buttons */}
                      <div className="flex space-x-1 pt-2">
                        {column.id !== 'todo' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              const newStatus = column.id === 'in-progress' ? 'todo' : 
                                             column.id === 'review' ? 'in-progress' : 'review';
                              moveTask(task.id, newStatus);
                            }}
                            className="text-xs px-2 py-1 h-6"
                          >
                            ←
                          </Button>
                        )}
                        {column.id !== 'done' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              const newStatus = column.id === 'todo' ? 'in-progress' : 
                                             column.id === 'in-progress' ? 'review' : 'done';
                              moveTask(task.id, newStatus);
                            }}
                            className="text-xs px-2 py-1 h-6"
                          >
                            →
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* Add Task Button */}
              {activeColumn !== column.id && (
                <Button
                  variant="ghost"
                  onClick={() => setActiveColumn(column.id)}
                  className="w-full justify-start text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add a task
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Board Stats */}
      <Card className="bg-white dark:bg-gray-800 border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white">Board Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {columns.find(c => c.id === 'todo')?.tasks.length || 0}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">To Do</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                {columns.find(c => c.id === 'in-progress')?.tasks.length || 0}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">In Progress</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {columns.find(c => c.id === 'review')?.tasks.length || 0}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Review</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {columns.find(c => c.id === 'done')?.tasks.length || 0}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Done</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default KanbanBoard;
