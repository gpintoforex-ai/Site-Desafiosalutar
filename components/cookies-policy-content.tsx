import { ManageCookiesButton } from '@/components/manage-cookies-button'

// Shared server-rendered text keeps both policy locations consistent.
export function CookiesPolicyContent() {
  return (
    <>
          <p>
            Cookies e tecnologias semelhantes são pequenos ficheiros ou registos guardados no seu dispositivo. Nos termos da
            Lei n.º 41/2004, só utilizamos tecnologias não essenciais com o seu consentimento prévio.
          </p>
          <h3>Categorias utilizadas</h3>
          <ul>
            <li>
              <strong>Estritamente necessários:</strong> memorização das suas preferências de cookies (armazenamento local,
              chave “nv-cookie-consent-v2”, com as categorias e a data da escolha). Não requerem consentimento.
            </li>
            <li>
              <strong>Funcionais:</strong> mapa Google Maps e assistente virtual Abacus.AI, apenas carregados depois de aceitar esta categoria. Estes fornecedores podem receber dados técnicos, como endereço IP e informação do navegador, e utilizar as suas próprias tecnologias de armazenamento. Não introduza dados pessoais ou de saúde no assistente. Ao retirar o consentimento, o mapa é removido e a página é recarregada para interromper o assistente já carregado. A retirada não apaga dados anteriormente transmitidos nem cookies guardados nos domínios dos fornecedores.
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
    </>
  )
}
