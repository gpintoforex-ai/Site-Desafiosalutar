import Image from 'next/image'
import type { Brand } from '@/lib/site'

export function BrandMark({ brand, size = 'md' }: { brand: Brand; size?: 'md' | 'lg' }) {
  return (
    <div className={`relative flex shrink-0 items-center justify-center ${size === 'lg' ? `h-32 w-full ${brand.name === 'Nasófis' ? 'max-w-[220px]' : 'max-w-[280px]'}` : 'h-20 w-44'}`}>
      <Image
        src={brand.logo}
        alt={`Logótipo ${brand.name}`}
        fill
        sizes={size === 'lg' ? '(max-width: 640px) 70vw, 280px' : '176px'}
        className="object-contain"
      />
    </div>
  )
}
