export interface JobRoleDefinition {
  id: string;
  title: string;
  category: string;
  summary: string;
  coreSkills: string[];
  niceToHaveSkills: string[];
  entryRequirements: string[];
  beginnerProject: {
    title: string;
    description: string;
    tools: string[];
    deliverables: string[];
  };
  learningPriorities: string[];
  adjacentRoles: string[];
  salaryBenchmarks: {
    experience: 'entry' | 'mid' | 'senior';
    usdRange: [number, number];
    inrRange: [number, number];
    source: string;
  }[];
}

export const BENCHMARK_ROLES: JobRoleDefinition[] = [
  {
    id: 'fullstack_developer',
    title: 'Full Stack Software Engineer',
    category: 'Software Engineering',
    summary: 'Designs, develops, tests, and deploys scalable web applications spanning client-side interfaces and resilient backend systems.',
    coreSkills: ['react', 'typescript', 'javascript', 'nodejs', 'express', 'postgresql', 'sql', 'git', 'rest_api'],
    niceToHaveSkills: ['docker', 'tailwind', 'nextjs', 'redis', 'ci_cd', 'unit_testing', 'aws'],
    entryRequirements: [
      'Proficiency in at least one modern frontend framework (React, Vue, or Angular)',
      'Working knowledge of server-side programming (Node.js/Express, Python, or Go)',
      'Understanding of relational databases, SQL schemas, and RESTful API conventions',
      'Demonstrated portfolio with 2-3 end-to-end full stack projects'
    ],
    beginnerProject: {
      title: 'Real-Time Collaborative Task Board',
      description: 'A full-stack project tracking application with JWT authentication, optimistic UI updates, drag-and-drop task boards, and PostgreSQL storage.',
      tools: ['React', 'TypeScript', 'Node.js', 'Express', 'PostgreSQL', 'Tailwind CSS'],
      deliverables: ['Responsive UI', 'RESTful API with auth middleware', 'Database migration script', 'Deployed live link and GitHub repository']
    },
    learningPriorities: [
      'Master TypeScript type safety across API boundaries',
      'Understand relational data modeling and indexing',
      'Implement robust error handling and JWT session hygiene',
      'Deploy containerized services using Docker and Cloud providers'
    ],
    adjacentRoles: ['Frontend Engineer', 'Backend Engineer', 'DevOps Engineer', 'Solutions Architect'],
    salaryBenchmarks: [
      { experience: 'entry', usdRange: [75000, 105000], inrRange: [600000, 1200000], source: 'Aggregated Tech Hiring Benchmarks 2025-2026' },
      { experience: 'mid', usdRange: [110000, 150000], inrRange: [1400000, 2400000], source: 'Aggregated Tech Hiring Benchmarks 2025-2026' },
      { experience: 'senior', usdRange: [155000, 210000], inrRange: [2600000, 4800000], source: 'Aggregated Tech Hiring Benchmarks 2025-2026' }
    ]
  },
  {
    id: 'ai_ml_engineer',
    title: 'AI / Machine Learning Engineer',
    category: 'Artificial Intelligence',
    summary: 'Builds, trains, evaluates, and deploys production machine learning models, retrieval-augmented generation (RAG) pipelines, and intelligent AI services.',
    coreSkills: ['python', 'machine_learning', 'scikit_learn', 'pytorch', 'pandas', 'numpy', 'gen_ai', 'git'],
    niceToHaveSkills: ['nlp', 'deep_learning', 'langchain', 'docker', 'mlops', 'fastapi', 'spark', 'sql'],
    entryRequirements: [
      'Solid command of Python and data manipulation libraries (NumPy, Pandas)',
      'Theoretical and practical understanding of regression, classification, clustering, and neural networks',
      'Experience with modern model APIs, embeddings, and vector databases',
      'Ability to package model inference as a low-latency API endpoint'
    ],
    beginnerProject: {
      title: 'Context-Aware Document Q&A RAG System',
      description: 'An AI-powered document research assistant that parses PDFs, generates vector embeddings, retrieves relevant chunks, and answers technical questions with source citations.',
      tools: ['Python', 'FastAPI', 'PyTorch/Transformers', 'ChromaDB or pgvector', 'Streamlit or React'],
      deliverables: ['Vector retrieval pipeline', 'Chunking and reranking module', 'Evaluation benchmark measuring retrieval hallucination rate', 'Live demo']
    },
    learningPriorities: [
      'Foundations of mathematical modeling, loss functions, and evaluation metrics (Precision, Recall, F1, ROC-AUC)',
      'Fine-tuning vs Prompt Engineering vs RAG system design',
      'Production deployment and latency optimization with ONNX or TensorRT',
      'MLOps tracking and continuous model validation'
    ],
    adjacentRoles: ['Data Scientist', 'NLP Engineer', 'Data Engineer', 'AI Research Assistant'],
    salaryBenchmarks: [
      { experience: 'entry', usdRange: [90000, 125000], inrRange: [800000, 1500000], source: 'Global AI Compensation Index 2025-2026' },
      { experience: 'mid', usdRange: [130000, 180000], inrRange: [1800000, 3200000], source: 'Global AI Compensation Index 2025-2026' },
      { experience: 'senior', usdRange: [185000, 260000], inrRange: [3500000, 6500000], source: 'Global AI Compensation Index 2025-2026' }
    ]
  },
  {
    id: 'cloud_devops_engineer',
    title: 'Cloud & DevOps Platform Engineer',
    category: 'Cloud Infrastructure',
    summary: 'Automates infrastructure delivery, scales container orchestration platforms, and guarantees 99.99% system availability through modern SRE practices.',
    coreSkills: ['linux', 'docker', 'kubernetes', 'aws', 'ci_cd', 'github_actions', 'terraform', 'git'],
    niceToHaveSkills: ['gcp', 'monitoring', 'python', 'golang', 'nginx', 'microservices', 'owasp'],
    entryRequirements: [
      'Deep comfort with Linux system administration, bash scripting, and networking (DNS, TLS, VPC)',
      'Experience containerizing multi-tier applications and orchestrating them via Kubernetes manifests or Helm',
      'Infrastructure as Code proficiency with Terraform or OpenTofu',
      'CI/CD workflow automation implementing automated tests and canary releases'
    ],
    beginnerProject: {
      title: 'Zero-Downtime Microservice Deployment Pipeline',
      description: 'End-to-end GitOps delivery pipeline provisioning cloud resources with Terraform, containerizing an app, and deploying it with automated health checks to Kubernetes.',
      tools: ['Terraform', 'Docker', 'Kubernetes (minikube/k3s)', 'GitHub Actions', 'Prometheus & Grafana'],
      deliverables: ['IaC modules', 'GitHub Actions workflow file', 'Kubernetes deployment with rolling update strategy', 'Grafana alerting dashboard']
    },
    learningPriorities: [
      'Master Linux networking, permissions, and kernel troubleshooting',
      'Kubernetes internal architecture: pods, services, ingress, and configmaps',
      'State management and drift detection in Terraform',
      'Zero-trust security and secrets rotation (Vault, KMS)'
    ],
    adjacentRoles: ['Site Reliability Engineer (SRE)', 'Cloud Architect', 'Security Engineer', 'Backend Developer'],
    salaryBenchmarks: [
      { experience: 'entry', usdRange: [80000, 115000], inrRange: [700000, 1300000], source: 'DevOps & SRE Industry Report 2025-2026' },
      { experience: 'mid', usdRange: [120000, 165000], inrRange: [1600000, 2800000], source: 'DevOps & SRE Industry Report 2025-2026' },
      { experience: 'senior', usdRange: [165000, 230000], inrRange: [3000000, 5500000], source: 'DevOps & SRE Industry Report 2025-2026' }
    ]
  },
  {
    id: 'data_analyst',
    title: 'Data Analyst & Analytics Engineer',
    category: 'Data & Analytics',
    summary: 'Transforms raw business data into actionable strategic insights, automated analytical pipelines, and executive dashboards.',
    coreSkills: ['sql', 'python', 'pandas', 'data_visualization', 'problem_solving', 'communication'],
    niceToHaveSkills: ['postgresql', 'scikit_learn', 'feature_engineering', 'git', 'gcp'],
    entryRequirements: [
      'Advanced SQL (complex joins, window functions, CTEs, query optimization)',
      'Data exploration and statistical analysis in Python or R',
      'Dashboard creation experience in Power BI, Tableau, or Metabase',
      'Ability to articulate data-driven business impact to non-technical stakeholders'
    ],
    beginnerProject: {
      title: 'E-Commerce Cohort Retention & Churn Analysis',
      description: 'A comprehensive analytical study modeling user lifecycle retention, customer acquisition cost, and revenue churn using real transactional datasets.',
      tools: ['SQL', 'Python (Pandas, Seaborn)', 'PostgreSQL', 'Streamlit or Tableau'],
      deliverables: ['Normalized analytical schema', 'Cohort retention heatmap', 'Executive summary presentation', 'Reproducible analysis notebook']
    },
    learningPriorities: [
      'Master SQL window functions and analytical aggregations',
      'Hypothesis testing, A/B experimentation, and statistical significance',
      'Data storytelling and visual cognitive design',
      'Dimensional modeling (Kimball star schema)'
    ],
    adjacentRoles: ['Business Intelligence Engineer', 'Data Scientist', 'Product Analyst', 'Financial Analyst'],
    salaryBenchmarks: [
      { experience: 'entry', usdRange: [65000, 90000], inrRange: [500000, 950000], source: 'Analytics Market Survey 2025-2026' },
      { experience: 'mid', usdRange: [95000, 130000], inrRange: [1100000, 2000000], source: 'Analytics Market Survey 2025-2026' },
      { experience: 'senior', usdRange: [135000, 180000], inrRange: [2200000, 3800000], source: 'Analytics Market Survey 2025-2026' }
    ]
  },
  {
    id: 'product_manager',
    title: 'Technical Product Manager',
    category: 'Product & Strategy',
    summary: 'Leads cross-functional engineering, design, and business squads to discover customer needs, define roadmaps, and ship impactful software products.',
    coreSkills: ['product_management', 'agile', 'communication', 'leadership', 'problem_solving', 'ui_ux_design'],
    niceToHaveSkills: ['sql', 'system_design', 'data_visualization', 'rest_api'],
    entryRequirements: [
      'Proven track record writing clear Product Requirement Documents (PRDs) and user stories',
      'Strong empathy for user workflows combined with technical fluency to partner with engineering leads',
      'Data-driven decision making using product telemetry and user feedback loops',
      'Prior background in software engineering, design, or business analytics'
    ],
    beginnerProject: {
      title: 'Product Discovery & Spec: Micro-Learning AI SaaS',
      description: 'A complete end-to-end product design artifact including user personas, customer journey map, competitive landscape, PRD, wireframes, and release plan.',
      tools: ['Figma', 'Notion/Jira', 'SQL for funnel metrics', 'Whimsical flowcharts'],
      deliverables: ['Comprehensive PRD with functional specs', 'Interactive wireframe prototype', 'Go-To-Market and KPI tracking plan', 'Feature prioritization matrix (RICE score)']
    },
    learningPriorities: [
      'User discovery interviews and problem statement framing',
      'Prioritization frameworks (RICE, MoSCoW, Kano model)',
      'Technical communication and API architectural trade-offs',
      'Experimentation design and North Star metric definition'
    ],
    adjacentRoles: ['Product Owner', 'Scrum Master', 'Business Analyst', 'Startup Founder'],
    salaryBenchmarks: [
      { experience: 'entry', usdRange: [85000, 120000], inrRange: [900000, 1600000], source: 'Product Leadership Benchmark 2025-2026' },
      { experience: 'mid', usdRange: [125000, 175000], inrRange: [1800000, 3200000], source: 'Product Leadership Benchmark 2025-2026' },
      { experience: 'senior', usdRange: [180000, 250000], inrRange: [3500000, 6000000], source: 'Product Leadership Benchmark 2025-2026' }
    ]
  }
];
