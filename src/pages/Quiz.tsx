
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Brain, CheckCircle, XCircle, RotateCcw, Play } from 'lucide-react';
import { useAI } from '@/hooks/useAI';
import { toast } from 'sonner';

interface Question {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

interface QuizResult {
  score: number;
  totalQuestions: number;
  percentage: number;
  answers: { questionIndex: number; selected: number; correct: number }[];
}

const Quiz = () => {
  const [grade, setGrade] = useState('');
  const [board, setBoard] = useState('');
  const [subject, setSubject] = useState('');
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [numQuestions, setNumQuestions] = useState(5);
  const [customNumQuestions, setCustomNumQuestions] = useState('');
  const [userType, setUserType] = useState<'student' | 'teacher'>('student');
  const [customPrompt, setCustomPrompt] = useState('');
  
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);

  const { callAI, loading } = useAI();

  const finalNumQuestions = numQuestions === 0 ? parseInt(customNumQuestions) || 5 : numQuestions;

  const generateQuiz = async () => {
    if (!subject.trim() || !topic.trim() || !grade.trim() || !board.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (numQuestions === 0 && (!customNumQuestions || parseInt(customNumQuestions) <= 0)) {
      toast.error('Please enter a valid number of questions');
      return;
    }

    const prompt = `Create a ${difficulty} level quiz for ${grade} grade students following ${board} board curriculum about ${topic} in ${subject}. 
    Generate exactly ${finalNumQuestions} multiple choice questions with 4 options each.
    ${userType === 'teacher' ? 'Make this suitable for testing students and include detailed explanations.' : 'Make this educational and engaging for learning.'}
    ${customPrompt ? `Additional requirements: ${customPrompt}` : ''}
    
    Format the response as a JSON array with this structure:
    [
      {
        "question": "Question text here",
        "options": ["Option A", "Option B", "Option C", "Option D"],
        "correctAnswer": 0,
        "explanation": "Explanation of why this is correct"
      }
    ]
    
    Make sure:
    - Questions are appropriate for ${grade} grade level
    - Content aligns with ${board} board curriculum standards
    - Questions are clear and unambiguous
    - Options are plausible but only one is clearly correct
    - Include explanations for each correct answer
    - Questions cover different aspects of the topic
    - Difficulty matches the requested level`;

    try {
      const response = await callAI(prompt, 'question-generator');
      
      if (response?.response) {
        try {
          // Extract JSON from the response
          const jsonMatch = response.response.match(/\[[\s\S]*\]/);
          if (jsonMatch) {
            const parsedQuestions = JSON.parse(jsonMatch[0]);
            setQuestions(parsedQuestions);
            setQuizStarted(true);
            setCurrentQuestionIndex(0);
            setSelectedAnswers(new Array(parsedQuestions.length).fill(-1));
            setSelectedAnswer(null);
            setQuizCompleted(false);
            setQuizResult(null);
            toast.success('Quiz generated successfully!');
          } else {
            throw new Error('Invalid response format');
          }
        } catch (parseError) {
          console.error('Error parsing questions:', parseError);
          toast.error('Error parsing quiz questions. Please try again.');
        }
      }
    } catch (error) {
      console.error('Error generating quiz:', error);
      toast.error('Failed to generate quiz. Please try again.');
    }
  };

  const handleAnswerSelect = (optionIndex: number) => {
    setSelectedAnswer(optionIndex);
  };

  const handleNextQuestion = () => {
    if (selectedAnswer !== null) {
      const newAnswers = [...selectedAnswers];
      newAnswers[currentQuestionIndex] = selectedAnswer;
      setSelectedAnswers(newAnswers);

      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedAnswer(newAnswers[currentQuestionIndex + 1] !== -1 ? newAnswers[currentQuestionIndex + 1] : null);
      } else {
        completeQuiz(newAnswers);
      }
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setSelectedAnswer(selectedAnswers[currentQuestionIndex - 1] !== -1 ? selectedAnswers[currentQuestionIndex - 1] : null);
    }
  };

  const completeQuiz = (finalAnswers: number[]) => {
    let correctCount = 0;
    const answerDetails = finalAnswers.map((selected, index) => {
      const correct = questions[index].correctAnswer;
      if (selected === correct) correctCount++;
      return {
        questionIndex: index,
        selected,
        correct
      };
    });

    const result: QuizResult = {
      score: correctCount,
      totalQuestions: questions.length,
      percentage: Math.round((correctCount / questions.length) * 100),
      answers: answerDetails
    };

    setQuizResult(result);
    setQuizCompleted(true);
  };

  const resetQuiz = () => {
    setQuizStarted(false);
    setQuizCompleted(false);
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setSelectedAnswers([]);
    setSelectedAnswer(null);
    setQuizResult(null);
  };

  const currentQuestion = questions[currentQuestionIndex];
  const progress = questions.length > 0 ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0;

