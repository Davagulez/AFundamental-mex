"use client";

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { createAnalisis } from '@/lib/api';
import { useState } from 'react';

const formSchema = z.object({
  activo: z.string().min(1, { message: "Activo es requerido" }),
  inicio: z
  .number({ invalid_type_error: "El año de inicio debe ser un número" })
  .int({ message: "El año de inicio debe ser un número entero" })
  .gte(1900, { message: "El año de inicio debe ser mayor o igual a 1900" })
  .lte(new Date().getFullYear(), { message: `El año de inicio no puede ser mayor al año actual (${new Date().getFullYear()})` }),
  fin: z
  .number({ invalid_type_error: "El año de fin debe ser un número" })
  .int({ message: "El año de fin debe ser un número entero" })
  .gte(1900, { message: "El año de fin debe ser mayor o igual a 1900" })
  .lte(new Date().getFullYear(), { message: `El año de fin no puede ser mayor al año actual (${new Date().getFullYear()})` }),
});

interface NewRecordFormProps {
  onSubmit: (data: any) => void;
}

export function NewRecordForm({ onSubmit }: NewRecordFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      activo: "",
      inicio: undefined,
      fin: undefined,
    },
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    setError('');
    try {
      const dataToSend = {
        activo: values.activo,
        inicio: values.inicio,
        fin: values.fin
      };

      console.log(dataToSend)

      const response = await createAnalisis(dataToSend);

      // Si la creación es exitosa, puedes llamar a onSubmit con los datos recibidos
      onSubmit(response);

    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Error desconocido al crear el análisis.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        {/* Campo 'activo' */}
        <FormField
          control={form.control}
          name="activo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Activo</FormLabel>
              <FormControl>
                <Input placeholder="Ingrese el activo" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Campo 'inicio' */}
        <Controller
          control={form.control}
          name="inicio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Inicio</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Ingrese el año de inicio"
                  {...field}
                  value={field.value ?? ''}
                  onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value, 10) : undefined)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Campo 'fin' */}
        <Controller
          control={form.control}
          name="fin"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fin</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Ingrese el año de fin"
                  {...field}
                  value={field.value ?? ''}
                  onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value, 10) : undefined)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {error && <p className="text-red-500">{error}</p>}
        <div className="flex justify-between">
          <Button type="submit" disabled={loading}>
            {loading ? 'Enviando...' : 'Enviar'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
