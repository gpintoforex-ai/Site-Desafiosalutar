import Link from 'next/link'
import { Leaf } from 'lucide-react'

export default function NotFound() {
  return (
    <section className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <Leaf className="h-12 w-12 text-leaf" aria-hidden="true" />
      <h1 className="mt-4 text-4xl font-semibold text-primary">Página não encontrada</h1>
      <p className="mt-2 text-muted-foreground">A página que procura não existe ou foi movida.</p>
      <Link href="/" className="mt-6 rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground transition hover:bg-leaf">
        Voltar ao início
      </Link>
    </section>
  )
}
