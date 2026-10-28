import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";

export default function Privacy() {
  return (
    <div
      className="min-h-[100dvh] w-full flex flex-col items-center p-4 py-8 font-['Outfit',sans-serif]"
      style={{ background: "#00ACA9" }}
    >
      <div
        className="w-full max-w-[760px] bg-white rounded-2xl shadow-xl p-6 sm:p-10"
        data-testid="card-privacy"
      >
        <Link href="/"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#00ACA9] hover:underline mb-6"
            data-testid="link-back-home"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
        </Link>

        <h1 className="text-3xl font-extrabold text-[#0f3a39] mb-2">
          Política de Privacidade
        </h1>
        <p className="text-sm text-gray-500 mb-8">
          Última atualização: 2 de setembro de 2026
        </p>

        <div className="space-y-6 text-[15px] leading-relaxed text-[#1a3a3a]">
          <section>
            <h2 className="text-lg font-bold text-[#0f3a39] mb-2">
              1. Quem somos
            </h2>
            <p>
              O Markito é o Assistente de Marketing Digital da Rede Farmácias
              Associadas, criado para apoiar os associados da rede com
              orientações, sugestões e conteúdos relacionados ao marketing
              digital de suas farmácias.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[#0f3a39] mb-2">
              2. Dados que coletamos
            </h2>
            <p className="mb-2">
              Para oferecer um serviço útil e melhorar continuamente o
              assistente, coletamos as seguintes informações:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                Conteúdo das mensagens enviadas ao Markito (perguntas e
                respostas da conversa).
              </li>
              <li>
                Dados técnicos básicos de acesso, como endereço IP, tipo de
                navegador e horário de uso.
              </li>
              <li>
                Cliques em sugestões e botões de intenção, para entender quais
                temas são mais relevantes para os associados.
              </li>
            </ul>
            <p className="mt-2">
              Não solicitamos cadastro, e-mail, CPF, telefone ou qualquer outro
              dado pessoal sensível para o uso do assistente.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[#0f3a39] mb-2">
              3. Informações que não devem ser enviadas
            </h2>
            <p className="mb-2">
              O usuário não deve inserir nas conversas dados pessoais sensíveis,
              sigilosos ou desnecessários. Isso inclui, entre outros:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                Dados sobre saúde, histórico médico, diagnósticos, prescrições,
                uso de medicamentos, dados genéticos ou biométricos.
              </li>
              <li>
                Origem racial ou étnica, convicção religiosa, opinião política,
                filiação sindical e informações sobre vida sexual.
              </li>
              <li>
                CPF, RG, dados bancários ou financeiros, senhas, credenciais e
                códigos de acesso.
              </li>
              <li>
                Informações identificáveis de clientes, pacientes, colaboradores
                ou terceiros.
              </li>
              <li>
                Segredos comerciais, estratégias confidenciais e outras
                informações internas restritas da farmácia ou da Rede.
              </li>
            </ul>
            <p className="mt-2">
              Ao formular uma pergunta, utilize exemplos genéricos e compartilhe
              apenas as informações estritamente necessárias, sem identificar
              pessoas.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[#0f3a39] mb-2">
              4. Como usamos os dados
            </h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Gerar respostas e sugestões personalizadas ao associado.</li>
              <li>
                Analisar os temas mais procurados para criar novos conteúdos e
                materiais úteis à rede.
              </li>
              <li>
                Garantir a segurança, o bom funcionamento e a melhoria contínua
                do serviço.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[#0f3a39] mb-2">
              5. Compartilhamento com terceiros
            </h2>
            <p>
              Para gerar as respostas do assistente, o conteúdo das mensagens é
              processado por provedores de inteligência artificial (como a
              OpenAI). Esses provedores tratam os dados apenas para o
              processamento da resposta. Não vendemos, alugamos ou compartilhamos
              dados com terceiros para fins comerciais ou de marketing
              independente.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[#0f3a39] mb-2">
              6. Armazenamento e segurança
            </h2>
            <p>
              As conversas e dados de uso são armazenados em ambiente seguro,
              protegidos por mecanismos técnicos e administrativos. O acesso aos
              dados é restrito à equipe responsável pela operação do Markito e
              pela administração da Rede Farmácias Associadas.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[#0f3a39] mb-2">
              7. Direitos do usuário (LGPD)
            </h2>
            <p>
              Em conformidade com a Lei Geral de Proteção de Dados (Lei nº
              13.709/2018), você pode solicitar a qualquer momento:
            </p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>Confirmação de tratamento e acesso aos seus dados.</li>
              <li>Correção de dados incompletos ou desatualizados.</li>
              <li>
                Exclusão de dados pessoais tratados com base no seu consentimento.
              </li>
              <li>
                Informações sobre com quem seus dados são compartilhados.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[#0f3a39] mb-2">
              8. Cookies
            </h2>
            <p>
              O Markito utiliza cookies essenciais para identificar a sessão de
              conversa e manter o acesso seguro ao painel administrativo. Esses
              cookies não ficam acessíveis ao JavaScript da página e são
              transmitidos por conexão segura. O cookie da conversa tem validade
              de até 24 horas; a sessão administrativa expira após duas horas e
              é revogada ao sair do painel. Não utilizamos cookies de
              rastreamento publicitário.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[#0f3a39] mb-2">
              9. Conteúdo gerado por IA e limites de uso
            </h2>
            <p className="mb-2">
              As respostas do Markito são geradas por inteligência artificial e
              têm caráter exclusivamente informativo e de apoio. O Markito não
              substitui a avaliação humana e não toma decisões em nome do usuário,
              da farmácia ou da Rede Farmácias Associadas.
            </p>
            <p>
              O Markito não presta aconselhamento nem toma decisões de natureza
              empresarial, estratégica, comercial, jurídica, contábil, financeira,
              fiscal, farmacêutica, clínica ou médica. Ele não realiza diagnósticos,
              não prescreve medicamentos e não orienta tratamentos. Toda informação
              relevante deve ser conferida, e qualquer decisão deve ser tomada pelo
              usuário e validada com a equipe da Rede ou com profissionais
              qualificados da área correspondente.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[#0f3a39] mb-2">
              10. Alterações desta política
            </h2>
            <p>
              Esta política pode ser atualizada periodicamente para refletir
              melhorias no serviço ou alterações na legislação. A data da última
              atualização será sempre exibida no topo desta página.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[#0f3a39] mb-2">
              11. Contato
            </h2>
            <p>
              Em caso de dúvidas, solicitações ou exercício de direitos
              relativos aos seus dados, entre em contato com a Rede Farmácias
              Associadas através dos canais oficiais disponíveis em{" "}
              <a
                href="https://linktr.ee/redefarmaciasassociadas"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#00ACA9] font-semibold underline"
              >
                linktr.ee/redefarmaciasassociadas
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
