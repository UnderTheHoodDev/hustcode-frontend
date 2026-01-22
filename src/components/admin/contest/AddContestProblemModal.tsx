'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Plus, Search, Trash2 } from 'lucide-react';
import React from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import * as z from 'zod';

import { CreateContestProblemDto } from '@/api/client';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import useCreateContestProblem from '@/lib/api/contest/mutations/use-create-contest-problem';
import useProblemDetailQuery from '@/lib/api/problem/queries/use-problem-detail';
import useProblems from '@/lib/api/problem/queries/use-problems';

const testcaseSchema = z.object({
  input: z.string().min(1, 'Input is required'),
  output: z.string().min(1, 'Output is required'),
  isSample: z.boolean(),
});

const createContestProblemSchema = z.object({
  order: z.coerce.number().min(1, 'Order must be at least 1'),
  points: z.coerce.number().min(1, 'Points must be at least 1'),
  title: z.string().min(1, 'Title is required').max(200, 'Title is too long'),
  description: z.string().min(1, 'Description is required'),
  difficulty: z.enum(['EASY', 'MEDIUM', 'HARD']),
  taskDescription: z.string().min(1, 'Task description is required'),
  inputDescription: z.string().min(1, 'Input description is required'),
  outputDescription: z.string().min(1, 'Output description is required'),
  tags: z.string().min(1, 'At least one tag is required'),
  timeLimit: z.coerce.number().min(100, 'Min 100ms').max(10000, 'Max 10000ms'),
  memoryLimit: z.coerce.number().min(16, 'Min 16MB').max(512, 'Max 512MB'),
  testcases: z
    .array(testcaseSchema)
    .min(1, 'At least one testcase is required'),
});

type CreateContestProblemFormData = z.infer<typeof createContestProblemSchema>;

interface AddContestProblemModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contestId: string;
  existingOrders: number[];
}

