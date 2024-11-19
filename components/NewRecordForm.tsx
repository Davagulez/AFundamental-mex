"use client";

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { createAnalisis, searchActivos } from '@/lib/api';
import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { Loader2 } from 'lucide-react';
import { formSchema } from '@/validation/newRecordFormSchema';

// Función debounce fuera del componente
function debounce(func: Function, delay: number) {
  let timeoutId: NodeJS.Timeout;
  return (...args: any[]) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
}

interface Activo {
  symbol: string;
  name: string;
  exchange: string;
  type: string;
}

interface NewRecordFormProps {
  onSubmit: (data: any) => void;
}

export function NewRecordForm({ onSubmit }: NewRecordFormProps) {
  const [loading, setLoading] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [error, setError] = useState('');
  const [searchResults, setSearchResults] = useState<Activo[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

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

      const response = await createAnalisis(dataToSend);
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

  // Memoizar handleSearch
  const handleSearch = useCallback(async (query: string) => {
    if (query.length > 0) {
      setIsSearching(true);
      setSearchError('');
      try {
        const results = await searchActivos(query);
        setSearchResults(results);
      } catch (err) {
        console.error('Error al buscar activos:', err);
        setSearchError('Error al buscar activos. Por favor, inténtelo de nuevo.');
        setSearchResults([]);
      } finally {
        setIsSearching(false);
        setShowResults(true);
      }
    } else {
      setSearchResults([]);
      setShowResults(false);
    }
  }, []);

  // Memoizar debouncedHandleSearch
  const debouncedHandleSearch = useMemo(() => debounce(handleSearch, 500), [handleSearch]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="activo"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Activo</FormLabel>
              <div ref={searchRef} className="relative">
                <FormControl>
                  <Input
                    placeholder="Buscar activo..."
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      debouncedHandleSearch(e.target.value);
                    }}
                  />
                </FormControl>
                {showResults && (
                  <div className="absolute z-10 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 mt-1 rounded-md shadow-lg">
                    {isSearching ? (
                      <div className="flex items-center justify-center p-4">
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        <span>Buscando...</span>
                      </div>
                    ) : searchError ? (
                      <div className="p-4 text-center text-sm text-red-500">
                        {searchError}
                      </div>
                    ) : searchResults.length > 0 ? (
                      <ul className="py-2 max-h-60 overflow-auto">
                        {searchResults.map((result) => (
                          <li
                            key={result.symbol}
                            className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                            onClick={() => {
                              form.setValue('activo', result.symbol);
                              setShowResults(false);
                            }}
                          >
                            {result.name} ({result.symbol})
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="p-4 text-center text-sm text-gray-500">
                        No se encontraron resultados.
                      </div>
                    )}
                  </div>
                )}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Campos 'inicio' y 'fin' */}
        <Controller
          control={form.control}
          name="inicio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Inicio de Analisis</FormLabel>
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
