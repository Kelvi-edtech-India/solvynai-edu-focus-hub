
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Upload, BookOpen, FileText, CheckCircle } from 'lucide-react';

const AnswerAnalyzer = () => {
  const [analysisType, setAnalysisType] = useState<'text' | 'upload'>('text');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzeAnswer = async () => {
    setIsAnalyzing(true);
    // Here you would integrate with DeepSeek AI API
    setTimeout(() => {
      setIsAnalyzing(false);
      // Mock success
      alert('Answer sheet analyzed successfully! (Mock implementation)');
    }, 3000);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-2xl">
            <BookOpen className="h-6 w-6" />
            <span>AI Answer Sheet Analyzer</span>
          </CardTitle>
          <CardDescription className="text-purple-100">
            Get expert analysis and feedback on your answer sheets with AI-powered evaluation
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Configuration */}
        <Card className="bg-white dark:bg-gray-800 border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">Analysis Configuration</CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              Set up your answer sheet analysis requirements
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="grade">Grade</Label>
                <Select>
                  <SelectTrigger className="bg-gray-50 dark:bg-gray-700">
                    <SelectValue placeholder="Select Grade" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 12 }, (_, i) => (
                      <SelectItem key={i} value={`grade-${i + 1}`}>
                        Grade {i + 1}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Select>
                  <SelectTrigger className="bg-gray-50 dark:bg-gray-700">
                    <SelectValue placeholder="Select Subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mathematics">Mathematics</SelectItem>
                    <SelectItem value="physics">Physics</SelectItem>
                    <SelectItem value="chemistry">Chemistry</SelectItem>
                    <SelectItem value="biology">Biology</SelectItem>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="history">History</SelectItem>
                    <SelectItem value="geography">Geography</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="board">Board of Education</Label>
              <Select>
                <SelectTrigger className="bg-gray-50 dark:bg-gray-700">
                  <SelectValue placeholder="Select Board" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cbse">CBSE</SelectItem>
                  <SelectItem value="icse">ICSE</SelectItem>
                  <SelectItem value="state">State Board</SelectItem>
                  <SelectItem value="ib">IB</SelectItem>
                  <SelectItem value="cambridge">Cambridge</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Input Method</Label>
              <div className="flex space-x-2">
                <Button
                  variant={analysisType === 'text' ? 'default' : 'outline'}
                  onClick={() => setAnalysisType('text')}
                  className="flex-1"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Type Text
                </Button>
                <Button
                  variant={analysisType === 'upload' ? 'default' : 'outline'}
                  onClick={() => setAnalysisType('upload')}
                  className="flex-1"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Image
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Input Section */}
        <Card className="bg-white dark:bg-gray-800 border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">
              {analysisType === 'text' ? 'Question & Answer' : 'Upload Files'}
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              {analysisType === 'text' 
                ? 'Enter the question and student answer for analysis'
                : 'Upload question paper and answer sheet images'
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {analysisType === 'text' ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="question">Question</Label>
                  <Textarea
                    id="question"
                    placeholder="Enter the question here..."
                    className="min-h-[100px] bg-gray-50 dark:bg-gray-700"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="answer">Student Answer</Label>
                  <Textarea
                    id="answer"
                    placeholder="Enter the student's answer here..."
                    className="min-h-[200px] bg-gray-50 dark:bg-gray-700"
                  />
                </div>
              </>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Question Paper</Label>
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
                    <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-500 dark:text-gray-400 mb-2">
                      Drag and drop your question paper image
                    </p>
                    <Button variant="outline" size="sm">
                      Choose File
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Answer Sheet</Label>
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
                    <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-500 dark:text-gray-400 mb-2">
                      Drag and drop your answer sheet image
                    </p>
                    <Button variant="outline" size="sm">
                      Choose File
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Analyze Button */}
      <Card className="bg-white dark:bg-gray-800 border-0 shadow-sm">
        <CardContent className="pt-6">
          <div className="flex justify-center">
            <Button
              onClick={analyzeAnswer}
              disabled={isAnalyzing}
              className="bg-purple-500 hover:bg-purple-600 text-white px-8 py-3 text-lg"
            >
              {isAnalyzing ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Analyzing...
                </>
              ) : (
                <>
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Analyze Answer Sheet
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Sample Analysis Results (Mock) */}
      <Card className="bg-white dark:bg-gray-800 border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white">Analysis Results (Sample)</CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            AI-powered evaluation and feedback
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">Overall Score</h4>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">85/100</p>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Accuracy</h4>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">92%</p>
            </div>
            <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
              <h4 className="font-semibold text-orange-800 dark:text-orange-200 mb-2">Areas to Improve</h4>
              <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">3</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-900 dark:text-white">Detailed Feedback:</h4>
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <p className="text-gray-700 dark:text-gray-300">
                This section will show detailed AI analysis once you submit an answer for evaluation.
                The AI will provide specific suggestions, corrections, and improvement areas.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnswerAnalyzer;
