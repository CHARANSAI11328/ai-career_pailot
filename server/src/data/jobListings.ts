export interface JobListing {
  id: string;
  title: string;
  company: string;
  location: string;
  workMode: 'Remote' | 'Hybrid' | 'Onsite';
  experienceLevel: 'Entry' | 'Mid' | 'Senior';
  salaryRange: {
    currency: string;
    min: number;
    max: number;
    period: 'year' | 'month';
  };
  requiredSkills: string[];
  preferredSkills: string[];
  description: string;
  responsibilities: string[];
  postedDate: string;
  applicationUrl: string;
  source: string;
  isCuratedSample: boolean;
}

export const CURATED_JOB_LISTINGS: JobListing[] = [
  {
    id: 'job_001',
    title: 'Junior Full Stack Engineer',
    company: 'Nexus Cloud Technologies',
    location: 'Bangalore, India',
    workMode: 'Hybrid',
    experienceLevel: 'Entry',
    salaryRange: { currency: 'INR', min: 700000, max: 1100000, period: 'year' },
    requiredSkills: ['react', 'typescript', 'nodejs', 'express', 'postgresql'],
    preferredSkills: ['tailwind', 'docker', 'git'],
    description: 'We are looking for an ambitious Junior Full Stack Engineer to build high-performance client dashboards and microservices for our cloud management suite.',
    responsibilities: [
      'Implement reactive UI components using React 18, TypeScript, and Tailwind CSS',
      'Develop robust REST API endpoints in Node.js and Express with comprehensive validation',
      'Write optimized SQL queries and migrations for PostgreSQL databases',
      'Participate in code reviews, automated unit testing, and agile sprint planning'
    ],
    postedDate: '2026-03-28',
    applicationUrl: 'https://nexuscloud.example.com/careers/junior-fullstack-001',
    source: 'Verified Partner Employer Portal',
    isCuratedSample: true
  },
  {
    id: 'job_002',
    title: 'Associate Machine Learning Engineer',
    company: 'Cognitive Dynamics AI',
    location: 'Hyderabad, India',
    workMode: 'Hybrid',
    experienceLevel: 'Entry',
    salaryRange: { currency: 'INR', min: 850000, max: 1400000, period: 'year' },
    requiredSkills: ['python', 'machine_learning', 'scikit_learn', 'pytorch', 'pandas'],
    preferredSkills: ['gen_ai', 'docker', 'fastapi', 'sql'],
    description: 'Join our applied AI research team to train domain-specific NLP models and integrate generative AI agents into enterprise workflows.',
    responsibilities: [
      'Clean, preprocess, and engineer features across massive textual and tabular datasets',
      'Evaluate deep learning model accuracy using cross-validation and precision/recall benchmarks',
      'Serve ML models through lightweight FastAPI microservices',
      'Collaborate with data engineers to streamline automated training pipelines'
    ],
    postedDate: '2026-03-30',
    applicationUrl: 'https://cognitivedynamics.example.com/careers/associate-ml-002',
    source: 'Tech Talent Network',
    isCuratedSample: true
  },
  {
    id: 'job_003',
    title: 'Cloud DevOps Engineer',
    company: 'Aether Infrastructure Systems',
    location: 'San Francisco, CA (or Remote US)',
    workMode: 'Remote',
    experienceLevel: 'Mid',
    salaryRange: { currency: 'USD', min: 125000, max: 155000, period: 'year' },
    requiredSkills: ['aws', 'kubernetes', 'docker', 'terraform', 'ci_cd', 'linux'],
    preferredSkills: ['github_actions', 'monitoring', 'python', 'golang'],
    description: 'Help scale our multi-region Kubernetes clusters on AWS and build developer self-service deployment workflows.',
    responsibilities: [
      'Manage Amazon EKS clusters, VPC peering, and IAM zero-trust configurations',
      'Maintain Infrastructure-as-Code modules using Terraform and Terragrunt',
      'Improve CI/CD deployment cycle times by 40% with GitHub Actions matrix builds',
      'Instrument Prometheus, Grafana, and OpenTelemetry distributed tracing'
    ],
    postedDate: '2026-04-02',
    applicationUrl: 'https://aethersystems.example.com/careers/cloud-devops-003',
    source: 'Cloud Jobs Board',
    isCuratedSample: true
  },
  {
    id: 'job_004',
    title: 'Data Analyst - Growth & Product',
    company: 'FinPulse Mobility',
    location: 'Mumbai, India',
    workMode: 'Onsite',
    experienceLevel: 'Entry',
    salaryRange: { currency: 'INR', min: 650000, max: 1000000, period: 'year' },
    requiredSkills: ['sql', 'python', 'pandas', 'data_visualization', 'communication'],
    preferredSkills: ['postgresql', 'scikit_learn', 'problem_solving'],
    description: 'Seeking a curious Data Analyst to uncover user drop-off trends, build automated retention funnels, and advise product managers on growth experiments.',
    responsibilities: [
      'Write complex analytical SQL queries with CTEs, window functions, and partitioning',
      'Design interactive executive dashboards tracking Daily Active Users (DAU) and CAC',
      'Conduct exploratory data analysis in Python using Pandas, Seaborn, and Jupyter notebooks',
      'Present weekly experiment results to product and executive leadership'
    ],
    postedDate: '2026-04-05',
    applicationUrl: 'https://finpulse.example.com/careers/data-analyst-004',
    source: 'Analytics Hub',
    isCuratedSample: true
  },
  {
    id: 'job_005',
    title: 'Senior Frontend Architect',
    company: 'Starlight Interactive',
    location: 'New York, NY',
    workMode: 'Hybrid',
    experienceLevel: 'Senior',
    salaryRange: { currency: 'USD', min: 165000, max: 205000, period: 'year' },
    requiredSkills: ['react', 'typescript', 'nextjs', 'tailwind', 'system_design', 'web_accessibility'],
    preferredSkills: ['graphql_client', 'unit_testing', 'ci_cd'],
    description: 'Lead the frontend engineering modernization of our flagship consumer fintech application serving over 2M daily active users.',
    responsibilities: [
      'Architect design systems and component libraries adhering strictly to WCAG AAA standards',
      'Enforce TypeScript strict mode, code splitting, and sub-second Core Web Vitals',
      'Mentor mid-level and junior frontend developers through architectural design reviews',
      'Collaborate closely with UX researchers and product managers to refine design tokens'
    ],
    postedDate: '2026-04-06',
    applicationUrl: 'https://starlight.example.com/careers/sr-frontend-005',
    source: 'Global Tech Careers',
    isCuratedSample: true
  },
  {
    id: 'job_006',
    title: 'AI Solutions Engineer',
    company: 'Symphony Enterprise AI',
    location: 'London, UK (Remote EU/UK)',
    workMode: 'Remote',
    experienceLevel: 'Mid',
    salaryRange: { currency: 'GBP', min: 80000, max: 110000, period: 'year' },
    requiredSkills: ['python', 'gen_ai', 'langchain', 'rest_api', 'docker'],
    preferredSkills: ['pytorch', 'react', 'sql', 'system_design'],
    description: 'Design and deploy production-grade agentic workflows, function calling pipelines, and secure enterprise knowledge retrieval engines.',
    responsibilities: [
      'Build end-to-end RAG pipelines combining vector search, rerankers, and large language models',
      'Implement guardrails, prompt evaluation suites, and response moderation filters',
      'Package agentic workflows into secure containerized microservices',
      'Conduct client technical deep dives and proof-of-concept demonstrations'
    ],
    postedDate: '2026-04-07',
    applicationUrl: 'https://symphonyai.example.com/careers/solutions-engineer-006',
    source: 'AI Guild Portal',
    isCuratedSample: true
  }
];
