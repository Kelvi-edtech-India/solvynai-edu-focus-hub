
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Timer } from 'lucide-react';
import FocusTimer from '@/components/focus/FocusTimer';
import FocusModeControls from '@/components/focus/FocusModeControls';
import FocusTreeVisualization from '@/components/focus/FocusTreeVisualization';
import FocusStatistics from '@/components/focus/FocusStatistics';
import { useFocusSession } from '@/hooks/useFocusSession';

const FocusMode = () => {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'focus' | 'shortBreak' | 'longBreak'>('focus');
  const [currentTask, setCurrentTask] = useState('');
  const [treeGrowth, setTreeGrowth] = useState(0);
  
  const { sessions, totalFocusTime, saveFocusSession } = useFocusSession();

  const presets = {
    focus: 25 * 60,
    shortBreak: 5 * 60,
    longBreak: 15 * 60
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => {
          const newTime = time - 1;
          // Update tree growth based on progress
          const totalTime = presets[mode];
          const progress = ((totalTime - newTime) / totalTime) * 100;
          setTreeGrowth(Math.min(progress, 100));
          return newTime;
        });
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      handleSessionComplete();
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft, mode]);

  const handleSessionComplete = async () => {
    if (mode === 'focus') {
      // Save the focus session to database
      await saveFocusSession(25, currentTask);
    }
    
    // Auto-switch to break mode
    if (mode === 'focus') {
      const nextMode = sessions > 0 && (sessions + 1) % 4 === 0 ? 'longBreak' : 'shortBreak';
      setMode(nextMode);
      setTimeLeft(presets[nextMode]);
    } else {
      setMode('focus');
      setTimeLeft(presets.focus);
    }
    
    setTreeGrowth(0);
  };

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(presets[mode]);
    setTreeGrowth(0);
  };

  const switchMode = (newMode: 'focus' | 'shortBreak' | 'longBreak') => {
    setMode(newMode);
    setTimeLeft(presets[newMode]);
    setIsActive(false);
    setTreeGrowth(0);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white border-0">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-2xl">
            <Timer className="h-6 w-6" />
            <span>Focus Mode</span>
          </CardTitle>
          <CardDescription className="text-indigo-100">
            Enhance your concentration with pomodoro sessions and watch your tree grow
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Timer Section */}
        <Card className="bg-white dark:bg-gray-800 border-0 shadow-sm">
          <CardHeader>
            <FocusModeControls mode={mode} onSwitchMode={switchMode} />
          </CardHeader>
          
          <CardContent>
            <FocusTimer
              timeLeft={timeLeft}
              isActive={isActive}
              mode={mode}
              currentTask={currentTask}
              treeGrowth={treeGrowth}
              onToggleTimer={toggleTimer}
              onResetTimer={resetTimer}
              onTaskChange={setCurrentTask}
            />
          </CardContent>
        </Card>

        {/* Tree Growth Visualization */}
        <Card className="bg-white dark:bg-gray-800 border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">Your Focus Tree</CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              Watch your tree grow as you stay focused
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <FocusTreeVisualization treeGrowth={treeGrowth} />
          </CardContent>
        </Card>
      </div>

      {/* Statistics */}
      <Card className="bg-white dark:bg-gray-800 border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white">Session Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <FocusStatistics sessions={sessions} treeGrowth={treeGrowth} />
        </CardContent>
      </Card>
    </div>
  );
};

export default FocusMode;
