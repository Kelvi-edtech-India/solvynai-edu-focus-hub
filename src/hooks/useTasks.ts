
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed?: boolean;
  priority: 'low' | 'medium' | 'high';
  status: 'todo' | 'in-progress' | 'review' | 'done';
  due_date?: string;
  user_id?: string;
  created_at?: string;
  updated_at?: string;
}

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all tasks for the current user
  const fetchTasks = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setError('User not authenticated');
        return;
      }

      const { data, error: fetchError } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (fetchError) {
        console.error('Error fetching tasks:', fetchError);
        setError(fetchError.message);
        return;
      }

      setTasks(data || []);
      setError(null);
    } catch (err) {
      console.error('Error in fetchTasks:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Add a new task
  const addTask = async (taskData: Omit<Task, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error('User not authenticated');
        return null;
      }

      const { data, error: insertError } = await supabase
        .from('tasks')
        .insert([{
          ...taskData,
          user_id: user.id,
          completed_at: taskData.status === 'done' ? new Date().toISOString() : null
        }])
        .select()
        .single();

      if (insertError) {
        console.error('Error adding task:', insertError);
        toast.error('Failed to add task');
        return null;
      }

      setTasks(prev => [data, ...prev]);
      toast.success('Task added successfully');
      return data;
    } catch (err) {
      console.error('Error in addTask:', err);
      toast.error('An error occurred while adding the task');
      return null;
    }
  };

  // Update a task
  const updateTask = async (id: string, updates: Partial<Task>) => {
    try {
      const { data, error: updateError } = await supabase
        .from('tasks')
        .update({
          ...updates,
          completed_at: updates.status === 'done' ? new Date().toISOString() : null,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (updateError) {
        console.error('Error updating task:', updateError);
        toast.error('Failed to update task');
        return null;
      }

      setTasks(prev => prev.map(task => task.id === id ? data : task));
      toast.success('Task updated successfully');
      return data;
    } catch (err) {
      console.error('Error in updateTask:', err);
      toast.error('An error occurred while updating the task');
      return null;
    }
  };

  // Delete a task
  const deleteTask = async (id: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);

      if (deleteError) {
        console.error('Error deleting task:', deleteError);
        toast.error('Failed to delete task');
        return false;
      }

      setTasks(prev => prev.filter(task => task.id !== id));
      toast.success('Task deleted successfully');
      return true;
    } catch (err) {
      console.error('Error in deleteTask:', err);
      toast.error('An error occurred while deleting the task');
      return false;
    }
  };

  // Toggle task completion
  const toggleTask = async (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    const newStatus = task.status === 'done' ? 'todo' : 'done';
    return updateTask(id, { status: newStatus });
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return {
    tasks,
    loading,
    error,
    addTask,
    updateTask,
    deleteTask,
    toggleTask,
    refetch: fetchTasks
  };
}
