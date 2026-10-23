from django.core.management.base import BaseCommand
from apps.users.models import University


class Command(BaseCommand):
    help = 'Popula o banco de dados com universidades e seus cursos'

    def handle(self, *args, **options):
        universities_data = [
            {
                'name': 'UEM — Universidade Eduardo Mondlane',
                'acronym': 'UEM',
                'country': 'Moçambique',
                'email_domain': 'uem.ac.mz',
                'courses': [
                    'Engenharia Informática',
                    'Engenharia Civil',
                    'Medicina',
                    'Direito',
                    'Economia',
                    'Gestão de Empresas',
                    'Arquitectura',
                    'Enfermagem',
                    'Educação',
                    'Jornalismo',
                    'Relações Internacionais',
                    'Matemática',
                    'Física',
                    'Química',
                    'Biologia',
                ],
            },
            {
                'name': 'ISCTEM — Instituto Superior de Ciências e Tecnologia de Moçambique',
                'acronym': 'ISCTEM',
                'country': 'Moçambique',
                'email_domain': 'isctem.ac.mz',
                'courses': [
                    'Engenharia Informática',
                    'Gestão de Empresas',
                    'Marketing',
                    'Contabilidade',
                    'Economia',
                ],
            },
            {
                'name': 'UCM — Universidade Católica de Moçambique',
                'acronym': 'UCM',
                'country': 'Moçambique',
                'email_domain': 'ucm.ac.mz',
                'courses': [
                    'Direito',
                    'Teologia',
                    'Educação',
                    'Gestão de Empresas',
                ],
            },
            {
                'name': 'UniLúrio — Universidade Lúrio',
                'acronym': 'UniLúrio',
                'country': 'Moçambique',
                'email_domain': 'unilúrio.ac.mz',
                'courses': [
                    'Medicina',
                    'Enfermagem',
                    'Educação',
                    'Engenharia Informática',
                ],
            },
            {
                'name': 'UP — Universidade Pedagógica',
                'acronym': 'UP',
                'country': 'Moçambique',
                'email_domain': 'up.ac.mz',
                'courses': [
                    'Educação',
                    'Matemática',
                    'Física',
                    'Química',
                    'Biologia',
                    'Português',
                    'Inglês',
                ],
            },
            {
                'name': 'ISRI — Instituto Superior de Relações Internacionais',
                'acronym': 'ISRI',
                'country': 'Moçambique',
                'email_domain': 'isri.ac.mz',
                'courses': [
                    'Relações Internacionais',
                    'Diplomacia',
                    'Direito Internacional',
                ],
            },
            {
                'name': 'A Politécnica — Universidade Politécnica',
                'acronym': 'A Politécnica',
                'country': 'Moçambique',
                'email_domain': 'politecnica.ac.mz',
                'courses': [
                    'Engenharia Informática',
                    'Engenharia Civil',
                    'Engenharia Electrónica',
                    'Gestão de Empresas',
                ],
            },
            {
                'name': 'USTM — Universidade São Tomás de Moçambique',
                'acronym': 'USTM',
                'country': 'Moçambique',
                'email_domain': 'ustm.ac.mz',
                'courses': [
                    'Direito',
                    'Gestão de Empresas',
                    'Economia',
                ],
            },
            {
                'name': 'ISPU — Instituto Superior Politécnico e Universitário',
                'acronym': 'ISPU',
                'country': 'Moçambique',
                'email_domain': 'ispu.ac.mz',
                'courses': [
                    'Engenharia Informática',
                    'Gestão de Empresas',
                    'Contabilidade',
                ],
            },
            {
                'name': 'ISCISA — Instituto Superior de Ciências de Saúde',
                'acronym': 'ISCISA',
                'country': 'Moçambique',
                'email_domain': 'iscisa.ac.mz',
                'courses': [
                    'Enfermagem',
                    'Saúde Pública',
                    'Farmácia',
                ],
            },
            {
                'name': 'UMUM — Universidade Metodista Unida de Moçambique',
                'acronym': 'UMUM',
                'country': 'Moçambique',
                'email_domain': 'umum.ac.mz',
                'courses': [
                    'Engenharia Informática',
                    'Educação',
                    'Gestão de Empresas',
                    'Desenvolvimento Comunitário',
                    'Teologia',
                    'Agricultura',
                ],
            },
            {
                'name': 'Universidade Joaquim Chissano',
                'acronym': 'UJC',
                'country': 'Moçambique',
                'email_domain': 'ujc.ac.mz',
                'courses': [
                    'Administração Pública',
                    'Relações Internacionais',
                    'Direito',
                    'Gestão de Empresas',
                    'Economia',
                    'Engenharia Informática',
                ],
            },
            {
                'name': 'Universidade Zambeze',
                'acronym': 'UniZambeze',
                'country': 'Moçambique',
                'email_domain': 'unizambeze.ac.mz',
                'courses': [
                    'Engenharia Informática',
                    'Engenharia Civil',
                    'Educação',
                    'Gestão de Empresas',
                    'Agricultura',
                    'Economia',
                ],
            },
            {
                'name': 'Universidade Jean Piaget de Moçambique',
                'acronym': 'UJPM',
                'country': 'Moçambique',
                'email_domain': 'ujpm.ac.mz',
                'courses': [
                    'Engenharia Informática',
                    'Educação',
                    'Agricultura',
                    'Psicologia',
                    'Gestão de Empresas',
                    'Enfermagem',
                ],
            },
            {
                'name': 'Universidade Mussa Bin Bique',
                'acronym': 'UMBB',
                'country': 'Moçambique',
                'email_domain': 'umbb.ac.mz',
                'courses': [
                    'Direito',
                    'Economia',
                    'Gestão de Empresas',
                    'Administração',
                    'Contabilidade',
                    'Engenharia Informática',
                ],
            },
            {
                'name': 'Universidade Save',
                'acronym': 'UniSave',
                'country': 'Moçambique',
                'email_domain': 'unisave.ac.mz',
                'courses': [
                    'Educação',
                    'Agricultura',
                    'Gestão de Empresas',
                    'Economia',
                    'Engenharia Informática',
                    'Desenvolvimento Rural',
                ],
            },
            {
                'name': 'Universidade Wutivi',
                'acronym': 'UniWutivi',
                'country': 'Moçambique',
                'email_domain': 'wutivi.ac.mz',
                'courses': [
                    'Engenharia Informática',
                    'Gestão de Empresas',
                    'Educação',
                    'Economia',
                    'Direito',
                    'Contabilidade',
                ],
            },
            {
                'name': 'Universidade Técnica de Moçambique',
                'acronym': 'UTM',
                'country': 'Moçambique',
                'email_domain': 'utm.ac.mz',
                'courses': [
                    'Engenharia Informática',
                    'Engenharia Civil',
                    'Engenharia Electrónica',
                    'Engenharia Mecânica',
                    'Gestão de Empresas',
                    'Tecnologia',
                ],
            },
            {
                'name': 'Instituto Superior Politécnico de Gaza',
                'acronym': 'ISPG',
                'country': 'Moçambique',
                'email_domain': 'ispg.ac.mz',
                'courses': [
                    'Agricultura',
                    'Agroecologia',
                    'Engenharia Informática',
                    'Engenharia Civil',
                    'Gestão de Empresas',
                    'Desenvolvimento Rural',
                ],
            },
            {
                'name': 'Instituto Superior Politécnico de Manica',
                'acronym': 'ISPM',
                'country': 'Moçambique',
                'email_domain': 'ispm.ac.mz',
                'courses': [
                    'Engenharia Informática',
                    'Engenharia Civil',
                    'Agricultura',
                    'Gestão de Empresas',
                    'Educação',
                    'Economia',
                ],
            },
        ]

        for uni_data in universities_data:
            university, created = University.objects.update_or_create(
                acronym=uni_data['acronym'],
                defaults={
                    'name': uni_data['name'],
                    'country': uni_data['country'],
                    'email_domain': uni_data['email_domain'],
                    'courses': uni_data['courses'],
                }
            )
            
            status = 'Criada' if created else 'Atualizada'
            self.stdout.write(
                self.style.SUCCESS(f'{status}: {university.name} com {len(university.courses)} cursos')
            )

        self.stdout.write(self.style.SUCCESS('Universidades populadas com sucesso!'))
