'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Plus, Trash2 } from 'lucide-react';
import React from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import * as z from 'zod';

import { UpdateContestProblemDto } from '@/api/client';
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
import { Textarea } from '@/components/ui/textarea';
import useUpdateContestProblem from '@/lib/api/contest/mutations/use-update-contest-problem';
import useProblemDetailQuery from '@/lib/api/problem/queries/use-problem-detail';
import type { ContestProblem } from '@/types/contest';

const testcaseSchema = z.object({
  input: z.string().min(1, 'Input is required'),
  output: z.string().min(1, 'Output is required'),
  isSample: z.boolean(),
});

const updateContestProblemSchema = z.object({
  order: z.coerce.number().min(1, 'Order must be at least 1').optional(),
  points: z.coerce.number().min(1, 'Points must be at least 1').optional(),
  title: z
    .string()
    .min(1, 'Title is required')
    .max(200, 'Title is too long')
    .optional(),
  description: z.string().min(1, 'Description is required').optional(),
  difficulty: z.enum(['EASY', 'MEDIUM', 'HARD']).optional(),
  taskDescription: z.string().min(1, 'Task description is required').optional(),
  inputDescription: z
    .string()
    .min(1, 'Input description is required')
    .optional(),
  outputDescription: z
    .string()
    .min(1, 'Output description is required')
    .optional(),
  tags: z.string().optional(),
  timeLimit: z.coerce
    .number()
    .min(100, 'Min 100ms')
    .max(10000, 'Max 10000ms')
    .optional(),
  memoryLimit: z.coerce
    .number()
    .min(16, 'Min 16MB')
    .max(512, 'Max 512MB')
    .optional(),
  testcases: z
    .array(testcaseSchema)
    .min(1, 'At least one testcase is required')
    .optional(),
});

type UpdateContestProblemFormData = z.infer<typeof updateContestProblemSchema>;

interface EditContestProblemModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contestId: string;
  problem: ContestProblem | null;
  existingOrders: number[];
}

