'use client'

import Link from 'next/link'
import { useState } from 'react'
import type { FormEvent } from 'react'
import { CheckCircle2, Loader2, Mail, MessageSquare, Phone, Send, Tag, User } from 'lucide-react'
import { toast } from 'sonner'

type FormState = { name: string; email: string; phone: string; subject: string; message: string; consent: boolean; website: string }
type Errors = Partial<Record<keyof FormState, string>>

const INITIAL: FormState = { name: '', email: '', phone: '', subject: '', message: '', consent: false, website: '' }

function validate(f: FormState): Errors {
  const e: Errors = {}
  if ((f?.name ?? '').trim().length < 2) e.name = 'Indique o seu nome.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((f?.email ?? '').trim())) e.email = 'Indique um endereço de email válido.'
  if ((f?.phone ?? '').trim() && !/^[+\d\s()-]{9,20}$/.test(f.phone.trim())) e.phone = 'Indique um número de telefone válido.'
  if ((f?.subject ?? '').trim().length < 3) e.subject = 'Indique o assunto.'
  if ((f?.message ?? '').trim().length < 10) e.message = 'A mensagem deve ter pelo menos 10 caracteres.'
  if (!f?.consent) e.consent = 'É necessário o seu consentimento para podermos responder.'
  return e
}