const AddContestProblemModal = ({
  open,
  onOpenChange,
  contestId,
  existingOrders,
}: AddContestProblemModalProps) => {
  const [mode, setMode] = React.useState<'select' | 'create'>('select');
  const [selectedProblemId, setSelectedProblemId] = React.useState<string>('');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [problemsPage, setProblemsPage] = React.useState(1);

  // Fetch approved problems for selection
  const { data: problemsResponse, isLoading: isLoadingProblems } = useProblems({
    page: problemsPage,
    pageSize: 20,
    status: 'APPROVED',
    search: searchQuery || undefined,
  });

  // Extract problems array from API response
  // Structure: response.data.data (array of problems)
  const apiData = problemsResponse?.data as
    | {
        data: any[];
        total: number;
        page: number;
        pageSize: number;
        totalPages: number;
      }
    | undefined;

  const problems = apiData?.data || [];

  // Fetch selected problem detail
  const {
    data: problemDetailResponse,
    isLoading: isLoadingDetail,
  } = useProblemDetailQuery(selectedProblemId);

  const problemDetail = problemDetailResponse?.data as any;

  const form = useForm<CreateContestProblemFormData>({
    resolver: zodResolver(createContestProblemSchema) as any,
    mode: 'onSubmit',
    defaultValues: {
      order: existingOrders.length > 0 ? Math.max(...existingOrders) + 1 : 1,
      points: 100,
      title: '',
      description: '',
      difficulty: 'EASY',
      taskDescription: '',
      inputDescription: '',
      outputDescription: '',
      tags: '',
      timeLimit: 2000,
      memoryLimit: 256,
      testcases: [{ input: '', output: '', isSample: true }],
    },
  });

  const { fields, append, remove, replace } = useFieldArray({
    control: form.control,
    name: 'testcases',
  });

  const { mutate: createProblem, isPending } = useCreateContestProblem();

  // Load problem detail into form when selected
  React.useEffect(() => {
    if (problemDetail && mode === 'select' && selectedProblemId) {
      const testcases =
        problemDetail.testcases?.map((tc: any) => ({
          input: tc.input,
          output: tc.output,
          isSample: tc.isSample,
        })) || [{ input: '', output: '', isSample: true }];

      form.reset({
        order: existingOrders.length > 0 ? Math.max(...existingOrders) + 1 : 1,
        points: 100,
        title: problemDetail.title || '',
        description: problemDetail.description || '',
        difficulty: problemDetail.difficulty || 'EASY',
        taskDescription: problemDetail.taskDescription || '',
        inputDescription: problemDetail.inputDescription || '',
        outputDescription: problemDetail.outputDescription || '',
        tags: problemDetail.tags?.map((t: any) => t.name).join(', ') || '',
        timeLimit: problemDetail.problemConstrain?.timeLimit || 2000,
        memoryLimit: problemDetail.problemConstrain?.memoryLimit || 256,
        testcases: testcases,
      });

      replace(testcases);
    }
  }, [problemDetail, mode, form, replace, existingOrders, selectedProblemId]);

  // Reset form when mode changes to create
  React.useEffect(() => {
    if (mode === 'create') {
      form.reset({
        order: existingOrders.length > 0 ? Math.max(...existingOrders) + 1 : 1,
        points: 100,
        title: '',
        description: '',
        difficulty: 'EASY',
        taskDescription: '',
        inputDescription: '',
        outputDescription: '',
        tags: '',
        timeLimit: 2000,
        memoryLimit: 256,
        testcases: [{ input: '', output: '', isSample: true }],
      });
      setSelectedProblemId('');
      replace([{ input: '', output: '', isSample: true }]);
    }
  }, [mode, form, replace, existingOrders]);

  const onSubmit = (data: CreateContestProblemFormData) => {
    if (existingOrders.includes(data.order)) {
      form.setError('order', {
        type: 'manual',
        message: 'This order is already taken. Please choose another.',
      });
      return;
    }

    const payload: CreateContestProblemDto = {
      contestId,
      order: data.order,
      points: data.points,
      title: data.title,
      description: data.description,
      difficulty: data.difficulty,
      taskDescription: data.taskDescription,
      inputDescription: data.inputDescription,
      outputDescription: data.outputDescription,
      tags: data.tags.split(',').map((tag) => tag.trim()),
      constraint: {
        timeLimit: data.timeLimit,
        memoryLimit: data.memoryLimit,
      },
      testcases: data.testcases,
    };

    createProblem(payload, {
      onSuccess: () => {
        form.reset();
        setSelectedProblemId('');
        setSearchQuery('');
        setMode('select');
        onOpenChange(false);
      },
    });
  };

  const inputClassName =
    'border-[#3a4556] bg-[#252d3d] text-gray-200 placeholder:text-gray-500';
  const labelClassName = 'text-gray-300';

  // Render form fields component
  const renderFormFields = () => (
    <>
      {/* Order and Points */}
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="order"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={labelClassName}>Order</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="1 (A), 2 (B), etc."
                  className={inputClassName}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="points"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={labelClassName}>Points</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="100"
                  className={inputClassName}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Title */}
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel className={labelClassName}>Title</FormLabel>
            <FormControl>
              <Input
                placeholder="Enter problem title"
                className={inputClassName}
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Description */}
      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel className={labelClassName}>Description</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Brief description of the problem"
                className={inputClassName}
                rows={2}
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Difficulty & Tags */}
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="difficulty"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={labelClassName}>Difficulty</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className={inputClassName}>
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="border-[#3a4556] bg-[#252d3d]">
                  <SelectItem value="EASY" className="text-green-400">
                    Easy
                  </SelectItem>
                  <SelectItem value="MEDIUM" className="text-yellow-400">
                    Medium
                  </SelectItem>
                  <SelectItem value="HARD" className="text-red-400">
                    Hard
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={labelClassName}>
                Tags (comma-separated)
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="array, hash-table, dp"
                  className={inputClassName}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Task Description */}
      <FormField
        control={form.control}
        name="taskDescription"
        render={({ field }) => (
          <FormItem>
            <FormLabel className={labelClassName}>Task Description</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Detailed task description..."
                className={inputClassName}
                rows={3}
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Input & Output Description */}
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="inputDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={labelClassName}>Input Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe the input format..."
                  className={inputClassName}
                  rows={2}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="outputDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={labelClassName}>Output Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe the output format..."
                  className={inputClassName}
                  rows={2}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Constraints */}
      <div className="rounded-lg border border-[#3a4556] bg-[#252d3d]/50 p-4">
        <h4 className="mb-3 text-sm font-medium text-gray-300">Constraints</h4>
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="timeLimit"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={labelClassName}>Time Limit (ms)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="2000"
                    className={inputClassName}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="memoryLimit"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={labelClassName}>Memory Limit (MB)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="256"
                    className={inputClassName}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      {/* Testcases */}
      <div className="rounded-lg border border-[#3a4556] bg-[#252d3d]/50 p-4">
        <div className="mb-3 flex items-center justify-between">
          <h4 className="text-sm font-medium text-gray-300">
            Testcases ({fields.length})
          </h4>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => append({ input: '', output: '', isSample: false })}
            className="border-[#3a4556] bg-transparent text-cyan-400 hover:bg-cyan-500/10 hover:text-cyan-300"
          >
            <Plus className="mr-1 h-4 w-4" />
            Add Testcase
          </Button>
        </div>

                <div className="space-y-4">
                  {fields.map((field, index) => (
                    <div
                      key={field.id}
                      className="rounded-md border border-[#3a4556] bg-[#252d3d] p-3"
                    >
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium text-gray-400">
                  Testcase #{index + 1}
                </span>
                <div className="flex items-center gap-3">
                  <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-400">
                    <input
                      type="checkbox"
                      {...form.register(`testcases.${index}.isSample`)}
                      className="h-4 w-4 rounded border-[#3a4556] bg-[#252d3d] text-cyan-500"
                    />
                    Sample
                  </label>
                  {fields.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => remove(index)}
                      className="h-8 w-8 p-0 text-red-400 hover:bg-red-500/10 hover:text-red-300"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name={`testcases.${index}.input`}
                  render={({ field: inputField }) => (
                    <FormItem>
                      <FormLabel className="text-xs text-gray-400">Input</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Input data..."
                          className={`${inputClassName} font-mono text-sm`}
                          rows={3}
                          {...inputField}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`testcases.${index}.output`}
                  render={({ field: outputField }) => (
                    <FormItem>
                      <FormLabel className="text-xs text-gray-400">
                        Expected Output
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Expected output..."
                          className={`${inputClassName} font-mono text-sm`}
                          rows={3}
                          {...outputField}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="custom-scrollbar max-h-[90vh] overflow-y-auto border-[#3a4556] bg-[#252d3d] sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-xl text-gray-100">
            Add Problem to Contest
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Select an existing problem or create a new one for this contest.
          </DialogDescription>
        </DialogHeader>

        <Tabs
          value={mode}
          onValueChange={(v) => setMode(v as 'select' | 'create')}
          className="mt-4"
        >
          <TabsList className="border-[#3a4556] bg-[#1e293b]">
            <TabsTrigger
              value="select"
              className="text-gray-300 data-[state=active]:bg-[#2a3344] data-[state=active]:text-cyan-400"
            >
              Select Existing
            </TabsTrigger>
            <TabsTrigger
              value="create"
              className="text-gray-300 data-[state=active]:bg-[#2a3344] data-[state=active]:text-cyan-400"
            >
              Create New
            </TabsTrigger>
          </TabsList>

          {/* Select Existing Problem Tab */}
          <TabsContent value="select" className="mt-4 space-y-4">
            {/* Search */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search problems..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setProblemsPage(1);
                  }}
                  className={`${inputClassName} pl-10`}
                />
              </div>
            </div>

            {/* Problems List */}
            {isLoadingProblems ? (
              <div className="flex h-64 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
              </div>
            ) : problems.length === 0 ? (
              <div className="flex h-64 items-center justify-center rounded-lg border border-[#3a4556] bg-[#252d3d]">
                <p className="text-gray-400">No problems found</p>
              </div>
            ) : (
              <div className="max-h-64 space-y-2 overflow-y-auto rounded-lg border border-[#3a4556] bg-[#1e293b] p-4">
                {problems.map((problem: any) => (
                  <button
                    key={problem.id}
                    type="button"
                    onClick={() => {
                      setSelectedProblemId(problem.id);
                      // Scroll to form when problem is selected
                      setTimeout(() => {
                        const formElement = document.querySelector('[data-problem-form]');
                        if (formElement) {
                          formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }
                      }, 100);
                    }}
                    className={`w-full rounded-lg border p-3 text-left transition-colors ${
                      selectedProblemId === problem.id
                        ? 'border-cyan-500 bg-cyan-500/10'
                        : 'border-[#3a4556] bg-[#252d3d] hover:border-[#4a5566] hover:bg-[#2a3344]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-200">{problem.title}</h4>
                        <p className="mt-1 line-clamp-1 text-sm text-gray-400">
                          {problem.description}
                        </p>
                        <div className="mt-2 flex gap-2">
                          <span
                            className={`text-xs ${
                              problem.difficulty === 'EASY'
                                ? 'text-green-400'
                                : problem.difficulty === 'MEDIUM'
                                  ? 'text-yellow-400'
                                  : 'text-red-400'
                            }`}
                          >
                            {problem.difficulty}
                          </span>
                          {problem.tags?.slice(0, 3).map((tag: any) => (
                            <span key={tag.id} className="text-xs text-gray-500">
                              {tag.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Selected Problem Info */}
            {selectedProblemId && (
              <div className="rounded-lg border border-cyan-500/30 bg-cyan-500/5 p-4">
                {isLoadingDetail ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin text-cyan-400" />
                    <span className="text-sm text-gray-400">Loading problem details...</span>
                  </div>
                ) : problemDetail ? (
                  <div className="space-y-2">
                    <p className="text-sm text-gray-300">
                      Selected: <span className="font-medium">{problemDetail.title}</span>
                    </p>
                    <p className="text-xs text-gray-400">
                      Problem details will be copied to the form below. You can adjust order and
                      points.
                    </p>
                  </div>
                ) : null}
              </div>
            )}
          </TabsContent>

          {/* Create New Problem Tab */}
          <TabsContent value="create" className="mt-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                {renderFormFields()}

                <DialogFooter className="gap-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => onOpenChange(false)}
                    className="border-[#3a4556] bg-transparent text-gray-300 hover:bg-[#252d3d] hover:text-gray-100"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isPending}
                    className="bg-cyan-500 text-white hover:bg-cyan-600"
                  >
                    {isPending ? 'Creating...' : 'Create Problem'}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </TabsContent>
        </Tabs>

        {/* Form for selected problem (shown below select tab) */}
        {mode === 'select' && selectedProblemId && (
          <div className="mt-4 border-t border-[#3a4556] pt-4" data-problem-form>
            <div className="mb-4 rounded-lg border border-cyan-500/30 bg-cyan-500/5 p-3">
              <p className="text-sm text-gray-300">
                <span className="font-medium">Problem selected!</span> Review and adjust the details below, then click &quot;Add to Contest&quot;.
              </p>
            </div>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                {renderFormFields()}

                <DialogFooter className="gap-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setSelectedProblemId('');
                      form.reset();
                    }}
                    className="border-[#3a4556] bg-transparent text-gray-300 hover:bg-[#252d3d]"
                  >
                    Clear Selection
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => onOpenChange(false)}
                    className="border-[#3a4556] bg-transparent text-gray-300 hover:bg-[#252d3d]"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isPending || !selectedProblemId}
                    className="bg-cyan-500 text-white hover:bg-cyan-600"
                  >
                    {isPending ? 'Creating...' : 'Add to Contest'}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AddContestProblemModal;
