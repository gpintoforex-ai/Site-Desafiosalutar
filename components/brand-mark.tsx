import Image from 'next/image'
import type { Brand } from '@/lib/site'

export function BrandMark({ brand, size = 'md' }: { brand: Brand; size?: 'md' | 'lg' }) {
  return (
    <div className={`flex items-center justify-center ${size === 'lg' ? 'h-20' : 'h-14'}`}>
      <Image
        src={brand.logo}
        alt={`Logótipo ${brand.name}`}
        width={200}
        height={80}
        className="max-h-full w-auto object-contain"
      />
    </div>
  )
}
