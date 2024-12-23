import * as z from 'zod';

type NullableInput<T> = T | null;
type InferOutput<T, Schema extends z.ZodSchema> = T extends null
  ? NullableInput<z.infer<Schema>>
  : z.infer<Schema>;

function validate<TSchema extends z.ZodSchema, TData = unknown>(
  data: TData,
  schema: TSchema,
  errorPrefix: string,
): InferOutput<TData, TSchema> {
  if (data === null) return null as InferOutput<TData, TSchema>;

  const parseResult = schema.safeParse(data);
  if (!parseResult.success) {
    throw new Error(
      `${errorPrefix}: ${parseResult.error.errors
        .map((e) => `${e.path}: ${e.message}`)
        .join(', ')}`,
    );
  }
  return parseResult.data;
}

export const validateSchemaOrThrow = {
  before: <TSchema extends z.ZodSchema, TData = unknown>(
    data: TData,
    schema: TSchema,
    functionName: string,
  ): InferOutput<TData, TSchema> => {
    return validate(data, schema, `${functionName} (before schema validation)`);
  },
  after: <TSchema extends z.ZodSchema, TData = unknown>(
    data: TData,
    schema: TSchema,
    functionName: string,
  ): InferOutput<TData, TSchema> => {
    return validate(data, schema, `${functionName} (after schema validation)`);
  },
};

export const validateArraySchemaOrThrow = {
  before: <TSchema extends z.ZodSchema, TData = unknown>(
    data: TData,
    schema: TSchema,
    functionName: string,
  ): InferOutput<TData, z.ZodArray<TSchema>> => {
    return validateSchemaOrThrow.before(data, z.array(schema), functionName);
  },
  after: <TSchema extends z.ZodSchema, TData = unknown>(
    data: TData,
    schema: TSchema,
    functionName: string,
  ): InferOutput<TData, z.ZodArray<TSchema>> => {
    return validateSchemaOrThrow.after(data, z.array(schema), functionName);
  },
};
