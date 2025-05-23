
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Clock, Target, TrendingUp } from 'lucide-react';
import FeatureCard from '@/components/FeatureCard';
import { FileText, BookOpen, HelpCircle, CheckSquare, Layout, Timer } from 'lucide-react';

const Dashboard = () => {
  const features = [
    {
      icon: FileText,
      title: 'Question Generator',
      description: 'Generate custom question papers with AI for any subject and grade',
      path: '/question-generator',
      gradient: 'bg-gradient-to-br from-blue-500 to-blue-600'
    },
    {
      icon: BookOpen,
      title: 'Answer Analyzer',
      description: 'Get expert analysis and feedback on your answer sheets',
      path: '/answer-analyzer',
      gradient: 'bg-gradient-to-br from-purple-500 to-purple-600'
    },
    {
      icon: HelpCircle,
      title: 'Doubt Solver',
      description: 'Solve your doubts with step-by-step AI explanations',
      path: '/doubt-solver',
      gradient: 'bg-gradient-to-br from-green-500 to-green-600'
    },
    {
      icon: CheckSquare,
      title: 'To Do List',
      description: 'Organize your tasks and boost productivity',
      path: '/todo',
      gradient: 'bg-gradient-to-br from-orange-500 to-orange-600'
    },
    {
      icon: Layout,
      title: 'Kanban Board',
      description: 'Visualize your workflow with our kanban system',
      path: '/kanban',
      gradient: 'bg-gradient-to-br from-pink-500 to-pink-600'
    },
    {
      icon: Timer,
      title: 'Focus Mode',
      description: 'Enhance concentration with pomodoro sessions',
      path: '/focus',
      gradient: 'bg-gradient-to-br from-indigo-500 to-indigo-600'
    }
  ];

  const leaderboardData = [
    { rank: 1, name: 'Alice Johnson', school: 'Springfield High', duration: '145h 30m' },
    { rank: 2, name: 'Bob Smith', school: 'Riverside Academy', duration: '132h 15m' },
    { rank: 3, name: 'Carol Davis', school: 'Oakwood School', duration: '128h 45m' },
    { rank: 4, name: 'David Wilson', school: 'Pine Valley High', duration: '115h 20m' },
    { rank: 5, name: 'Emma Brown', school: 'Cedar Grove School', duration: '108h 35m' },
  ];

  const userRank = { rank: 12, name: 'John Doe', school: 'Maple High School', duration: '87h 22m' };

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Welcome back, John! 🎓</h1>
        <p className="text-green-100 text-lg">Ready to enhance your learning journey with AI-powered tools?</p>
      </div>

      {/* User Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-white dark:bg-gray-800 border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Focus Sessions
            </CardTitle>
            <Clock className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">87h 22m</div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              +2h 15m from yesterday
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Tasks Completed
            </CardTitle>
            <Target className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">24</div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              +3 from yesterday
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Current Rank
            </CardTitle>
            <Trophy className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">#12</div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              +2 positions up
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Productivity
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">92%</div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              +5% from last week
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Focus Leaderboard */}
      <Card className="bg-white dark:bg-gray-800 border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-gray-900 dark:text-white">
            <Trophy className="h-5 w-5 text-yellow-500" />
            <span>Focus Leaderboard</span>
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            Top performers by focus session duration
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Top 5 */}
            <div className="space-y-3">
              {leaderboardData.map((user) => (
                <div key={user.rank} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                  <div className="flex items-center space-x-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      user.rank === 1 ? 'bg-yellow-100 text-yellow-800' :
                      user.rank === 2 ? 'bg-gray-100 text-gray-800' :
                      user.rank === 3 ? 'bg-orange-100 text-orange-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {user.rank}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">{user.name}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{user.school}</div>
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    {user.duration}
                  </Badge>
                </div>
              ))}
            </div>

            {/* User's Rank */}
            <div className="border-t pt-4 mt-4 border-gray-200 dark:border-gray-600">
              <div className="flex items-center justify-between p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center text-sm font-bold">
                    {userRank.rank}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">{userRank.name} (You)</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{userRank.school}</div>
                  </div>
                </div>
                <Badge className="bg-green-500 text-white">
                  {userRank.duration}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Access Features */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Quick Access</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
