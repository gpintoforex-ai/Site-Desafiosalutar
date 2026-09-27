import Link from 'next/link'
import Image from 'next/image'
import { SITE } from '@/lib/site'

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link href="/" className="group flex items-center" aria-label={`${SITE.name} — página inicial`}>
      <Image
        src="/logo-desafio-salutar.png"
        alt={`${SITE.name} — logótipo`}
        width={160}
        height={64}
        className={`h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105 ${
          light ? 'brightness-0 invert' : ''
        }`}
        priority
      />
    </Link>
  )
}
