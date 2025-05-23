
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import QuestionGenerator from "./pages/QuestionGenerator";
import AnswerAnalyzer from "./pages/AnswerAnalyzer";
import DoubtSolver from "./pages/DoubtSolver";
import TodoList from "./pages/TodoList";
import KanbanBoard from "./pages/KanbanBoard";
import FocusMode from "./pages/FocusMode";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
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
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
