import * as z from 'zod';

export const formSchema = z.object({
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
