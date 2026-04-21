import type { ProjectCard, ProjectDeepDive } from './types/project'

const projectCards: ProjectCard[] = [
  {
    icon: 'newspaper',
    iconColor: 'text-[#22c55e]',
    version: 'WIP · Event-Driven',
    title: 'POLYNEWS',
    description:
      'Real-time newsletter platform with Django as source of truth, Redis event bus, NestJS WebSocket delivery, and a React live notification UI.',
    tech: ['DJANGO', 'NESTJS', 'REDIS', 'REACT', 'DOCKER COMPOSE'],
    hoverText: 'group-hover:text-[#22c55e]',
  },
  {
    icon: 'music_note',
    iconColor: 'text-[#22c55e]',
    version: 'Done · Team of 5',
    title: 'VIBETUNE AI',
    description:
      'AI-powered social music platform with REST APIs, real-time messaging via Django Channels + Redis, and i18n support (EN/FR/ES).',
    tech: ['DJANGO', 'REACT', 'REDIS', 'POSTGRESQL', 'DOCKER'],
    hoverText: 'group-hover:text-[#22c55e]',
  },
  {
    icon: 'router',
    iconColor: 'text-[#3b82f6]',
    version: 'C++ // TCP/IP Networking',
    title: 'IRC_SERVER_C++',
    description:
      'Concurrent IRC server built from scratch using low-level sockets, with non-blocking poll() I/O and robust protocol parsing.',
    tech: ['C++', 'SOCKET API', 'POLL()', 'RFC 1459'],
    hoverText: 'group-hover:text-[#3b82f6]',
  },
  {
    icon: 'deployed_code',
    iconColor: 'text-[#22c55e]',
    version: 'INFRA // Production-like',
    title: 'DOCKER_INFRASTRUCTURE',
    description:
      'Multi-container setup with Docker Compose, Nginx reverse proxy + TLS, persistent volumes, and reproducible deployment workflows.',
    tech: ['DOCKER', 'COMPOSE', 'NGINX', 'MARIADB', 'WORDPRESS'],
    hoverText: 'group-hover:text-[#22c55e]',
  },
  {
    icon: 'terminal',
    iconColor: 'text-[#3b82f6]',
    version: 'SYSTEMS // Unix API',
    title: 'UNIX_SHELL_INTERPRETER',
    description:
      'Custom shell in C with lexer/parser, pipes, redirections, env expansion, process management, and signal handling.',
    tech: ['C', 'POSIX', 'PIPES', 'VALGRIND', 'GDB'],
    hoverText: 'group-hover:text-[#3b82f6]',
  },
]

