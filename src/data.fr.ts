import type { ProjectCard, ProjectDeepDive } from './types/project'

const projectCards: ProjectCard[] = [
  {
    icon: 'newspaper',
    iconColor: 'text-[#22c55e]',
    version: 'EN COURS // Oriente evenements',
    title: 'POLYNEWS',
    description:
      'Plateforme newsletter temps reel avec Django comme source de verite, Redis comme bus d evenements, diffusion WebSocket NestJS et interface React live.',
    tech: ['DJANGO', 'NESTJS', 'REDIS', 'REACT', 'DOCKER COMPOSE'],
    hoverText: 'group-hover:text-[#22c55e]',
  },
  {
    icon: 'music_note',
    iconColor: 'text-[#22c55e]',
    version: 'TERMINE // Equipe de 5',
    title: 'VIBETUNE AI',
    description:
      'Plateforme sociale musicale alimentee par IA avec API REST, messagerie temps reel via Django Channels + Redis, et support i18n (EN/FR/ES).',
    tech: ['DJANGO', 'REACT', 'REDIS', 'POSTGRESQL', 'DOCKER'],
    hoverText: 'group-hover:text-[#22c55e]',
  },
  {
    icon: 'router',
    iconColor: 'text-[#3b82f6]',
    version: 'C++ // Reseau TCP/IP',
    title: 'IRC_SERVER_C++',
    description:
      'Serveur IRC concurrent construit from scratch avec sockets bas niveau, I/O poll() non bloquant, et parsing robuste du protocole.',
    tech: ['C++', 'SOCKET API', 'POLL()', 'RFC 1459'],
    hoverText: 'group-hover:text-[#3b82f6]',
  },
  {
    icon: 'deployed_code',
    iconColor: 'text-[#22c55e]',
    version: 'INFRA // Style production',
    title: 'DOCKER_INFRASTRUCTURE',
    description:
      'Setup multi-conteneurs avec Docker Compose, reverse proxy Nginx + TLS, volumes persistants, et workflows de deploiement reproductibles.',
    tech: ['DOCKER', 'COMPOSE', 'NGINX', 'MARIADB', 'WORDPRESS'],
    hoverText: 'group-hover:text-[#22c55e]',
  },
  {
    icon: 'terminal',
    iconColor: 'text-[#3b82f6]',
    version: 'SYSTEME // API Unix',
    title: 'UNIX_SHELL_INTERPRETER',
    description:
      'Shell personnalise en C avec lexer/parser, pipes, redirections, expansion env, gestion de processus et signaux.',
    tech: ['C', 'POSIX', 'PIPES', 'VALGRIND', 'GDB'],
    hoverText: 'group-hover:text-[#3b82f6]',
  },
]

