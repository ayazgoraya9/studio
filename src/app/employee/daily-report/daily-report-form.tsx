'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { submitDailyReport } from '@/lib/actions';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useTransition } from 'react';
import { useToast } from '@/hooks/use-toast';

const reportSchema = z.object({
  shop_name: z.string().min(1, 'Shop name is required'),
  salesman_name: z.string().min(1, 'Salesman name is required'),
  total_sales: z.coerce.number().min(0, 'Total sales cannot be negative'),
  total_expenses: z.coerce.number().min(0, 'Total expenses cannot be negative'),
});

type ReportFormValues = z.infer<typeof reportSchema>;

export function DailyReportForm() {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const { register, handleSubmit, formState: { errors }, reset } = useForm<ReportFormValues>({
    resolver: zodResolver(reportSchema),
  });

  const onSubmit = (data: ReportFormValues) => {
    startTransition(async () => {
      const result = await submitDailyReport(data);
      if (result?.error) {
        toast({
          variant: "destructive",
          title: "Submission Failed",
          description: Object.values(result.error).flat().join('\n'),
        });
      } else {
        toast({
          title: "Success",
          description: "Your daily report has been submitted.",
        });
        reset();
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className='space-y-2'>
        <Label htmlFor="shop_name">Shop Name</Label>
        <Input id="shop_name" {...register('shop_name')} />
        {errors.shop_name && <p className="text-sm text-destructive">{errors.shop_name.message}</p>}
      </div>

      <div className='space-y-2'>
        <Label htmlFor="salesman_name">Salesman Name</Label>
        <Input id="salesman_name" {...register('salesman_name')} />
        {errors.salesman_name && <p className="text-sm text-destructive">{errors.salesman_name.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className='space-y-2'>
          <Label htmlFor="total_sales">Total Sales ($)</Label>
          <Input id="total_sales" type="number" step="0.01" {...register('total_sales')} />
          {errors.total_sales && <p className="text-sm text-destructive">{errors.total_sales.message}</p>}
        </div>
        <div className='space-y-2'>
          <Label htmlFor="total_expenses">Total Expenses ($)</Label>
          <Input id="total_expenses" type="number" step="0.01" {...register('total_expenses')} />
          {errors.total_expenses && <p className="text-sm text-destructive">{errors.total_expenses.message}</p>}
        </div>
      </div>
      
      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? 'Submitting...' : 'Submit Report'}
      </Button>
    </form>
  );
}
