
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { FileText, Plus, Trash2, Download, Eye } from 'lucide-react';

interface Chapter {
  id: string;
  name: string;
  mcq: number;
  twoMark: number;
  threeMark: number;
  fourMark: number;
  fiveMark: number;
  sixMark: number;
}

const QuestionGenerator = () => {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [chapterInput, setChapterInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const addChapter = () => {
    if (chapterInput.trim()) {
      const newChapter: Chapter = {
        id: Date.now().toString(),
        name: chapterInput.trim(),
        mcq: 0,
        twoMark: 0,
        threeMark: 0,
        fourMark: 0,
        fiveMark: 0,
        sixMark: 0,
      };
      setChapters([...chapters, newChapter]);
      setChapterInput('');
    }
  };

  const removeChapter = (id: string) => {
    setChapters(chapters.filter(chapter => chapter.id !== id));
  };

  const updateChapterQuestions = (id: string, field: keyof Omit<Chapter, 'id' | 'name'>, value: number) => {
    setChapters(chapters.map(chapter => 
      chapter.id === id ? { ...chapter, [field]: value } : chapter
    ));
  };

  const generateQuestionPaper = async () => {
    setIsGenerating(true);
    // Here you would integrate with DeepSeek AI API
    setTimeout(() => {
      setIsGenerating(false);
      // Mock success
      alert('Question paper generated successfully! (Mock implementation)');
    }, 3000);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-2xl">
            <FileText className="h-6 w-6" />
            <span>AI Question Paper Generator</span>
          </CardTitle>
          <CardDescription className="text-blue-100">
            Generate custom question papers using AI for any subject and grade
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Configuration */}
        <Card className="bg-white dark:bg-gray-800 border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">Paper Configuration</CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              Set up your question paper requirements
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
              <Label htmlFor="chapters">Add Chapters</Label>
              <div className="flex space-x-2">
                <Input
                  id="chapters"
                  placeholder="Enter chapter name"
                  value={chapterInput}
                  onChange={(e) => setChapterInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addChapter()}
                  className="bg-gray-50 dark:bg-gray-700"
                />
                <Button onClick={addChapter} size="sm" className="bg-green-500 hover:bg-green-600">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Chapters Table */}
        <Card className="bg-white dark:bg-gray-800 border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">Chapter Questions</CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              Configure number of questions for each chapter
            </CardDescription>
          </CardHeader>
          <CardContent>
            {chapters.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No chapters added yet. Start by adding chapters above.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {chapters.map((chapter) => (
                  <div key={chapter.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium text-gray-900 dark:text-white">{chapter.name}</h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeChapter(chapter.id)}
                        className="text-red-500 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div>
                        <Label>1M (MCQ)</Label>
                        <Input
                          type="number"
                          min="0"
                          value={chapter.mcq}
                          onChange={(e) => updateChapterQuestions(chapter.id, 'mcq', parseInt(e.target.value) || 0)}
                          className="h-8"
                        />
                      </div>
                      <div>
                        <Label>2M</Label>
                        <Input
                          type="number"
                          min="0"
                          value={chapter.twoMark}
                          onChange={(e) => updateChapterQuestions(chapter.id, 'twoMark', parseInt(e.target.value) || 0)}
                          className="h-8"
                        />
                      </div>
                      <div>
                        <Label>3M</Label>
                        <Input
                          type="number"
                          min="0"
                          value={chapter.threeMark}
                          onChange={(e) => updateChapterQuestions(chapter.id, 'threeMark', parseInt(e.target.value) || 0)}
                          className="h-8"
                        />
                      </div>
                      <div>
                        <Label>4M</Label>
                        <Input
                          type="number"
                          min="0"
                          value={chapter.fourMark}
                          onChange={(e) => updateChapterQuestions(chapter.id, 'fourMark', parseInt(e.target.value) || 0)}
                          className="h-8"
                        />
                      </div>
                      <div>
                        <Label>5M</Label>
                        <Input
                          type="number"
                          min="0"
                          value={chapter.fiveMark}
                          onChange={(e) => updateChapterQuestions(chapter.id, 'fiveMark', parseInt(e.target.value) || 0)}
                          className="h-8"
                        />
                      </div>
                      <div>
                        <Label>6M</Label>
                        <Input
                          type="number"
                          min="0"
                          value={chapter.sixMark}
                          onChange={(e) => updateChapterQuestions(chapter.id, 'sixMark', parseInt(e.target.value) || 0)}
                          className="h-8"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Generate Button */}
      {chapters.length > 0 && (
        <Card className="bg-white dark:bg-gray-800 border-0 shadow-sm">
          <CardContent className="pt-6">
            <div className="flex justify-center">
              <Button
                onClick={generateQuestionPaper}
                disabled={isGenerating}
                className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 text-lg"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Generating...
                  </>
                ) : (
                  <>
                    <FileText className="h-5 w-5 mr-2" />
                    Generate Question Paper
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default QuestionGenerator;
