import type { Metadata } from 'next'
import Link from 'next/link'
import { Leaf, MessageCircle, Phone } from 'lucide-react'
import { SITE } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Pedido de aconselhamento',
  description: 'Contacte a Desafio Salutar pelo WhatsApp para informações gerais ou para combinar um contacto com a equipa.',
  alternates: { canonical: '/pedido-recomendacao' },
}

export default function RecommendationPage() {
  return <>
    <section className="bg-cream px-4 py-14 sm:px-6 md:py-20">
      <div className="mx-auto max-w-3xl text-center">
        <span className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 font-semibold text-primary-foreground"><Leaf className="h-5 w-5" aria-hidden="true" /> Desafio Salutar</span>
        <h1 className="mt-5 text-4xl font-semibold tracking-tight text-primary sm:text-5xl">Pedido de aconselhamento</h1>
        <p className="mt-5 text-lg text-muted-foreground">Fale com a nossa equipa para obter informações gerais sobre produtos ou combinar um contacto.</p>
      </div>
    </section>
    <section className="px-4 py-12 sm:px-6">
      <div className="mx-auto max-w-2xl rounded-2xl border border-border bg-card p-6 shadow-soft sm:p-10">
        <h2 className="text-2xl font-semibold text-primary">Estamos por perto</h2>
        <p className="mt-3 text-muted-foreground">O formulário de aconselhamento foi removido. Pode iniciar uma conversa pelo WhatsApp ou ligar para a loja.</p>
        <div className="mt-6 rounded-xl bg-cream p-5 text-sm leading-relaxed">
          <p className="font-semibold text-primary">Proteja a sua privacidade</p>
          <p className="mt-2">Utilize este contacto apenas para informações gerais ou para combinar atendimento. Não envie sintomas, medicação, diagnósticos, análises clínicas, fotografias de documentos ou outros dados de saúde por WhatsApp.</p>
        </div>
        <a href={SITE.adviceWhatsappUrl} target="_blank" rel="noopener noreferrer" className="mt-7 inline-flex min-h-12 w-full items-center justify-center gap-3 rounded-full bg-primary px-6 py-4 text-center font-semibold text-primary-foreground shadow-soft transition hover:bg-leaf focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">
          <MessageCircle className="h-5 w-5 shrink-0" aria-hidden="true" /> Falar no WhatsApp<span className="sr-only"> (abre numa nova janela)</span>
        </a>
        <p className="mt-3 text-center text-sm text-muted-foreground">WhatsApp: {SITE.mobilePhone}. Ao carregar, abre um serviço externo; nenhuma mensagem é enviada automaticamente.</p>
        <a href={SITE.phoneHref} className="mt-6 flex items-center justify-center gap-2 font-semibold text-primary underline underline-offset-4"><Phone className="h-4 w-4" aria-hidden="true" /> {SITE.phone}</a>
        <p className="mt-2 text-center text-xs text-muted-foreground">{SITE.phoneCostNote}</p>
        <p className="mt-6 text-sm text-muted-foreground">Pode também visitar-nos na loja. Consulte os <Link href="/contactos" className="text-primary underline">contactos e horários</Link> e a <Link href="/politica-privacidade" className="text-primary underline">Política de Privacidade</Link>.</p>
        <p className="mt-6 border-t border-border pt-5 text-sm text-muted-foreground">O aconselhamento não substitui uma consulta médica, diagnóstico ou prescrição. Não altere medicação sem orientação do seu profissional de saúde.</p>
      </div>
    </section>
  </>
}
