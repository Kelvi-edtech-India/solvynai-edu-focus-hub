
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Timer, Play, Pause, Square, RefreshCw, CheckCircle } from 'lucide-react';

const FocusMode = () => {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'focus' | 'shortBreak' | 'longBreak'>('focus');
  const [currentTask, setCurrentTask] = useState('');
  const [sessions, setSessions] = useState(0);
  const [treeGrowth, setTreeGrowth] = useState(0);

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

  const handleSessionComplete = () => {
    if (mode === 'focus') {
      setSessions(sessions + 1);
      // Add session duration to user's total (this would sync with Supabase)
      console.log('Focus session completed! Duration: 25 minutes');
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

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getModeColor = (currentMode: string) => {
    switch (currentMode) {
      case 'focus': return 'bg-green-500';
      case 'shortBreak': return 'bg-blue-500';
      case 'longBreak': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const getModeTitle = (currentMode: string) => {
    switch (currentMode) {
      case 'focus': return 'Focus Session';
      case 'shortBreak': return 'Short Break';
      case 'longBreak': return 'Long Break';
      default: return 'Timer';
    }
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
            <div className="flex justify-center space-x-2 mb-4">
              <Button
                variant={mode === 'focus' ? 'default' : 'outline'}
                onClick={() => switchMode('focus')}
                className={mode === 'focus' ? 'bg-green-500 hover:bg-green-600' : ''}
              >
                Focus
              </Button>
              <Button
                variant={mode === 'shortBreak' ? 'default' : 'outline'}
                onClick={() => switchMode('shortBreak')}
                className={mode === 'shortBreak' ? 'bg-blue-500 hover:bg-blue-600' : ''}
              >
                Short Break
              </Button>
              <Button
                variant={mode === 'longBreak' ? 'default' : 'outline'}
                onClick={() => switchMode('longBreak')}
                className={mode === 'longBreak' ? 'bg-purple-500 hover:bg-purple-600' : ''}
              >
                Long Break
              </Button>
            </div>
            
            <CardTitle className="text-center text-gray-900 dark:text-white">
              {getModeTitle(mode)}
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Timer Display */}
            <div className="text-center">
              <div className="text-6xl font-bold text-gray-900 dark:text-white mb-4">
                {formatTime(timeLeft)}
              </div>
              
              {/* Progress Ring */}
              <div className="relative w-32 h-32 mx-auto mb-6">
                <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
                  <circle
                    cx="60"
                    cy="60"
                    r="54"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    className="text-gray-200 dark:text-gray-700"
                  />
                  <circle
                    cx="60"
                    cy="60"
                    r="54"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={340}
                    strokeDashoffset={340 - (treeGrowth / 100) * 340}
                    className={`${getModeColor(mode)} transition-all duration-1000 ease-linear`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                    {Math.round(treeGrowth)}%
                  </span>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex justify-center space-x-4">
              <Button
                onClick={toggleTimer}
                className={`${getModeColor(mode)} hover:opacity-90 text-white px-6`}
              >
                {isActive ? (
                  <>
                    <Pause className="h-4 w-4 mr-2" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Start
                  </>
                )}
              </Button>
              
              <Button variant="outline" onClick={resetTimer}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Reset
              </Button>
            </div>

            {/* Current Task */}
            {mode === 'focus' && (
              <div className="space-y-2">
                <Label htmlFor="currentTask">What are you working on?</Label>
                <Input
                  id="currentTask"
                  placeholder="Enter your current task..."
                  value={currentTask}
                  onChange={(e) => setCurrentTask(e.target.value)}
                  className="bg-gray-50 dark:bg-gray-700"
                />
              </div>
            )}
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
            <div className="relative bg-gradient-to-t from-green-100 to-blue-100 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg p-8 h-64 overflow-hidden">
              {/* Ground */}
              <div className="absolute bottom-0 left-0 right-0 h-8 bg-green-200 dark:bg-green-800 rounded-b-lg"></div>
              
              {/* Tree */}
              <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
                {/* Trunk */}
                <div className="w-4 h-16 bg-yellow-800 dark:bg-yellow-900 mx-auto mb-0"></div>
                
                {/* Tree Crown */}
                <div className="relative">
                  <div 
                    className="w-16 h-16 bg-green-500 dark:bg-green-600 rounded-full mx-auto transition-all duration-1000 ease-out"
                    style={{
                      transform: `scale(${0.3 + (treeGrowth / 100) * 0.7})`,
                      opacity: Math.max(0.3, treeGrowth / 100)
                    }}
                  ></div>
                  
                  {/* Leaves (appear as tree grows) */}
                  {treeGrowth > 50 && (
                    <>
                      <div 
                        className="absolute -top-4 -left-6 w-8 h-8 bg-green-400 dark:bg-green-500 rounded-full transition-all duration-1000"
                        style={{ opacity: (treeGrowth - 50) / 50 }}
                      ></div>
                      <div 
                        className="absolute -top-4 -right-6 w-8 h-8 bg-green-400 dark:bg-green-500 rounded-full transition-all duration-1000"
                        style={{ opacity: (treeGrowth - 50) / 50 }}
                      ></div>
                    </>
                  )}
                  
                  {/* Flowers (appear when tree is fully grown) */}
                  {treeGrowth === 100 && (
                    <>
                      <div className="absolute -top-2 left-2 w-3 h-3 bg-pink-400 rounded-full animate-pulse"></div>
                      <div className="absolute top-2 -right-2 w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
                      <div className="absolute top-4 left-6 w-3 h-3 bg-purple-400 rounded-full animate-pulse"></div>
                    </>
                  )}
                </div>
              </div>
              
              {/* Completion Message */}
              {treeGrowth === 100 && (
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2 text-center">
                  <div className="bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow-lg border">
                    <CheckCircle className="h-5 w-5 text-green-500 mx-auto mb-1" />
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      Session Complete!
                    </span>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Statistics */}
      <Card className="bg-white dark:bg-gray-800 border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white">Session Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {sessions}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Today's Sessions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {sessions * 25}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Minutes Focused</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {Math.round(treeGrowth)}%
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Current Progress</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                87h 22m
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Time</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FocusMode;
