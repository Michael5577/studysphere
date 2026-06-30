export function formatDbError(error: { message: string } | null): string {
  if (!error) {
    return "An unexpected database error occurred.";
  }

  return error.message;
}
