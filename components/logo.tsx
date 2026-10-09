import Link from 'next/link'
import Image from 'next/image'
import { SITE } from '@/lib/site'

export function Logo({ light = false, prominent = false }: { light?: boolean; prominent?: boolean }) {
  return (
    <Link href="/" className="group flex shrink-0 items-center" aria-label={`${SITE.name} — página inicial`}>
      <Image
        src="/logo-desafio-salutar-transparent.png"
        alt={`${SITE.name} — logótipo`}
        width={1974}
        height={797}
        className={`${prominent ? 'h-16 sm:h-20 lg:h-[88px]' : 'h-12'} w-auto object-contain transition-transform duration-300 group-hover:scale-105 ${
          light ? 'brightness-0 invert' : ''
        }`}
        priority
      />
    </Link>
  )
}
