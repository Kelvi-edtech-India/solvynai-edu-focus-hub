
import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "@/components/Layout";
import ProtectedRoute from "@/components/ProtectedRoute";
import "./App.css";

const Index = lazy(() => import("@/pages/Index"));
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const Profile = lazy(() => import("@/pages/Profile"));
const TodoList = lazy(() => import("@/pages/TodoList"));
const KanbanBoard = lazy(() => import("@/pages/KanbanBoard"));
const QuestionGenerator = lazy(() => import("@/pages/QuestionGenerator"));
const AnswerAnalyzer = lazy(() => import("@/pages/AnswerAnalyzer"));
const DoubtSolver = lazy(() => import("@/pages/DoubtSolver"));
const FocusMode = lazy(() => import("@/pages/FocusMode"));
const Auth = lazy(() => import("@/pages/Auth"));
const NotFound = lazy(() => import("@/pages/NotFound"));

function App() {
  return (
    <div className="min-h-screen bg-background">
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="profile" element={<Profile />} />
            <Route path="question-generator" element={<QuestionGenerator />} />
            <Route path="answer-analyzer" element={<AnswerAnalyzer />} />
            <Route path="doubt-solver" element={<DoubtSolver />} />
            <Route path="todo" element={<TodoList />} />
            <Route path="kanban" element={<KanbanBoard />} />
            <Route path="focus" element={<FocusMode />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;
