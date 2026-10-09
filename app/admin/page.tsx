import type { Metadata } from 'next'
import { AdminSmtp } from '@/components/admin-smtp'

export const metadata: Metadata = { title: 'Administração', robots: { index: false, follow: false } }
export default function AdminPage() { return <AdminSmtp /> }
