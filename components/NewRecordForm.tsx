"use client"

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useFinancialContext } from '@/context/FinancialContext';

const formSchema = z.object({
  activo: z.string().min(1, { message: "Activo is required" }),
  inicio: z.string().min(4, { message: "Inicio must be a valid year" }),
  fin: z.string().min(4, { message: "Fin must be a valid year" }),
});

interface NewRecordFormProps {
  onSubmit: (data: z.infer<typeof formSchema>) => void;
}

export function NewRecordForm({ onSubmit }: NewRecordFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      activo: "",
      inicio: "",
      fin: "",
    },
  });

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    onSubmit(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="activo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Activo</FormLabel>
              <FormControl>
                <Input placeholder="Enter activo" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="inicio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Inicio</FormLabel>
              <FormControl>
                <Input placeholder="Enter inicio year" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="fin"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fin</FormLabel>
              <FormControl>
                <Input placeholder="Enter fin year" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-between">
          <Button type="submit">Submit</Button>
        </div>
      </form>
    </Form>
  );
}