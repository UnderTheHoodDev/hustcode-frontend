'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Trash2 } from 'lucide-react';
import { useFieldArray, useForm } from 'react-hook-form';
import * as z from 'zod';

import { CreateProblemDto } from '@/api/client';
import { Button } from '@/components/ui/button';
import { CodeEditor } from '@/components/ui/code-editor';
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
import useLanguagesQuery from '@/lib/api/language/queries/use-languages';
import useCreateProblem from '@/lib/api/problem/mutations/use-create-problem';
import { getCodemirrorLanguage } from '@/utils/language';

const testcaseSchema = z.object({
  input: z.string().min(1, 'Input is required'),
  output: z.string().min(1, 'Output is required'),
  isSample: z.boolean(),
});

const solutionSchema = z.object({
  code: z.string(),
  languageId: z.string(),
});

const createProblemSchema = z.object({
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
  solution: solutionSchema.optional(),
});

type CreateProblemFormData = z.infer<typeof createProblemSchema>;

interface CreateProblemModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CreateProblemModal = ({
  open,
  onOpenChange,
}: CreateProblemModalProps) => {
  // Fetch languages from API
  const { data: languages = [] } = useLanguagesQuery();

  const form = useForm<CreateProblemFormData>({
    resolver: zodResolver(createProblemSchema) as any,
    mode: 'onSubmit',
    defaultValues: {
      title: '',
      description: '',
      difficulty: 'EASY',
      taskDescription: '',
      inputDescription: '',
      outputDescription: '',
      tags: '',
      timeLimit: 1000,
      memoryLimit: 256,
      testcases: [{ input: '', output: '', isSample: true }],
      solution: {
        code: '',
        languageId: '',
      },
    },
  });

  const selectedLanguageId = form.watch('solution.languageId');
  const selectedLanguage = languages.find((l) => l.id === selectedLanguageId);

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'testcases',
  });

  const { mutate: createProblem, isPending } = useCreateProblem();

  const onSubmit = (data: CreateProblemFormData) => {
    const payload: CreateProblemDto = {
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
      // Only include solution if code is provided
      ...(data.solution?.code && {
        solution: {
          code: data.solution.code,
          languageId: data.solution.languageId,
        },
      }),
    };

    createProblem(payload, {
      onSuccess: () => {
        form.reset();
        onOpenChange(false);
      },
    });
  };

  const inputClassName =
    'border-[#3a4556] bg-[#252d3d] text-gray-200 placeholder:text-gray-500';
  const labelClassName = 'text-gray-300';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="custom-scrollbar max-h-[90vh] overflow-y-auto border-[#3a4556] bg-[#1e293b] sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl text-gray-100">
            Create New Problem
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Fill in the details below to create a new problem.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
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
                          placeholder="1000"
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
                      <FormLabel className={labelClassName}>
                        Memory Limit (MB)
                      </FormLabel>
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
                <h4 className="text-sm font-medium text-gray-300">Testcases</h4>
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
                    className="rounded-md border border-[#3a4556] bg-[#1e293b] p-3"
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

            {/* Solution (Optional) */}
            <div className="rounded-lg border border-[#3a4556] bg-[#252d3d]/50 p-4">
              <div className="mb-3 flex items-center justify-between">
                <h4 className="text-sm font-medium text-gray-300">
                  Solution (Optional)
                </h4>
                <FormField
                  control={form.control}
                  name="solution.languageId"
                  render={({ field }) => (
                    <FormItem className="w-40">
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger
                            className={`${inputClassName} h-8 text-xs`}
                          >
                            <SelectValue placeholder="Language" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="border-[#3a4556] bg-[#252d3d]">
                          {languages.map((lang) => (
                            <SelectItem
                              key={lang.id}
                              value={lang.id}
                              className="text-gray-200"
                            >
                              {lang.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="solution.code"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <CodeEditor
                        value={field.value || ''}
                        onChange={field.onChange}
                        language={
                          selectedLanguage
                            ? getCodemirrorLanguage(selectedLanguage.name)
                            : 'python'
                        }
                        placeholder="Enter solution code here..."
                        height="200px"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
                {isPending ? 'Creating...' : 'Create Problem'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateProblemModal;