  if (quizCompleted && quizResult) {
    return (
      <div className="p-6 max-w-4xl mx-auto space-y-6">
        <Card className="bg-gradient-to-r from-green-500 to-blue-600 text-white border-0">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-2xl">
              <CheckCircle className="h-6 w-6" />
              <span>Quiz Completed!</span>
            </CardTitle>
            <CardDescription className="text-green-100">
              Great job! Here are your results
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="bg-white dark:bg-gray-800 border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-center text-2xl text-gray-900 dark:text-white">
              Your Score: {quizResult.score}/{quizResult.totalQuestions}
            </CardTitle>
            <div className="text-center">
              <div className={`text-4xl font-bold ${
                quizResult.percentage >= 80 ? 'text-green-500' :
                quizResult.percentage >= 60 ? 'text-yellow-500' : 'text-red-500'
              }`}>
                {quizResult.percentage}%
              </div>
              <Badge className={`mt-2 ${
                quizResult.percentage >= 80 ? 'bg-green-500' :
                quizResult.percentage >= 60 ? 'bg-yellow-500' : 'bg-red-500'
              }`}>
                {quizResult.percentage >= 80 ? 'Excellent!' :
                 quizResult.percentage >= 60 ? 'Good Job!' : 'Keep Practicing!'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Review Your Answers:</h3>
              {questions.map((question, index) => {
                const userAnswer = quizResult.answers[index];
                const isCorrect = userAnswer.selected === userAnswer.correct;
                
                return (
                  <div key={index} className={`p-4 rounded-lg border ${
                    isCorrect ? 'bg-green-50 border-green-200 dark:bg-green-900/20' : 
                    'bg-red-50 border-red-200 dark:bg-red-900/20'
                  }`}>
                    <div className="flex items-start space-x-2">
                      {isCorrect ? 
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" /> :
                        <XCircle className="h-5 w-5 text-red-500 mt-0.5" />
                      }
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 dark:text-white">
                          {index + 1}. {question.question}
                        </p>
                        <p className={`text-sm mt-1 ${isCorrect ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}`}>
                          Your answer: {question.options[userAnswer.selected]}
                        </p>
                        {!isCorrect && (
                          <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                            Correct answer: {question.options[userAnswer.correct]}
                          </p>
                        )}
                        {question.explanation && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                            <strong>Explanation:</strong> {question.explanation}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="mt-6 flex justify-center">
              <Button onClick={resetQuiz} className="bg-blue-500 hover:bg-blue-600">
                <RotateCcw className="h-4 w-4 mr-2" />
                Take Another Quiz
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (quizStarted && questions.length > 0) {
    return (
      <div className="p-6 max-w-4xl mx-auto space-y-6">
        <Card className="bg-gradient-to-r from-purple-500 to-pink-600 text-white border-0">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-2xl">
              <Brain className="h-6 w-6" />
              <span>Quiz in Progress</span>
            </CardTitle>
            <CardDescription className="text-purple-100">
              Question {currentQuestionIndex + 1} of {questions.length}
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="bg-white dark:bg-gray-800 border-0 shadow-sm">
          <CardHeader>
            <div className="space-y-4">
              <Progress value={progress} className="w-full" />
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                <span>Progress: {Math.round(progress)}%</span>
                <span>{currentQuestionIndex + 1}/{questions.length}</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {currentQuestion.question}
              </h2>
              
              <RadioGroup value={selectedAnswer?.toString()} onValueChange={(value) => handleAnswerSelect(parseInt(value))}>
                {currentQuestion.options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                    <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>

              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={handlePreviousQuestion}
                  disabled={currentQuestionIndex === 0}
                >
                  Previous
                </Button>
                
                <Button
                  onClick={handleNextQuestion}
                  disabled={selectedAnswer === null}
                  className="bg-purple-500 hover:bg-purple-600"
                >
                  {currentQuestionIndex === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-2xl">
            <BookOpen className="h-6 w-6" />
            <span>AI-Powered Quiz Generator</span>
          </CardTitle>
          <CardDescription className="text-blue-100">
            Create personalized quizzes powered by AI for any subject and difficulty level
          </CardDescription>
        </CardHeader>
      </Card>

      <Card className="bg-white dark:bg-gray-800 border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white">Quiz Configuration</CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            Set up your quiz parameters and let AI create the perfect quiz for you
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="userType">I am a:</Label>
                <Select value={userType} onValueChange={(value: 'student' | 'teacher') => setUserType(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="teacher">Teacher</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="grade">Grade *</Label>
                <Input
                  id="grade"
                  placeholder="e.g., 10th, 12th, Bachelor's, etc."
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="board">Board of Education *</Label>
                <Input
                  id="board"
                  placeholder="e.g., CBSE, ICSE, State Board, IB, etc."
                  value={board}
                  onChange={(e) => setBoard(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Subject *</Label>
                <Input
                  id="subject"
                  placeholder="e.g., Mathematics, History, Science"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="topic">Topic *</Label>
                <Input
                  id="topic"
                  placeholder="e.g., Quadratic Equations, World War II, Photosynthesis"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="difficulty">Difficulty Level</Label>
                <Select value={difficulty} onValueChange={(value: 'easy' | 'medium' | 'hard') => setDifficulty(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="numQuestions">Number of Questions</Label>
                <Select value={numQuestions.toString()} onValueChange={(value) => setNumQuestions(parseInt(value))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 Questions</SelectItem>
                    <SelectItem value="10">10 Questions</SelectItem>
                    <SelectItem value="15">15 Questions</SelectItem>
                    <SelectItem value="20">20 Questions</SelectItem>
                    <SelectItem value="0">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {numQuestions === 0 && (
                <div className="space-y-2">
                  <Label htmlFor="customNumQuestions">Custom Number of Questions</Label>
                  <Input
                    id="customNumQuestions"
                    type="number"
                    placeholder="Enter number of questions"
                    value={customNumQuestions}
                    onChange={(e) => setCustomNumQuestions(e.target.value)}
                    min="1"
                    max="50"
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="customPrompt">Additional Requirements (Optional)</Label>
                <Textarea
                  id="customPrompt"
                  placeholder="e.g., Focus on practical applications, Include diagrams descriptions, Cover specific chapters..."
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  rows={3}
                />
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-center">
            <Button
              onClick={generateQuiz}
              disabled={loading || !subject.trim() || !topic.trim() || !grade.trim() || !board.trim()}
              className="bg-blue-500 hover:bg-blue-600 px-8"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Generating Quiz...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Generate Quiz
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Quiz;
