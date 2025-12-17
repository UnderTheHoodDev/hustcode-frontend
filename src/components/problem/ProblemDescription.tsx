'use client';

import { Clock } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface SubmissionHistory {
  id: string;
  language: string;
  status: 'Accepted' | 'Wrong Answer' | 'Time Limit Exceeded' | 'Runtime Error';
  runtime: string;
  memory: string;
  submittedAt: string;
}

interface ProblemDescriptionProps {
  title: string;
  difficulty: string;
  tags: { id: string; name: string }[];
  description: string;
  taskDescription: string;
  inputDescription: string;
  outputDescription: string;
  submissions?: SubmissionHistory[];
}

const ProblemDescription = ({
  title,
  difficulty,
  tags,
  description,
  taskDescription,
  inputDescription,
  outputDescription,
  submissions = [],
}: ProblemDescriptionProps) => {
  const difficultyColors: Record<string, string> = {
    EASY: 'bg-green-500/10 text-green-500',
    MEDIUM: 'bg-yellow-500/10 text-yellow-500',
    HARD: 'bg-red-500/10 text-red-500',
  };

  const statusColors: Record<string, string> = {
    Accepted: 'text-green-500',
    'Wrong Answer': 'text-red-500',
    'Time Limit Exceeded': 'text-yellow-500',
    'Runtime Error': 'text-orange-500',
  };

  return (
    <div className="flex h-full flex-col overflow-hidden bg-[#1e2430]">
      <div className="border-b border-gray-700 p-6">
        <div className="mb-4 flex items-center gap-3">
          <h1 className="text-2xl font-bold text-gray-100">{title}</h1>
          <Badge className={`${difficultyColors[difficulty]} border-0`}>
            {difficulty}
          </Badge>
        </div>

        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Badge
              key={tag.id}
              className="border-0 bg-blue-500/10 text-blue-400"
            >
              {tag.name}
            </Badge>
          ))}
        </div>
      </div>

      <Tabs defaultValue="description" className="flex flex-1 flex-col">
        <TabsList className="mx-6 mt-4 bg-gray-800">
          <TabsTrigger
            value="description"
            className="data-[state=active]:bg-cyan-500"
          >
            Description
          </TabsTrigger>
          <TabsTrigger
            value="submissions"
            className="data-[state=active]:bg-cyan-500"
          >
            Submissions
          </TabsTrigger>
        </TabsList>

        <TabsContent
          value="description"
          className="mx-6 mb-6 flex-1 overflow-y-auto"
        >
          <div className="space-y-6">
            <div>
              <h2 className="mb-2 text-lg font-semibold text-gray-100">
                Description
              </h2>
              <p className="text-gray-300">{description}</p>
            </div>

            <div>
              <h2 className="mb-2 text-lg font-semibold text-gray-100">Task</h2>
              <p className="text-gray-300">{taskDescription}</p>
            </div>

            <div>
              <h2 className="mb-2 text-lg font-semibold text-gray-100">
                Input
              </h2>
              <pre className="rounded-lg bg-gray-900 p-4 text-sm whitespace-pre-wrap text-gray-300">
                {inputDescription}
              </pre>
            </div>

            <div>
              <h2 className="mb-2 text-lg font-semibold text-gray-100">
                Output
              </h2>
              <pre className="rounded-lg bg-gray-900 p-4 text-sm whitespace-pre-wrap text-gray-300">
                {outputDescription}
              </pre>
            </div>
          </div>
        </TabsContent>

        <TabsContent
          value="submissions"
          className="mx-6 mb-6 flex-1 overflow-y-auto"
        >
          <div className="space-y-3">
            {submissions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                <Clock className="mb-4 h-12 w-12" />
                <p>No submissions yet</p>
              </div>
            ) : (
              submissions.map((submission) => (
                <div
                  key={submission.id}
                  className="rounded-lg border border-gray-700 bg-gray-900 p-4 transition-colors hover:border-gray-600"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <span
                      className={`font-semibold ${
                        statusColors[submission.status]
                      }`}
                    >
                      {submission.status}
                    </span>
                    <span className="text-sm text-gray-400">
                      {submission.submittedAt}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-300">
                    <span>
                      Language:{' '}
                      <span className="font-medium">{submission.language}</span>
                    </span>
                    <span>
                      Runtime:{' '}
                      <span className="font-medium">{submission.runtime}</span>
                    </span>
                    <span>
                      Memory:{' '}
                      <span className="font-medium">{submission.memory}</span>
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProblemDescription;
