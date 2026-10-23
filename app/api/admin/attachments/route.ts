// Retired endpoint: never read identifiers, database records or file contents.
export function GET() {
  return Response.json({ error: 'O acesso a anexos foi descontinuado.' }, {
    status: 410,
    headers: { 'Cache-Control': 'no-store' },
  })
}