const projectDeepDives: Record<string, ProjectDeepDive> = {
  POLYNEWS: {
    architectureTitle: 'Noyau Django + bus Redis + gateway WebSocket NestJS + client React',
    architectureDiagram: [
      '[ Client React ] --> [ Gateway WS NestJS ] --> [ Bus Evenements Redis ]',
      '         |                         ^                       |',
      '         +--> [ API/Auth Django ]--+---- evenements metier-+',
      '                                    |',
      '                               [ PostgreSQL ]',
    ],
    keyChallenges: [
      'Maintenir des frontieres de services claires tout en garantissant une propagation fiable des evenements.',
      'Assurer la synchronisation temps reel avec Django comme source de verite.',
      'Gerer un flux JWT coherent entre API Django et canaux temps reel.',
    ],
    myContribution: [
      'Developpement des modules backend Django pour auth, gestion newsletter et logique metier.',
      'Conception des contrats d evenements publies sur Redis pour un traitement deterministe.',
      'Integration de la diffusion WebSocket NestJS avec mises a jour live React.',
      'Conteneurisation de l environnement local via Docker Compose pour une orchestration reproductible.',
    ],
    tradeoffs: [
      'Choix d une separation orientee evenements pour scaler, avec plus de complexite d integration.',
      'Conservation de Django comme source de verite et Redis pour propagation asynchrone.',
      'Priorite a la fiabilite des contrats d evenements avant d elargir les fonctionnalites.',
    ],
    proof: [
      'Notifications live livrees via WebSockets apres changements d etat backend.',
      'Sessions JWT valides sur les flux API et temps reel.',
      'Demarrage local multi-services stable avec Docker Compose.',
    ],
    eliteNext: [
      'Ajouter strategie retry + dead-letter pour consommateurs en echec.',
      'Introduire tests de contrat pour evenements Redis et schemas WebSocket.',
      'Ajouter observabilite pour latence evenements, taux de livraison et erreurs auth.',
    ],
  },
  'VIBETUNE AI': {
    architectureTitle: 'Client React + API Django + Channels/Redis + PostgreSQL',
    architectureDiagram: [
      '[ React SPA ] --> [ Django REST API ] --> [ PostgreSQL ]',
      '      |                  |',
      '      +--> [ WebSocket via Channels ] --> [ Redis Pub/Sub ]',
      '      |',
      '      +--> [ Reseau Docker Compose ]',
    ],
    keyChallenges: [
      'Maintenir des sessions websocket stables avec des utilisateurs concurrents.',
      'Eviter les endpoints lents quand les requetes timeline et recommandation montent en charge.',
      'Garder une coherence i18n entre labels frontend et contenu dynamique backend.',
    ],
    myContribution: [
      'Conception des contrats REST entre React et Django et implementation des endpoints cle.',
      'Implementation et optimisation de la messagerie temps reel avec Channels + Redis.',
      'Optimisation SQL et serializers pour reduire la latence API.',
      'Mise en place de la structure i18n EN/FR/ES pour contenu localise dynamique.',
    ],
    tradeoffs: [
      'Choix de Django Channels pour livrer vite plutot qu un service temps reel separe.',
      'Redis pub/sub pour faible latence, avec plus de complexite infra.',
      'Priorite a des frontieres API claires avant un split microservices.',
    ],
    proof: [
      'Livraison en equipe dans un environnement Dockerise reproductible.',
      'Messagerie concurrente basse latence validee en usage multi-utilisateurs.',
      'Amelioration mesurable du temps de reponse apres optimisation SQL.',
    ],
    eliteNext: [
      'Ajouter des dashboards de charge (Locust/k6 + Grafana) avec metriques de base.',
      'Introduire une queue async (Celery/RQ) avec garanties idempotentes.',
      'Renforcer la securite websocket via threat modeling et tests de defaillance.',
    ],
  },
  'IRC_SERVER_C++': {
    architectureTitle: 'Serveur event-loop mono-process avec poll() et parser protocolaire',
    architectureDiagram: [
      '[ Clients TCP ] --> [ Boucle accept ] --> [ Dispatcher poll() ]',
      '                                     |',
      '                                     +--> [ Parser IRC ] --> [ Etat Channel/User ]',
      '                                                     |',
      '                                                     +--> [ Handlers + reponses ]',
    ],
    keyChallenges: [
      'Gerer partial reads/writes sans casser l etat des commandes IRC.',
      'Gerer plusieurs clients de facon sure en event loop non bloquante.',
      'Assurer la conformite protocole pour auth, channels et actions operateur.',
    ],
    myContribution: [
      'Implementation du coeur socket/event-loop avec strategie poll() non bloquante.',
      'Implementation parser/routage commandes pour auth et operations channel.',
      'Ajout de gestion d erreurs de connexion pour garder la stabilite serveur.',
    ],
    tradeoffs: [
      'Modele poll() mono-process pour simplicite vs complexite multithread.',
      'Priorite au coeur protocolaire avant les features supplementaires.',
      'Discipline manuelle memoire/etat pour garder le controle C++.',
    ],
    proof: [
      'Gestion concurrente multi-clients sans bloquer la boucle serveur.',
      'Comportement stable pendant rafales join/part/message et reconnect.',
      'Parser robuste face aux entrees malformees et fragmentees.',
    ],
    eliteNext: [
      'Ajouter fuzzing pour renforcer le parser et couvrir les cas limites.',
      'Instrumenter le serveur avec compteurs latence/erreurs et profiling flamegraph.',
      'Explorer abstraction epoll pour meilleure scalabilite Linux.',
    ],
  },
  DOCKER_INFRASTRUCTURE: {
    architectureTitle: 'Reverse-proxy Nginx + services applicatifs + volumes persistants',
    architectureDiagram: [
      '[ Internet ] --> [ Terminaison TLS Nginx ] --> [ Service WordPress/PHP ]',
      '                                   |',
      '                                   +--> [ Service MariaDB ]',
      '                                   |',
      '                                   +--> [ Reseau Docker + volumes persistants ]',
    ],
    keyChallenges: [
      'Assurer isolation des services et communication inter-service propre.',
      'Configurer TLS et routage reverse proxy de facon fiable apres restart.',
      'Preserver les donnees via volumes lors des cycles de vie conteneurs.',
    ],
    myContribution: [
      'Conception topologie docker-compose, reseaux et frontieres de services.',
      'Configuration Nginx reverse proxy et routage HTTPS.',
      'Mise en place du stockage persistant et validation de durabilite.',
    ],
    tradeoffs: [
      'Deploiement base sur compose pour reproductibilite vs complexite orchestrateur.',
      'Stack proche production avec surcharge operationnelle limitee.',
      'Priorite a la reproduction locale deterministe plutot qu autoscaling avance.',
    ],
    proof: [
      'Demarrage reproductible avec services isoles et reseau stable.',
      'Routage TLS actif et connectivite backend stable apres redemarrage.',
      'Durabilite des donnees validee via reutilisation des volumes.',
    ],
    eliteNext: [
      'Ajouter health checks, garanties ordre de demarrage, tests de recovery.',
      'Introduire pipeline CI pour lint compose et validation config TLS.',
      'Preparer migration vers manifests Kubernetes avec checks de parite.',
    ],
  },
  UNIX_SHELL_INTERPRETER: {
    architectureTitle: 'Pipeline lexer + parser + executeur autour des syscalls POSIX',
    architectureDiagram: [
      '[ Input utilisateur ] --> [ Lexer ] --> [ Parser/AST ] --> [ Executeur ]',
      '                                         |',
      '                                         +--> [ Pipes/Redirections ]',
      '                                         |',
      '                                         +--> [ Expansion env + Signaux ]',
    ],
    keyChallenges: [
      'Tokenization/parsing correcte avec quotes, escapes et syntaxe limite.',
      'Coordination de processus pour pipes/redirections sans fuite FD.',
      'Comportement signal fiable entre shell parent et processus enfants.',
    ],
    myContribution: [
      'Implementation chaine lexer/parser et execution des commandes.',
      'Implementation pipes/redirections avec primitives POSIX.',
      'Amelioration stabilite memoire via debug Valgrind + GDB.',
    ],
    tradeoffs: [
      'Priorite a la correction/stabilite plutot qu a toutes les features shell.',
      'Controle processus explicite pour comportement previsible et debuggable.',
      'Acceptation de la complexite parser pour eviter logique ad-hoc fragile.',
    ],
    proof: [
      'Execution stable sur pipelines et redirections en chaine.',
      'Profil memoire plus propre apres cycles de leak hunting.',
      'Comportement signal/processus coherent en usage interactif.',
    ],
    eliteNext: [
      'Ajouter tests golden parser et tests de propriete pour la grammaire.',
      'Implementer suite de benchmark shell pour startup et throughput pipeline.',
      'Etendre vers job control avec tests de regression stricts.',
    ],
  },
}

