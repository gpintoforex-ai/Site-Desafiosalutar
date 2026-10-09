// Never display raw HTML/proxy responses or treat an empty response as success.
export async function readApiResponse<T extends object>(response: Response): Promise<T> {
  let value: unknown
  try { value = JSON.parse(await response.text()) }
  catch {
    throw new Error(`O servidor devolveu uma resposta vazia ou inválida (HTTP ${response.status}). Se estava a enviar ou eliminar, confirme o resultado antes de repetir.`)
  }
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error(`O servidor devolveu uma resposta inesperada (HTTP ${response.status}).`)
  }
  return value as T
}
