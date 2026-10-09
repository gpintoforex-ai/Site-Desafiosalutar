import type { Metadata } from 'next'
import { Leaf, MessageCircle, Paperclip } from 'lucide-react'
import { RecommendationForm } from '@/components/recommendation-form'

export const metadata: Metadata = { title: 'Pedido de recomendação', description: 'Peça aconselhamento em medicina integrativa, com foco em produtos naturais e suplementação, à Desafio Salutar.', alternates: { canonical: '/pedido-recomendacao' } }
export default function RecommendationPage() {
  return <>
    <section className="bg-cream px-4 py-14 sm:px-6 md:py-20"><div className="mx-auto max-w-4xl text-center"><span className="inline-flex items-center gap-2 rounded-full bg-leaf/10 px-4 py-2 text-sm font-semibold text-primary"><Leaf className="h-4 w-4" /> Aconselhamento em medicina integrativa</span><h1 className="mt-5 text-4xl font-semibold tracking-tight text-primary sm:text-5xl">O seu bem-estar começa com uma conversa</h1><p className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground">Procura aconselhamento em medicina integrativa, com foco em produtos naturais, chás e suplementos? Conte-nos os seus objetivos para a nossa equipa preparar uma resposta adaptada ao seu pedido.</p><div className="mt-7 flex flex-wrap justify-center gap-5 text-sm text-primary"><span className="inline-flex items-center gap-2"><MessageCircle className="h-4 w-4" /> Resposta por email</span><span className="inline-flex items-center gap-2"><Paperclip className="h-4 w-4" /> Documentos opcionais</span></div></div></section>
    <section className="px-4 py-12 sm:px-6"><div className="mx-auto max-w-4xl"><RecommendationForm /></div></section>
  </>
}