const educationItems = [
  {
    school: 'Ecole 1337 (UM6P) - Khouribga, Maroc',
    program: 'Genie Logiciel & Architecture Numerique',
    details: [
      'Focus actuel: Common Core (fondamentaux CS en C/C++), puis full-stack avance et programmation systeme.',
      'Methode: apprentissage par projet, peer review, optimisation algorithmique, et auto-formation continue.',
    ],
  },
  {
    school: 'CPGE - Casablanca, Maroc',
    program: 'Mathematiques & Physique (MPSI/MP)',
    details: [
      'Preparation intensive en algebre, analyse et physique avec resolution analytique rigoureuse.',
    ],
  },
]

const skillGroups = [
  {
    category: 'Langages',
    value: 'C++, C, Python, TypeScript, JavaScript, SQL, Bash',
  },
  {
    category: 'Backend & Systeme',
    value: 'Django (DRF), Redis, Docker & Compose, Nginx, PostgreSQL, WebSockets (Channels)',
  },
  {
    category: 'Frontend',
    value: 'React.js, Tailwind CSS, Vite, i18n',
  },
  {
    category: 'DevOps & Outils',
    value: 'Git/GitHub, Linux (Debian), Makefile, GDB, Valgrind, Postman',
  },
]

export { projectCards, projectDeepDives, educationItems, skillGroups }
