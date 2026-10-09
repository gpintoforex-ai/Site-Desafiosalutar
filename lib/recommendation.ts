import { z } from 'zod'

export const recommendationFields = [
  { name: 'goal', label: 'O que pretende melhorar ou esclarecer?', required: true, placeholder: 'Descreva o seu objetivo e o tipo de aconselhamento que procura.' },
  { name: 'symptoms', label: 'Sintomas e há quanto tempo (opcional)', placeholder: 'O que sente, duração e acompanhamento que já realizou.' },
  { name: 'conditions', label: 'Condições de saúde relevantes (opcional)', placeholder: 'Indique apenas o que considera necessário para este pedido.' },
  { name: 'medication', label: 'Medicamentos atuais (opcional)', placeholder: 'Nome, dose e frequência, se souber. Inclua medicação habitual e ocasional.' },
  { name: 'supplements', label: 'Suplementos, produtos naturais ou chás que utiliza (opcional)', placeholder: 'Nome, dose e frequência. Pode anexar uma fotografia da embalagem.' },
  { name: 'allergies', label: 'Alergias, intolerâncias ou reações anteriores (opcional)', placeholder: 'Alimentos, medicamentos, produtos naturais ou suplementos.' },
  { name: 'lifestyle', label: 'Alimentação, sono e atividade física (opcional)', placeholder: 'Hábitos ou restrições que possam ser relevantes.' },
  { name: 'notes', label: 'Outras informações ou preferências (opcional)', placeholder: 'Por exemplo: cápsulas, líquidos ou infusões; produtos que já experimentou.' },
] as const

const optionalText = z.string().trim().max(1800).default('')
export const recommendationSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(160).refine(v => !/[<>\r\n]/.test(v)),
  phone: z.string().trim().max(20).default('').refine(v => !v || /^[+\d\s()-]{9,20}$/.test(v)),
  age: z.coerce.number().int().min(18).max(120),
  pregnancy: z.enum(['não indicado', 'não se aplica', 'não', 'grávida', 'a amamentar']),
  goal: z.string().trim().min(10).max(1800),
  symptoms: optionalText, conditions: optionalText, medication: optionalText,
  supplements: optionalText, allergies: optionalText, lifestyle: optionalText, notes: optionalText,
  consent: z.literal(true), healthConsent: z.literal(true), website: z.string().max(200).default(''),
})
export const MAX_FILE_BYTES = 5 * 1024 * 1024
export const MAX_REQUEST_BYTES = 11 * 1024 * 1024

export async function validateAttachment(file: File) {
  if (!file.size || file.size > MAX_FILE_BYTES) throw new Error('Cada ficheiro deve ter entre 1 byte e 5 MB.')
  const bytes = Buffer.from(await file.arrayBuffer())
  const extension = file.name.split('.').pop()?.toLowerCase()
  let mime = ''
  if (extension === 'pdf' && bytes.subarray(0, 5).toString() === '%PDF-') mime = 'application/pdf'
  if ((extension === 'jpg' || extension === 'jpeg') && bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255) mime = 'image/jpeg'
  if (extension === 'png' && bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) mime = 'image/png'
  if (!mime || (file.type && file.type !== mime)) throw new Error('Anexe apenas ficheiros PDF, JPG ou PNG válidos.')
  return { bytes, mime, name: file.name.replace(/[^\p{L}\p{N} ._()-]/gu, '_').slice(-160) }
}
