'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { DateTimePicker } from '@/components/ui/date-time-picker';
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
import useCreateContest from '@/lib/api/contest/mutations/use-create-contest';

const createContestSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title is too long'),
  description: z.string().min(1, 'Description is required'),
  startTime: z.date().refine((v) => v instanceof Date, {
    message: 'Start time is required',
  }),
  endTime: z.date().refine((v) => v instanceof Date, {
    message: 'End time is required',
  }),
  isPublic: z.string(),
});

type CreateContestFormData = z.infer<typeof createContestSchema>;

interface CreateContestModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CreateContestModal = ({
  open,
  onOpenChange,
}: CreateContestModalProps) => {
  const form = useForm<CreateContestFormData>({
    resolver: zodResolver(createContestSchema) as any,
    mode: 'onSubmit',
    defaultValues: {
      title: '',
      description: '',
      startTime: undefined,
      endTime: undefined,
      isPublic: 'true',
    },
  });

  const { mutate: createContest, isPending } = useCreateContest();

  const onSubmit = (data: CreateContestFormData) => {
    const payload = {
      title: data.title,
      description: data.description,
      startTime: data.startTime.toISOString(),
      endTime: data.endTime.toISOString(),
      isPublic: data.isPublic === 'true',
    };

    createContest(payload, {
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
      <DialogContent className="custom-scrollbar max-h-[90vh] overflow-y-auto border-[#3a4556] bg-[#252d3d] sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl text-gray-100">
            Create New Contest
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Fill in the details below to create a new contest.
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
                      placeholder="Enter contest title"
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
                      placeholder="Brief description of the contest"
                      className={inputClassName}
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Start Time */}
            <FormField
              control={form.control}
              name="startTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={labelClassName}>Start Time</FormLabel>
                  <FormControl>
                    <DateTimePicker
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Select start date and time"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* End Time */}
            <FormField
              control={form.control}
              name="endTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={labelClassName}>End Time</FormLabel>
                  <FormControl>
                    <DateTimePicker
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Select end date and time"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Visibility */}
            <FormField
              control={form.control}
              name="isPublic"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={labelClassName}>Visibility</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className={inputClassName}>
                        <SelectValue placeholder="Select visibility" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="border-[#3a4556] bg-[#252d3d]">
                      <SelectItem value="true" className="text-gray-200">
                        Public
                      </SelectItem>
                      <SelectItem value="false" className="text-gray-200">
                        Private
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-4">
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
                disabled={isPending}
                className="bg-cyan-500 text-white hover:bg-cyan-600"
              >
                {isPending ? 'Creating...' : 'Create Contest'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateContestModal;
