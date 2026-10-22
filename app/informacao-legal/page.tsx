import type { Metadata } from 'next'
import Link from 'next/link'
import { PageHero } from '@/components/page-hero'
import { LegalLayout } from '@/components/legal-layout'
import { SITE } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Informação Legal',
  description:
    'Identificação da empresa, Livro de Reclamações Electrónico, resolução alternativa de litígios de consumo e informação sobre o custo das chamadas.',
  alternates: { canonical: '/informacao-legal' },
}

const TOC = [
  { id: 'identificacao', label: 'Identificação do prestador' },
  { id: 'livro-reclamacoes', label: 'Livro de Reclamações' },
  { id: 'ral-odr', label: 'Resolução de litígios (RAL/ODR)' },
  { id: 'custo-chamadas', label: 'Custo das chamadas' },
  { id: 'loja-online', label: 'Ausência de loja online' },
  { id: 'saude', label: 'Aviso de saúde' },
  { id: 'propriedade', label: 'Propriedade intelectual' },
  { id: 'responsabilidade', label: 'Responsabilidade' },
  { id: 'lei', label: 'Lei aplicável' },
]

export default function InformacaoLegalPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Informação Legal"
        subtitle="Identificação da empresa e informações obrigatórias para a proteção dos consumidores."
      />

      <LegalLayout toc={TOC}>
        <section id="identificacao">
          <h2>1. Identificação do prestador de serviços</h2>
          <p>Em cumprimento do artigo 10.º do Decreto-Lei n.º 7/2004, de 7 de janeiro (comércio electrónico):</p>
          <ul>
            <li>Denominação social: {SITE.legalName}</li>
            <li>Nome comercial: {SITE.name}</li>
            <li>Sede e estabelecimento: {SITE.fullAddress}</li>
            <li>NIF / NIPC: {SITE.nif}</li>
            <li>Registo: {SITE.registry}</li>
            <li>Capital social: {SITE.capital}</li>
            <li>CAE: {SITE.cae}</li>
            <li>
              Email: <a href={`mailto:${SITE.email}`}><span suppressHydrationWarning>{SITE.email}</span></a>
            </li>
            <li>
              Telefone (fixo): <span suppressHydrationWarning>{SITE.phone}</span> ({SITE.phoneCostNote})
            </li>
            <li>
              Telemóvel: <span suppressHydrationWarning>{SITE.mobilePhone}</span> ({SITE.mobilePhoneCostNote})
            </li>
          </ul>
        </section>

        <section id="livro-reclamacoes">
          <h2>2. Livro de Reclamações</h2>
          <p>
            Nos termos do Decreto-Lei n.º 156/2005, de 15 de setembro, na redação dada pelo Decreto-Lei n.º 74/2017, de 21
            de junho, o nosso estabelecimento dispõe de Livro de Reclamações em formato físico, disponível na loja, e em
            formato electrónico.
          </p>
          <p>
            Livro de Reclamações Electrónico:{' '}
            <a href="https://www.livroreclamacoes.pt" target="_blank" rel="noopener noreferrer">
              www.livroreclamacoes.pt<span className="sr-only"> (abre numa nova janela)</span>
            </a>
          </p>
          <p>
            Entidade fiscalizadora competente: ASAE — Autoridade de Segurança Alimentar e Económica.{' '}
            <a href="https://www.asae.gov.pt" target="_blank" rel="noopener noreferrer">
              www.asae.gov.pt<span className="sr-only"> (abre numa nova janela)</span>
            </a>
          </p>
        </section>

        <section id="ral-odr">
          <h2>3. Resolução Alternativa de Litígios de Consumo (RAL)</h2>
          <p>
            Em cumprimento da Lei n.º 144/2015, de 8 de setembro, informamos que, em caso de litígio de consumo, o
            consumidor pode recorrer a uma Entidade de Resolução Alternativa de Litígios de Consumo:
          </p>
          <ul>
            <li>
              CNIACC — Centro Nacional de Informação e Arbitragem de Conflitos de Consumo:{' '}
              <a href="https://www.cniacc.pt" target="_blank" rel="noopener noreferrer">
                www.cniacc.pt<span className="sr-only"> (abre numa nova janela)</span>
              </a>
            </li>
          </ul>
          <p>
            O concelho de Pombal está abrangido pela competência territorial do CNIACC. Consulte a{' '}
            <a href="https://www.cniacc.pt/pt/abrangencia-territorial" target="_blank" rel="noopener noreferrer">
              abrangência territorial do centro<span className="sr-only"> (abre numa nova janela)</span>
            </a>
            .
          </p>
          <p>
            Mais informações no Portal do Consumidor:{' '}
            <a href="https://www.consumidor.gov.pt" target="_blank" rel="noopener noreferrer">
              www.consumidor.gov.pt<span className="sr-only"> (abre numa nova janela)</span>
            </a>
            .
          </p>
          <h3>Plataforma europeia de Resolução de Litígios em Linha (ODR/RLL)</h3>
          <p>
            A plataforma europeia de resolução de litígios em linha, criada pelo Regulamento (UE) n.º 524/2013, foi
            desativada pela Comissão Europeia em 20 de julho de 2025, nos termos do Regulamento (UE) 2024/3228. Informação
            sobre alternativas disponíveis:{' '}
            <a href="https://ec.europa.eu/odr" target="_blank" rel="noopener noreferrer">
              ec.europa.eu/odr<span className="sr-only"> (abre numa nova janela)</span>
            </a>
            . Salientamos ainda que não realizamos vendas online.
          </p>
        </section>

        <section id="custo-chamadas">
          <h2>4. Custo das chamadas telefónicas</h2>
          <p>
            Em cumprimento do Decreto-Lei n.º 59/2021, de 14 de julho, informamos que a linha fixa{' '}
            <span suppressHydrationWarning>{SITE.phone}</span> é um número geográfico, pelo que o custo da chamada corresponde a
            uma <strong>chamada para a rede fixa nacional</strong>. As chamadas para o número de telemóvel{' '}
            <span suppressHydrationWarning>{SITE.mobilePhone}</span> correspondem a uma <strong>chamada para a rede móvel
            nacional</strong>. Em ambos os casos, de acordo com o tarifário contratado com o seu operador.
          </p>
        </section>

        <section id="loja-online">
          <h2>5. Ausência de loja online</h2>
          <p>
            Este site tem carácter exclusivamente informativo. Não é possível efetuar encomendas nem pagamentos através
            dele. Os produtos referidos podem ser adquiridos na nossa loja física, sujeitos a disponibilidade.
          </p>
        </section>

        <section id="saude">
          <h2>6. Aviso de saúde</h2>
          <p>
            A informação disponibilizada neste site tem carácter geral e não substitui o aconselhamento, diagnóstico ou
            tratamento por um médico ou outro profissional de saúde. Os suplementos alimentares não devem ser utilizados como
            substitutos de um regime alimentar variado e equilibrado e de um modo de vida saudável (Decreto-Lei n.º
            136/2003, de 28 de junho).
          </p>
        </section>

        <section id="propriedade">
          <h2>7. Propriedade intelectual</h2>
          <p>
            Os conteúdos deste site (textos, grafismo e logótipo) são propriedade da {SITE.name} ou utilizados com
            autorização. As marcas de terceiros mencionadas pertencem aos respetivos titulares. As fotografias são
            provenientes do banco de imagens Unsplash, utilizadas ao abrigo da respetiva licença.
          </p>
        </section>

        <section id="responsabilidade">
          <h2>8. Limitação de responsabilidade</h2>
          <p>
            Procuramos manter a informação actualizada e correta, mas não garantimos a ausência de erros. Não somos
            responsáveis pelo conteúdo de sites de terceiros para os quais existam ligações.
          </p>
        </section>

        <section id="lei">
          <h2>9. Lei aplicável</h2>
          <p>
            Aplica-se a lei portuguesa. Consulte também a nossa <Link href="/politica-privacidade">Política de Privacidade</Link>.
          </p>
        </section>
      </LegalLayout>
    </>
  )
}
