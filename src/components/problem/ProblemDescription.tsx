'use client';

import { Clock, Heart, MessageSquare, Send } from 'lucide-react';

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
  submissionCount?: number;
  likeCount?: number;
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
  submissionCount = 0,
  likeCount = 0,
}: ProblemDescriptionProps) => {
  const difficultyConfig: Record<
    string,
    { bg: string; text: string; label: string }
  > = {
    EASY: { bg: 'bg-green-500/15', text: 'text-green-400', label: 'Easy' },
    MEDIUM: {
      bg: 'bg-amber-500/15',
      text: 'text-amber-400',
      label: 'Medium',
    },
    HARD: { bg: 'bg-red-500/15', text: 'text-red-400', label: 'Hard' },
  };

  const statusColors: Record<string, string> = {
    Accepted: 'text-green-400',
    'Wrong Answer': 'text-red-400',
    'Time Limit Exceeded': 'text-amber-400',
    'Runtime Error': 'text-orange-400',
  };

  const diffConfig = difficultyConfig[difficulty] || difficultyConfig.EASY;

  return (
    <div className="custom-scrollbar flex h-full flex-col overflow-hidden bg-[#1a2332]">
      {/* Header */}
      <div className="border-b border-gray-700/50 p-6">
        <div className="mb-3 flex items-center gap-3">
          <h1 className="text-xl font-bold text-white">{title}</h1>
          <Badge className={`${diffConfig.bg} ${diffConfig.text} border-0 px-2.5 py-0.5 text-xs font-medium`}>
            {diffConfig.label}
          </Badge>
        </div>

        {/* Tags */}
        <div className="mb-4 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Badge
              key={tag.id}
              className="border-0 bg-cyan-500/10 px-2 py-0.5 text-xs text-cyan-400 hover:bg-cyan-500/20"
            >
              {tag.name}
            </Badge>
          ))}
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 text-sm text-gray-400">
          <div className="flex items-center gap-1.5">
            <Send className="h-3.5 w-3.5" />
            <span>{submissionCount} submissions</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Heart className="h-3.5 w-3.5" />
            <span>{likeCount} likes</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="description" className="flex flex-1 flex-col overflow-hidden">
        <TabsList className="mx-6 mt-4 w-fit bg-[#252d3d] p-1">
          <TabsTrigger
            value="description"
            className="px-4 py-1.5 text-sm text-gray-400 data-[state=active]:bg-cyan-500 data-[state=active]:text-white"
          >
            Description
          </TabsTrigger>
          <TabsTrigger
            value="submissions"
            className="px-4 py-1.5 text-sm text-gray-400 data-[state=active]:bg-cyan-500 data-[state=active]:text-white"
          >
            Submissions
          </TabsTrigger>
        </TabsList>

        <TabsContent
          value="description"
          className="custom-scrollbar mx-6 mb-6 flex-1 overflow-y-auto pr-2"
        >
          <div className="space-y-6 py-4">
            {/* Description */}
            <section>
              <h2 className="mb-2 text-base font-semibold text-gray-200">
                Description
              </h2>
              <p className="text-sm leading-relaxed text-gray-400">
                {description}
              </p>
            </section>

            {/* Task */}
            <section>
              <h2 className="mb-2 text-base font-semibold text-gray-200">
                Task
              </h2>
              <p className="text-sm leading-relaxed text-gray-400">
                {taskDescription}
              </p>
            </section>

            {/* Input */}
            <section>
              <h2 className="mb-2 text-base font-semibold text-gray-200">
                Input
              </h2>
              <pre className="rounded-lg border border-gray-700/50 bg-[#0f1724] p-4 text-sm leading-relaxed whitespace-pre-wrap text-gray-300">
                {inputDescription}
              </pre>
            </section>

            {/* Output */}
            <section>
              <h2 className="mb-2 text-base font-semibold text-gray-200">
                Output
              </h2>
              <pre className="rounded-lg border border-gray-700/50 bg-[#0f1724] p-4 text-sm leading-relaxed whitespace-pre-wrap text-gray-300">
                {outputDescription}
              </pre>
            </section>
          </div>
        </TabsContent>

        <TabsContent
          value="submissions"
          className="custom-scrollbar mx-6 mb-6 flex-1 overflow-y-auto pr-2"
        >
          <div className="space-y-3 py-4">
            {submissions.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-600 py-16 text-gray-500">
                <MessageSquare className="mb-3 h-10 w-10 text-gray-600" />
                <p className="text-sm">No submissions yet</p>
                <p className="mt-1 text-xs text-gray-600">
                  Submit your solution to see results here
                </p>
              </div>
            ) : (
              submissions.map((submission) => (
                <div
                  key={submission.id}
                  className="rounded-lg border border-gray-700/50 bg-[#0f1724] p-4 transition-colors hover:border-gray-600"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <span
                      className={`font-medium ${statusColors[submission.status]}`}
                    >
                      {submission.status}
                    </span>
                    <span className="flex items-center gap-1.5 text-xs text-gray-500">
                      <Clock className="h-3 w-3" />
                      {submission.submittedAt}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-400">
                    <span>
                      Language:{' '}
                      <span className="text-gray-300">{submission.language}</span>
                    </span>
                    <span>
                      Runtime:{' '}
                      <span className="text-cyan-400">{submission.runtime}</span>
                    </span>
                    <span>
                      Memory:{' '}
                      <span className="text-cyan-400">{submission.memory}</span>
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