const projectDeepDives: Record<string, ProjectDeepDive> = {
  POLYNEWS: {
    architectureTitle: 'Django core + Redis event bus + NestJS WebSocket gateway + React client',
    architectureDiagram: [
      '[ React Client ] --> [ NestJS WS Gateway ] --> [ Redis Event Bus ]',
      '         |                         ^                      |',
      '         +--> [ Django API/Auth ]--+---- business events-+',
      '                                    |',
      '                              [ PostgreSQL ]',
    ],
    keyChallenges: [
      'Keeping service boundaries clean while allowing reliable cross-service event propagation.',
      'Guaranteeing websocket updates stay in sync with the backend source of truth.',
      'Managing JWT auth flow consistently across Django API and real-time channels.',
    ],
    myContribution: [
      'Building Django backend modules for authentication, newsletter management, and core business logic.',
      'Designing event contracts published to Redis for deterministic downstream processing.',
      'Integrating NestJS websocket delivery with live frontend updates in React.',
      'Containerizing local development with Docker Compose for reproducible service orchestration.',
    ],
    tradeoffs: [
      'Chose event-driven separation to scale independently, accepting higher integration complexity.',
      'Kept Django as source of truth to simplify consistency, while using Redis for async propagation.',
      'Prioritized reliable event contracts before adding broader feature surface.',
    ],
    proof: [
      'Live notifications delivered through WebSockets after backend state changes.',
      'JWT-authenticated sessions validated across API and realtime flows.',
      'Consistent local multi-service bootstrapping and communication via Docker Compose.',
    ],
    eliteNext: [
      'Add message retry + dead-letter strategy for failed event consumers.',
      'Introduce contract tests for Redis events and websocket payload schemas.',
      'Add observability dashboards for event lag, delivery rate, and auth failures.',
    ],
  },
  'VIBETUNE AI': {
    architectureTitle: 'React client + Django API + Channels/Redis + PostgreSQL',
    architectureDiagram: [
      '[ React SPA ] --> [ Django REST API ] --> [ PostgreSQL ]',
      '      |                  |',
      '      +--> [ WebSocket via Channels ] --> [ Redis Pub/Sub ]',
      '      |',
      '      +--> [ Docker Compose network ]',
    ],
    keyChallenges: [
      'Keeping websocket sessions stable while users send messages concurrently.',
      'Avoiding slow endpoints when timeline and recommendation queries scaled up.',
      'Maintaining i18n consistency across frontend labels and dynamic backend content.',
    ],
    myContribution: [
      'Designed REST contracts between React and Django and implemented key API endpoints.',
      'Implemented and tuned real-time messaging flow with Channels + Redis.',
      'Optimized SQL queries and serializer patterns to reduce API latency.',
      'Shipped i18n structure for EN/FR/ES to support localized dynamic content.',
    ],
    tradeoffs: [
      'Chose Django Channels for speed of delivery over a fully separate realtime service.',
      'Used Redis-backed pub/sub for low latency, accepting extra infra complexity.',
      'Prioritized clear API boundaries over early microservice splitting.',
    ],
    proof: [
      'Team delivery in a Dockerized environment with reproducible local setup.',
      'Low-latency concurrent messaging demonstrated under multi-user usage.',
      'Measurable response-time improvements after query optimization.',
    ],
    eliteNext: [
      'Add load-test dashboards (Locust/k6 + Grafana) and publish baseline metrics.',
      'Introduce async task queue (Celery/RQ) with idempotent job guarantees.',
      'Harden with websocket auth threat-modeling and chaos-style failure drills.',
    ],
  },
  'IRC_SERVER_C++': {
    architectureTitle: 'Single-process event loop server with poll() and protocol parser',
    architectureDiagram: [
      '[ TCP Clients ] --> [ Socket accept loop ] --> [ poll() event dispatcher ]',
      '                                     |',
      '                                     +--> [ IRC parser ] --> [ Channel/User state ]',
      '                                                     |',
      '                                                     +--> [ Command handlers + replies ]',
    ],
    keyChallenges: [
      'Handling partial reads/writes without corrupting IRC command state.',
      'Managing concurrent clients safely in a non-blocking event loop.',
      'Maintaining protocol correctness for auth, channels, and operator actions.',
    ],
    myContribution: [
      'Built core socket/event-loop handling with non-blocking poll() strategy.',
      'Implemented parser/command routing for authentication and channel operations.',
      'Added connection error handling to keep server stable under churn.',
    ],
    tradeoffs: [
      'Used single-process poll() model for simplicity over multithreaded complexity.',
      'Focused on protocol core compliance first, then layered extra features.',
      'Accepted manual memory/state discipline to keep full control at C++ level.',
    ],
    proof: [
      'Concurrent multi-client handling without blocking the server loop.',
      'Stable behavior during join/part/message storms and reconnect cycles.',
      'Protocol parser robustness against malformed and fragmented input.',
    ],
    eliteNext: [
      'Add fuzzing for parser hardening and protocol edge-case coverage.',
      'Instrument server with latency/error counters and flamegraph profiling.',
      'Explore epoll abstraction for better Linux scalability under high connection count.',
    ],
  },
  DOCKER_INFRASTRUCTURE: {
    architectureTitle: 'Nginx reverse-proxy + app containers + durable data volumes',
    architectureDiagram: [
      '[ Internet ] --> [ Nginx TLS termination ] --> [ WordPress/PHP service ]',
      '                                   |',
      '                                   +--> [ MariaDB service ]',
      '                                   |',
      '                                   +--> [ Docker bridge network + persistent volumes ]',
    ],
    keyChallenges: [
      'Ensuring service isolation while preserving clean inter-service communication.',
      'Configuring TLS and reverse proxy routing reliably across container restarts.',
      'Persisting data safely with volumes during lifecycle changes.',
    ],
    myContribution: [
      'Designed docker-compose topology, networks, and service boundaries.',
      'Configured Nginx reverse proxy and HTTPS routing behavior.',
      'Set up persistent storage and validated restart durability.',
    ],
    tradeoffs: [
      'Used compose-based deployment for reproducibility vs orchestrator complexity.',
      'Kept stack close to production patterns while limiting operational overhead.',
      'Prioritized deterministic local reproduction over advanced autoscaling features.',
    ],
    proof: [
      'Reproducible environment startup with isolated services and networking.',
      'TLS-enabled routing and stable backend connectivity after restarts.',
      'Durable data verified through persistent volume reuse.',
    ],
    eliteNext: [
      'Add health checks, startup ordering guarantees, and failure recovery tests.',
      'Introduce CI pipeline that lint-tests compose and validates TLS config.',
      'Prepare migration path to Kubernetes manifests with parity checks.',
    ],
  },
  UNIX_SHELL_INTERPRETER: {
    architectureTitle: 'Lexer + parser + executor pipeline around POSIX syscalls',
    architectureDiagram: [
      '[ User Input ] --> [ Lexer ] --> [ Parser/AST ] --> [ Executor ]',
      '                                         |',
      '                                         +--> [ Pipes/Redirections ]',
      '                                         |',
      '                                         +--> [ Env expansion + Signal handling ]',
    ],
    keyChallenges: [
      'Correct tokenization/parsing under quotes, escapes, and edge-case syntax.',
      'Process coordination for pipelines and redirections without FD leaks.',
      'Reliable signal behavior across parent shell and child processes.',
    ],
    myContribution: [
      'Implemented lexer/parser path and command execution flow.',
      'Built pipe/redirection handling using POSIX primitives.',
      'Drove memory stability improvements with Valgrind + GDB debugging.',
    ],
    tradeoffs: [
      'Focused on correctness and stability over implementing every shell feature.',
      'Used explicit process control to keep behavior predictable and debuggable.',
      'Accepted complexity in parser design to avoid fragile ad-hoc execution logic.',
    ],
    proof: [
      'Stable command execution across chained pipelines and redirections.',
      'Cleaner memory profile after leak-hunting iterations.',
      'Consistent signal/process behavior under interactive usage.',
    ],
    eliteNext: [
      'Add parser golden-tests and property tests for command grammar safety.',
      'Implement shell benchmark suite for startup and pipeline throughput.',
      'Expand to job control features with strict regression tests.',
    ],
  },
}

