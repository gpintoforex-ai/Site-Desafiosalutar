import type { Metadata } from 'next'
import Link from 'next/link'
import { PageHero } from '@/components/page-hero'
import { LegalLayout } from '@/components/legal-layout'
import { ManageCookiesButton } from '@/components/manage-cookies-button'
import { SITE } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Política de Privacidade',
  description: 'Como a Ervanária Desafio Salutar recolhe, utiliza e protege os seus dados pessoais, nos termos do RGPD e da legislação nacional.',
  alternates: { canonical: '/politica-privacidade' },
}

const TOC = [
  { id: 'responsavel', label: 'Responsável pelo tratamento' },
  { id: 'dados', label: 'Dados recolhidos' },
  { id: 'finalidades', label: 'Finalidades e fundamento' },
  { id: 'conservacao', label: 'Prazo de conservação' },
  { id: 'destinatarios', label: 'Destinatários' },
  { id: 'direitos', label: 'Os seus direitos' },
  { id: 'cnpd', label: 'Reclamação à CNPD' },
  { id: 'cookies', label: 'Cookies' },
  { id: 'seguranca', label: 'Segurança' },
  { id: 'menores', label: 'Menores' },
  { id: 'alteracoes', label: 'Alterações' },
]

export default function PoliticaPrivacidadePage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Política de Privacidade"
        subtitle="Explicamos de forma clara como tratamos e protegemos os seus dados pessoais."
      >
        <p className="mt-6 text-sm text-primary-foreground/75">Última actualização: {SITE.privacyUpdated}</p>
      </PageHero>

      <LegalLayout toc={TOC}>
        <p>
          A {SITE.name} respeita a sua privacidade e compromete-se a proteger os seus dados pessoais, em conformidade com o
          Regulamento (UE) 2016/679 (Regulamento Geral sobre a Proteção de Dados — RGPD), a Lei n.º 58/2019, de 8 de agosto,
          e a Lei n.º 41/2004, de 18 de agosto, na sua redação actual.
        </p>

        <section id="responsavel">
          <h2>1. Responsável pelo tratamento</h2>
          <ul>
            <li>Denominação: {SITE.legalName} (nome comercial: {SITE.name})</li>
            <li>Sede: {SITE.fullAddress}</li>
            <li>NIF: {SITE.nif}</li>
            <li>
              Email para questões de privacidade: <a href={`mailto:${SITE.email}`}><span suppressHydrationWarning>{SITE.email}</span></a>
            </li>
            <li>
              Telefone: <span suppressHydrationWarning>{SITE.phone}</span> ({SITE.phoneCostNote})
            </li>
          </ul>
          <p>
            Dada a dimensão e natureza da actividade, não foi designado um Encarregado de Proteção de Dados. Quaisquer
            questões podem ser dirigidas para os contactos acima indicados.
          </p>
        </section>

        <section id="dados">
          <h2>2. Dados pessoais recolhidos</h2>
          <p>Recolhemos apenas os dados estritamente necessários:</p>
          <ul>
            <li>
              <strong>Formulário de contacto:</strong> nome, endereço de email, telefone (opcional), assunto e conteúdo da
              mensagem, bem como a data e hora do consentimento.
            </li>
            <li>
              <strong>Contactos por email ou telefone:</strong> os dados que nos fornecer voluntariamente.
            </li>
            <li>
              <strong>Preferências de cookies:</strong> guardadas no seu navegador (armazenamento local), sem identificação
              pessoal.
            </li>
          </ul>
          <p>
            Pedimos-lhe que não nos envie, através do formulário, dados relativos à saúde ou outras categorias especiais de
            dados. Se necessário, esse tipo de informação poderá ser abordado presencialmente na loja.
          </p>
        </section>

        <section id="finalidades">
          <h2>3. Finalidades e fundamento jurídico</h2>
          <ul>
            <li>
              <strong>Responder a pedidos de informação</strong> — fundamento: consentimento (art. 6.º, n.º 1, alínea a) do
              RGPD) e diligências pré-contratuais a pedido do titular (alínea b)).
            </li>
            <li>
              <strong>Cumprimento de obrigações legais</strong>, nomeadamente relativas ao Livro de Reclamações — fundamento:
              obrigação jurídica (alínea c)).
            </li>
            <li>
              <strong>Funcionamento e segurança do site</strong> — fundamento: interesse legítimo (alínea f)).
            </li>
          </ul>
          <p>Não utilizamos os seus dados para marketing, nem tomamos decisões automatizadas ou definimos perfis.</p>
        </section>

        <section id="conservacao">
          <h2>4. Prazo de conservação</h2>
          <p>
            Os dados enviados através do formulário de contacto são conservados pelo tempo necessário para responder ao seu
            pedido e, no máximo, durante [24 meses] após o último contacto, salvo se outro prazo for exigido por lei. Findo
            esse prazo, são apagados de forma segura.
          </p>
        </section>

        <section id="destinatarios">
          <h2>5. Destinatários e transferências</h2>
          <p>
            Não vendemos nem cedemos os seus dados a terceiros. Os dados podem ser tratados por subcontratantes que prestam
            serviços de alojamento e manutenção do site, vinculados por contrato ao cumprimento do RGPD. Caso algum
            subcontratante se encontre fora do Espaço Económico Europeu, a transferência é realizada com base em garantias
            adequadas, como as cláusulas contratuais-tipo aprovadas pela Comissão Europeia.
          </p>
          <p>
            Os dados poderão ainda ser comunicados a autoridades públicas quando tal resulte de obrigação legal.
          </p>
        </section>

        <section id="direitos">
          <h2>6. Os seus direitos</h2>
          <p>Nos termos do RGPD, tem o direito de:</p>
          <ul>
            <li>aceder aos seus dados pessoais;</li>
            <li>solicitar a retificação de dados inexatos ou incompletos;</li>
            <li>solicitar o apagamento dos dados (“direito a ser esquecido”);</li>
            <li>solicitar a limitação do tratamento;</li>
            <li>opor-se ao tratamento;</li>
            <li>solicitar a portabilidade dos dados;</li>
            <li>retirar o consentimento a qualquer momento, sem comprometer a licitude do tratamento já efetuado.</li>
          </ul>
          <p>
            Para exercer os seus direitos, contacte-nos através de{' '}
            <a href={`mailto:${SITE.email}`}><span suppressHydrationWarning>{SITE.email}</span></a> ou presencialmente na loja.
            Responderemos no prazo máximo de um mês.
          </p>
        </section>

        <section id="cnpd">
          <h2>7. Direito de reclamação à CNPD</h2>
          <p>
            Se considerar que o tratamento dos seus dados viola a legislação aplicável, pode apresentar reclamação à
            autoridade de controlo nacional: Comissão Nacional de Proteção de Dados (CNPD), Av. D. Carlos I, 134, 1.º,
            1200-651 Lisboa —{' '}
            <a href="https://www.cnpd.pt" target="_blank" rel="noopener noreferrer">
              www.cnpd.pt<span className="sr-only"> (abre numa nova janela)</span>
            </a>
            .
          </p>
        </section>

        <section id="cookies">
          <h2>8. Cookies</h2>
          <p>
            Cookies e tecnologias semelhantes são pequenos ficheiros ou registos guardados no seu dispositivo. Nos termos da
            Lei n.º 41/2004, só utilizamos tecnologias não essenciais com o seu consentimento prévio.
          </p>
          <h3>Categorias utilizadas</h3>
          <ul>
            <li>
              <strong>Estritamente necessários:</strong> memorização das suas preferências de cookies (armazenamento local,
              chave “nv-cookie-consent-v1”). Não requerem consentimento.
            </li>
            <li>
              <strong>Funcionais:</strong> mapa do Google Maps na página de contactos, apenas carregado após consentimento.
              A Google poderá instalar os seus próprios cookies, de acordo com a respetiva política de privacidade.
            </li>
            <li>
              <strong>Analíticos e marketing:</strong> actualmente não utilizados. Caso venham a ser implementados, só serão
              ativados com o seu consentimento.
            </li>
          </ul>
          <p>
            Pode alterar as suas preferências a qualquer momento: <ManageCookiesButton className="font-medium text-leaf underline underline-offset-2 hover:text-primary" label="gerir preferências de cookies" />.
            Pode também apagar os dados guardados através das definições do seu navegador.
          </p>
        </section>

        <section id="seguranca">
          <h2>9. Segurança</h2>
          <p>
            Adotamos medidas técnicas e organizativas adequadas para proteger os seus dados contra acesso não autorizado,
            perda ou destruição, incluindo comunicações cifradas (HTTPS) e acesso restrito aos dados.
          </p>
        </section>

        <section id="menores">
          <h2>10. Menores</h2>
          <p>
            O formulário de contacto destina-se a maiores de 13 anos, nos termos do art. 16.º da Lei n.º 58/2019. Abaixo
            dessa idade, o contacto deve ser feito pelos pais ou representantes legais.
          </p>
        </section>

        <section id="alteracoes">
          <h2>11. Alterações a esta política</h2>
          <p>
            Esta política pode ser actualizada para refletir alterações legais ou do funcionamento do site. A data da última
            actualização é indicada no topo desta página. Consulte também a nossa <Link href="/informacao-legal">Informação Legal</Link>.
          </p>
        </section>
      </LegalLayout>
    </>
  )
}