export function ContactForm() {
  const [form, setForm] = useState<FormState>(INITIAL)
  const [errors, setErrors] = useState<Errors>({})
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) => {
    setForm((p) => ({ ...(p ?? INITIAL), [k]: v }))
    if (errors?.[k]) setErrors((p) => ({ ...(p ?? {}), [k]: undefined }))
  }

  const onSubmit = async (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault()
    const e = validate(form)
    setErrors(e)
    if (Object.keys(e ?? {}).length > 0) {
      const first = Object.keys(e ?? {})?.[0]
      if (first) document.getElementById(`cf-${first}`)?.focus?.()
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/contacto', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = (await res.json().catch(() => ({}))) as { error?: string }
      if (!res.ok) throw new Error(data?.error ?? 'Ocorreu um erro ao enviar a mensagem.')
      setSent(true)
      setForm(INITIAL)
      toast.success('Mensagem enviada com sucesso. Obrigado!')
    } catch (err) {
      console.error('Erro no formulário de contacto', err)
      toast.error(err instanceof Error ? err.message : 'Ocorreu um erro ao enviar a mensagem.')
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div className="flex flex-col items-center rounded-lg bg-card p-10 text-center shadow-soft" role="status">
        <CheckCircle2 className="h-14 w-14 text-leaf" aria-hidden="true" />
        <h3 className="mt-4 text-2xl font-semibold text-primary">Mensagem recebida</h3>
        <p className="mt-2 max-w-md text-muted-foreground">
          Obrigado pelo seu contacto. Responderemos com a maior brevidade possível, em dias úteis.
        </p>
        <button
          type="button"
          onClick={() => setSent(false)}
          className="mt-6 rounded-full bg-secondary px-5 py-2.5 text-sm font-semibold text-primary transition hover:bg-muted"
        >
          Enviar nova mensagem
        </button>
      </div>
    )
  }

  const inputBase =
    'w-full rounded-md bg-background py-3 pl-11 pr-4 text-sm text-foreground ring-1 ring-input placeholder:text-muted-foreground/80 transition focus:outline-none focus:ring-2 focus:ring-ring'

  const Field = ({
    id,
    label,
    icon: Icon,
    required = false,
    children,
  }: {
    id: keyof FormState
    label: string
    icon: typeof User
    required?: boolean
    children: React.ReactNode
  }) => (
    <div>
      <label htmlFor={`cf-${id}`} className="mb-1.5 block text-sm font-medium text-foreground">
        {label} {required ? <span className="text-destructive" aria-hidden="true">*</span> : <span className="text-muted-foreground">(opcional)</span>}
      </label>
      <div className="relative">
        <Icon className="pointer-events-none absolute left-3.5 top-3.5 h-4 w-4 text-leaf" aria-hidden="true" />
        {children}
      </div>
      {errors?.[id] ? (
        <p id={`cf-${id}-erro`} className="mt-1 text-xs font-medium text-destructive" role="alert">
          {errors[id]}
        </p>
      ) : null}
    </div>
  )

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5 rounded-lg bg-card p-6 shadow-soft sm:p-8" aria-label="Formulário de contacto">
      <div className="grid gap-5 sm:grid-cols-2">
        {Field({
          id: 'name',
          label: 'Nome',
          icon: User,
          required: true,
          children: (
            <input id="cf-name" name="name" autoComplete="name" required aria-required="true" aria-invalid={!!errors?.name}
              aria-describedby={errors?.name ? 'cf-name-erro' : undefined} value={form.name} onChange={(e) => set('name', e.target.value)}
              className={inputBase} placeholder="O seu nome" maxLength={120} />
          ),
        })}
        {Field({
          id: 'email',
          label: 'Email',
          icon: Mail,
          required: true,
          children: (
            <input id="cf-email" name="email" type="email" autoComplete="email" required aria-required="true" aria-invalid={!!errors?.email}
              aria-describedby={errors?.email ? 'cf-email-erro' : undefined} value={form.email} onChange={(e) => set('email', e.target.value)}
              className={inputBase} placeholder="nome@exemplo.pt" maxLength={160} />
          ),
        })}
        {Field({
          id: 'phone',
          label: 'Telefone',
          icon: Phone,
          children: (
            <input id="cf-phone" name="phone" type="tel" autoComplete="tel" aria-invalid={!!errors?.phone}
              aria-describedby={errors?.phone ? 'cf-phone-erro' : undefined} value={form.phone} onChange={(e) => set('phone', e.target.value)}
              className={inputBase} placeholder="+351 9XX XXX XXX" maxLength={20} />
          ),
        })}
        {Field({
          id: 'subject',
          label: 'Assunto',
          icon: Tag,
          required: true,
          children: (
            <input id="cf-subject" name="subject" required aria-required="true" aria-invalid={!!errors?.subject}
              aria-describedby={errors?.subject ? 'cf-subject-erro' : undefined} value={form.subject} onChange={(e) => set('subject', e.target.value)}
              className={inputBase} placeholder="Ex.: Pedido de informação" maxLength={160} />
          ),
        })}
      </div>

      {Field({
        id: 'message',
        label: 'Mensagem',
        icon: MessageSquare,
        required: true,
        children: (
          <textarea id="cf-message" name="message" rows={6} required aria-required="true" aria-invalid={!!errors?.message}
            aria-describedby={errors?.message ? 'cf-message-erro' : undefined} value={form.message} onChange={(e) => set('message', e.target.value)}
            className={`${inputBase} resize-y`} placeholder="Escreva aqui a sua mensagem" maxLength={4000} />
        ),
      })}

      {/* Campo anti-spam (não preencher) */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="cf-website">Não preencher</label>
        <input id="cf-website" tabIndex={-1} autoComplete="off" value={form.website} onChange={(e) => set('website', e.target.value)} />
      </div>

      <div className="rounded-md bg-secondary p-4">
        <div className="flex items-start gap-3">
          <input
            id="cf-consent"
            type="checkbox"
            required
            aria-required="true"
            aria-invalid={!!errors?.consent}
            aria-describedby={errors?.consent ? 'cf-consent-erro' : 'cf-consent-info'}
            checked={form.consent}
            onChange={(e) => set('consent', e.target.checked)}
            className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer accent-[hsl(var(--leaf))]"
          />
          <label htmlFor="cf-consent" className="cursor-pointer text-sm leading-relaxed text-foreground/85">
            Li e aceito a{' '}
            <Link href="/politica-privacidade" className="font-semibold text-leaf underline underline-offset-2 hover:text-primary">
              Política de Privacidade
            </Link>{' '}
            e dou o meu consentimento para o tratamento dos dados indicados, com a finalidade exclusiva de responder ao meu
            pedido. <span className="text-destructive" aria-hidden="true">*</span>
          </label>
        </div>
        {errors?.consent ? (
          <p id="cf-consent-erro" className="mt-2 text-xs font-medium text-destructive" role="alert">
            {errors.consent}
          </p>
        ) : null}
        <p id="cf-consent-info" className="mt-3 text-xs leading-relaxed text-muted-foreground">
          Os seus dados são tratados conforme o RGPD e a legislação nacional. Pode retirar o consentimento e exercer os seus
          direitos de acesso, retificação e apagamento a qualquer momento.
        </p>
      </div>

      <div className="flex flex-col-reverse items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-muted-foreground">
          <span className="text-destructive">*</span> Campos obrigatórios
        </p>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3 font-semibold text-primary-foreground shadow-soft transition hover:-translate-y-0.5 hover:bg-leaf hover:shadow-lift disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Send className="h-4 w-4" aria-hidden="true" />}
          {loading ? 'A enviar…' : 'Enviar mensagem'}
        </button>
      </div>
    </form>
  )
}