const educationItems = [
  {
    school: '1337 Coding School (UM6P) - Khouribga, Morocco',
    program: 'Digital Technologies Architecture Program',
    details: [
      'Current focus: Common Core (CS fundamentals in C/C++), with full-stack and system programming coursework.',
      'Methodology: project-based learning, peer code reviews, algorithmic optimization, and autonomous self-directed learning.',
    ],
  },
  {
    school: 'CPGE - Casablanca, Morocco',
    program: 'Mathematics & Physics (MPSI/MP)',
    details: [
      'Intensive preparation in algorithmics, algebra, analysis, and physics with rigorous analytical problem solving.',
    ],
  },
]

const skillGroups = [
  {
    category: 'Languages',
    value: 'C++, C, Python, TypeScript, JavaScript, SQL, Bash',
  },
  {
    category: 'Backend & Systems',
    value: 'Django (DRF), Redis, Docker & Compose, Nginx, PostgreSQL, WebSockets (Channels)',
  },
  {
    category: 'Frontend',
    value: 'React.js, Tailwind CSS, Vite, i18n',
  },
  {
    category: 'DevOps & Tools',
    value: 'Git/GitHub, Linux (Debian), Makefile, GDB, Valgrind, Postman',
  },
]


export { projectCards, projectDeepDives, educationItems, skillGroups }