const EditContestProblemModal = ({
  open,
  onOpenChange,
  contestId,
  problem,
  existingOrders,
}: EditContestProblemModalProps) => {
  // Try to fetch full problem detail if problem has an id
  // Note: Contest problems might not have a separate detail endpoint
  // So we'll use the basic info from the problem prop
  const { data: problemDetailResponse, isLoading: isLoadingDetail } =
    useProblemDetailQuery(problem?.id || '');

  const problemDetail = problemDetailResponse?.data as any;

  const form = useForm<UpdateContestProblemFormData>({
    resolver: zodResolver(updateContestProblemSchema) as any,
    mode: 'onSubmit',
    defaultValues: {
      order: problem?.order,
      points: problem?.points,
      title: problem?.title,
      description: problem?.description,
      difficulty: problem?.difficulty,
      taskDescription: '',
      inputDescription: '',
      outputDescription: '',
      tags: problem?.tags.map((t) => t.name).join(', ') || '',
      timeLimit: 2000,
      memoryLimit: 256,
      testcases: [{ input: '', output: '', isSample: true }],
    },
  });

  const { fields, append, remove, replace } = useFieldArray({
    control: form.control,
    name: 'testcases',
  });

  const { mutate: updateProblem, isPending } = useUpdateContestProblem(
    contestId,
    problem?.id || ''
  );

  // Load problem data when modal opens or problem changes
  React.useEffect(() => {
    if (problem && open) {
      // If we have full problem detail, use it
      if (problemDetail) {
        const testcases = problemDetail.testcases?.map((tc: any) => ({
          input: tc.input,
          output: tc.output,
          isSample: tc.isSample,
        })) || [{ input: '', output: '', isSample: true }];

        form.reset({
          order: problem.order,
          points: problem.points,
          title: problemDetail.title || problem.title,
          description: problemDetail.description || problem.description,
          difficulty: problemDetail.difficulty || problem.difficulty,
          taskDescription: problemDetail.taskDescription || '',
          inputDescription: problemDetail.inputDescription || '',
          outputDescription: problemDetail.outputDescription || '',
          tags:
            problemDetail.tags?.map((t: any) => t.name).join(', ') ||
            problem.tags.map((t) => t.name).join(', '),
          timeLimit: problemDetail.problemConstrain?.timeLimit || 2000,
          memoryLimit: problemDetail.problemConstrain?.memoryLimit || 256,
          testcases: testcases,
        });

        replace(testcases);
      } else {
        // Otherwise use basic info from problem prop
        form.reset({
          order: problem.order,
          points: problem.points,
          title: problem.title,
          description: problem.description,
          difficulty: problem.difficulty,
          taskDescription: '',
          inputDescription: '',
          outputDescription: '',
          tags: problem.tags.map((t) => t.name).join(', '),
          timeLimit: 2000,
          memoryLimit: 256,
          testcases: [{ input: '', output: '', isSample: true }],
        });
      }
    }
  }, [problem, open, form, replace, problemDetail]);

  const onSubmit = (data: UpdateContestProblemFormData) => {
    if (!problem) return;

    // Check if order changed and conflicts with existing orders
    if (
      data.order &&
      data.order !== problem.order &&
      existingOrders.includes(data.order)
    ) {
      form.setError('order', {
        type: 'manual',
        message: 'This order is already taken. Please choose another.',
      });
      return;
    }

    const payload: UpdateContestProblemDto = {};

    if (data.order !== undefined) payload.order = data.order;
    if (data.points !== undefined) payload.points = data.points;
    if (data.title) payload.title = data.title;
    if (data.description) payload.description = data.description;
    if (data.difficulty) payload.difficulty = data.difficulty;
    if (data.taskDescription) payload.taskDescription = data.taskDescription;
    if (data.inputDescription) payload.inputDescription = data.inputDescription;
    if (data.outputDescription)
      payload.outputDescription = data.outputDescription;
    if (data.tags) payload.tags = data.tags.split(',').map((tag) => tag.trim());
    if (data.testcases) payload.testcases = data.testcases;
    if (data.timeLimit !== undefined || data.memoryLimit !== undefined) {
      payload.constraint = {
        timeLimit: data.timeLimit || 2000,
        memoryLimit: data.memoryLimit || 256,
      };
    }

    updateProblem(payload, {
      onSuccess: () => {
        onOpenChange(false);
      },
    });
  };

  const inputClassName =
    'border-[#3a4556] bg-[#252d3d] text-gray-200 placeholder:text-gray-500';
  const labelClassName = 'text-gray-300';

  if (!problem) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="custom-scrollbar max-h-[90vh] overflow-y-auto border-[#3a4556] bg-[#252d3d] sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl text-gray-100">
            Edit Contest Problem
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Update the problem details. Leave fields empty to keep current
            values.
          </DialogDescription>
        </DialogHeader>

        {isLoadingDetail ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
            <span className="ml-2 text-gray-400">Loading problem data...</span>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                          value={field.value || ''}
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
                          value={field.value || ''}
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
                    <FormLabel className={labelClassName}>
                      Description
                    </FormLabel>
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
                      <FormLabel className={labelClassName}>
                        Difficulty
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        key={`difficulty-${field.value}`}
                      >
                        <FormControl>
                          <SelectTrigger className={inputClassName}>
                            <SelectValue placeholder="Select difficulty" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="border-[#3a4556] bg-[#252d3d]">
                          <SelectItem value="EASY" className="text-green-400">
                            Easy
                          </SelectItem>
                          <SelectItem
                            value="MEDIUM"
                            className="text-yellow-400"
                          >
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
                      <FormLabel className={labelClassName}>Tags</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="array, hash-table"
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
                    <FormLabel className={labelClassName}>
                      Task Description
                    </FormLabel>
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
                      <FormLabel className={labelClassName}>
                        Input Description
                      </FormLabel>
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
                      <FormLabel className={labelClassName}>
                        Output Description
                      </FormLabel>
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
                <h4 className="mb-3 text-sm font-medium text-gray-300">
                  Constraints
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="timeLimit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={labelClassName}>
                          Time Limit (ms)
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="2000"
                            className={inputClassName}
                            {...field}
                            value={field.value || ''}
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
                        <FormLabel className={labelClassName}>
                          Memory Limit (MB)
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="256"
                            className={inputClassName}
                            {...field}
                            value={field.value || ''}
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
                    onClick={() =>
                      append({ input: '', output: '', isSample: false })
                    }
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
                              <FormLabel className="text-xs text-gray-400">
                                Input
                              </FormLabel>
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
                  {isPending ? 'Saving...' : 'Save Changes'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EditContestProblemModal;
