import { X } from 'lucide-react'
import Button from '../ui/Button'

export default function TermsModal({ isOpen, onClose, onAccept }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-[#242526] rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-neutral-200 dark:border-[#3a3b3c]">
          <h2 className="text-lg font-bold text-neutral-900 dark:text-white">
            Termos de Serviço e Política de Privacidade
          </h2>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-sm text-neutral-700 dark:text-neutral-300">
          <section>
            <h3 className="font-bold text-neutral-900 dark:text-white mb-2">1. Termos de Serviço</h3>
            <p>
              Ao criar uma conta no AcadLink, concordas em cumprir com os nossos termos de serviço. 
              A plataforma é destinada a estudantes e profissionais da área académica.
            </p>
          </section>

          <section>
            <h3 className="font-bold text-neutral-900 dark:text-white mb-2">2. Responsabilidades do Utilizador</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>Manter a confidencialidade da tua senha</li>
              <li>Não partilhar a tua conta com outras pessoas</li>
              <li>Usar a plataforma de forma responsável e legal</li>
              <li>Não publicar conteúdo ofensivo ou ilegal</li>
              <li>Respeitar os direitos de autor e privacidade de outros</li>
            </ul>
          </section>

          <section>
            <h3 className="font-bold text-neutral-900 dark:text-white mb-2">3. Política de Privacidade</h3>
            <p>
              Recolhemos informações para melhorar a tua experiência no AcadLink. Os teus dados pessoais 
              serão protegidos de acordo com as leis de proteção de dados aplicáveis.
            </p>
          </section>

          <section>
            <h3 className="font-bold text-neutral-900 dark:text-white mb-2">4. Dados Recolhidos</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>Nome completo e email</li>
              <li>Universidade e curso</li>
              <li>Foto de perfil (opcional)</li>
              <li>Atividade na plataforma</li>
              <li>Dados de localização (opcional)</li>
            </ul>
          </section>

          <section>
            <h3 className="font-bold text-neutral-900 dark:text-white mb-2">5. Uso de Dados</h3>
            <p>
              Os teus dados serão usados para:
            </p>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li>Personalizar a tua experiência</li>
              <li>Enviar notificações relevantes</li>
              <li>Melhorar os nossos serviços</li>
              <li>Cumprir obrigações legais</li>
            </ul>
          </section>

          <section>
            <h3 className="font-bold text-neutral-900 dark:text-white mb-2">6. Segurança</h3>
            <p>
              Implementamos medidas de segurança para proteger os teus dados. No entanto, nenhum sistema 
              é 100% seguro. Recomendamos que uses uma senha forte e única.
            </p>
          </section>

          <section>
            <h3 className="font-bold text-neutral-900 dark:text-white mb-2">7. Direitos do Utilizador</h3>
            <p>
              Tens o direito de:
            </p>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li>Aceder aos teus dados pessoais</li>
              <li>Corrigir informações incorretas</li>
              <li>Solicitar a eliminação da tua conta</li>
              <li>Exportar os teus dados</li>
            </ul>
          </section>

          <section>
            <h3 className="font-bold text-neutral-900 dark:text-white mb-2">8. Limitação de Responsabilidade</h3>
            <p>
              O AcadLink não é responsável por danos indiretos, incidentais ou consequentes resultantes 
              do uso da plataforma.
            </p>
          </section>

          <section>
            <h3 className="font-bold text-neutral-900 dark:text-white mb-2">9. Alterações aos Termos</h3>
            <p>
              Podemos alterar estes termos a qualquer momento. Notificaremos os utilizadores sobre 
              alterações significativas.
            </p>
          </section>

          <section>
            <h3 className="font-bold text-neutral-900 dark:text-white mb-2">10. Contacto</h3>
            <p>
              Para questões sobre privacidade ou termos, contacta-nos em: privacy@acadlink.co.mz
            </p>
          </section>
        </div>

        {/* Footer */}
        <div className="border-t border-neutral-200 dark:border-[#3a3b3c] p-4 flex gap-3">
          <Button variant="secondary" fullWidth onClick={onClose}>
            Rejeitar
          </Button>
          <Button fullWidth onClick={onAccept}>
            Aceitar e Continuar
          </Button>
        </div>
      </div>
    </div>
  )
}
