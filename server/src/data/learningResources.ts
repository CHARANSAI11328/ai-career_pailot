export interface LearningResource {
  id: string;
  skillId: string;
  title: string;
  provider: string;
  url: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  cost: 'Free' | 'Freemium' | 'Paid';
  type: 'Official Documentation' | 'Interactive Course' | 'Specialization' | 'Video Tutorial' | 'Handbook';
  estimatedHours: number;
  description: string;
}

export const LEARNING_RESOURCES: LearningResource[] = [
  // React
  {
    id: 'res_react_official',
    skillId: 'react',
    title: 'React Official Documentation & Interactive Quick Start',
    provider: 'React.dev',
    url: 'https://react.dev/learn',
    level: 'Beginner',
    cost: 'Free',
    type: 'Official Documentation',
    estimatedHours: 15,
    description: 'The golden standard guide to modern React with Hooks, Server Components, and reactive state management.'
  },
  {
    id: 'res_react_fcc',
    skillId: 'react',
    title: 'Full Stack React & Redux Bootcamp',
    provider: 'freeCodeCamp',
    url: 'https://www.freecodecamp.org/learn/front-end-development-libraries/',
    level: 'Intermediate',
    cost: 'Free',
    type: 'Interactive Course',
    estimatedHours: 40,
    description: 'Comprehensive hands-on projects building stateful, reactive web apps.'
  },

  // TypeScript
  {
    id: 'res_ts_handbook',
    skillId: 'typescript',
    title: 'TypeScript Official Handbook & Type Playground',
    provider: 'TypeScriptLang.org',
    url: 'https://www.typescriptlang.org/docs/handbook/intro.html',
    level: 'Beginner',
    cost: 'Free',
    type: 'Official Documentation',
    estimatedHours: 12,
    description: 'Master generics, structural typing, utility types, and strict compiler configs.'
  },
  {
    id: 'res_ts_total',
    skillId: 'typescript',
    title: 'Total TypeScript Core Essentials',
    provider: 'TotalTypeScript (Matt Pocock)',
    url: 'https://www.totaltypescript.com/tutorials/beginners-typescript',
    level: 'Intermediate',
    cost: 'Free',
    type: 'Interactive Course',
    estimatedHours: 10,
    description: 'Interactive exercises on solving real-world TypeScript type gymnastics and API contracts.'
  },

  // Node.js & Express
  {
    id: 'res_node_official',
    skillId: 'nodejs',
    title: 'Node.js Architecture & Event Loop Deep Dive',
    provider: 'Nodejs.org',
    url: 'https://nodejs.org/en/learn',
    level: 'Intermediate',
    cost: 'Free',
    type: 'Official Documentation',
    estimatedHours: 14,
    description: 'Official guide to asynchronous I/O, streams, buffers, clustering, and worker threads.'
  },

  // PostgreSQL & SQL
  {
    id: 'res_pg_tutorial',
    skillId: 'postgresql',
    title: 'PostgreSQL Tutorial & Query Optimization Guide',
    provider: 'PostgreSQL Tutorial',
    url: 'https://www.postgresqltutorial.com/',
    level: 'Beginner',
    cost: 'Free',
    type: 'Handbook',
    estimatedHours: 20,
    description: 'Learn SQL joins, indexes, transactions, CTEs, and foreign keys with hands-on exercises.'
  },

  // Python & Machine Learning
  {
    id: 'res_python_fcc',
    skillId: 'python',
    title: 'Scientific Computing with Python',
    provider: 'freeCodeCamp',
    url: 'https://www.freecodecamp.org/learn/scientific-computing-with-python/',
    level: 'Beginner',
    cost: 'Free',
    type: 'Interactive Course',
    estimatedHours: 35,
    description: 'Python fundamentals, data structures, algorithms, and numerical computation.'
  },
  {
    id: 'res_ml_andrew_ng',
    skillId: 'machine_learning',
    title: 'Machine Learning Specialization',
    provider: 'DeepLearning.AI / Coursera',
    url: 'https://www.coursera.org/specializations/machine-learning-introduction',
    level: 'Intermediate',
    cost: 'Freemium',
    type: 'Specialization',
    estimatedHours: 60,
    description: 'Taught by Andrew Ng. Fundamental algorithms: linear regression, logistic regression, decision trees, neural networks.'
  },
  {
    id: 'res_pytorch_official',
    skillId: 'pytorch',
    title: 'Deep Learning with PyTorch: A 60 Minute Blitz',
    provider: 'PyTorch.org',
    url: 'https://pytorch.org/tutorials/beginner/deep_learning_60min_blitz.html',
    level: 'Intermediate',
    cost: 'Free',
    type: 'Official Documentation',
    estimatedHours: 12,
    description: 'Official introduction to tensors, autograd, neural network modules, and GPU acceleration.'
  },
  {
    id: 'res_genai_google',
    skillId: 'gen_ai',
    title: 'Generative AI for Developers & Gemini API Guide',
    provider: 'Google Cloud & DeepMind',
    url: 'https://ai.google.dev/docs',
    level: 'Intermediate',
    cost: 'Free',
    type: 'Official Documentation',
    estimatedHours: 15,
    description: 'Best practices for multimodal prompt engineering, function calling, structured outputs, and RAG architectures.'
  },

  // Docker & Kubernetes
  {
    id: 'res_docker_docs',
    skillId: 'docker',
    title: 'Docker Hands-On Container Workshop',
    provider: 'Docker Docs',
    url: 'https://docs.docker.com/get-started/',
    level: 'Beginner',
    cost: 'Free',
    type: 'Official Documentation',
    estimatedHours: 10,
    description: 'Building multi-stage Dockerfiles, managing networks, and structuring compose files.'
  },
  {
    id: 'res_k8s_basics',
    skillId: 'kubernetes',
    title: 'Kubernetes Interactive Tutorials & Architecture',
    provider: 'Kubernetes.io',
    url: 'https://kubernetes.io/docs/tutorials/kubernetes-basics/',
    level: 'Intermediate',
    cost: 'Free',
    type: 'Interactive Course',
    estimatedHours: 25,
    description: 'Deploying containerized apps, scaling pods, managing ingress, and configuring rolling updates.'
  },

  // AWS & Cloud
  {
    id: 'res_aws_fundamentals',
    skillId: 'aws',
    title: 'AWS Cloud Technical Essentials',
    provider: 'Amazon Web Services / Coursera',
    url: 'https://www.coursera.org/learn/aws-cloud-technical-essentials',
    level: 'Beginner',
    cost: 'Freemium',
    type: 'Interactive Course',
    estimatedHours: 18,
    description: 'Foundational cloud computing services: IAM, EC2, S3, RDS, Lambda, and VPC networking.'
  },

  // Data Analysis & Pandas
  {
    id: 'res_pandas_kaggle',
    skillId: 'pandas',
    title: 'Pandas Micro-Course & Data Cleaning',
    provider: 'Kaggle Learn',
    url: 'https://www.kaggle.com/learn/pandas',
    level: 'Beginner',
    cost: 'Free',
    type: 'Interactive Course',
    estimatedHours: 8,
    description: 'Practical data cleaning, grouping, sorting, filtering, and indexing on real Kaggle datasets.'
  },

  // System Design
  {
    id: 'res_sys_design_primer',
    skillId: 'system_design',
    title: 'The System Design Primer',
    provider: 'Donne Martin / GitHub',
    url: 'https://github.com/donnemartin/system-design-primer',
    level: 'Advanced',
    cost: 'Free',
    type: 'Handbook',
    estimatedHours: 40,
    description: 'Learn how to design large-scale systems, load balancers, caching strategies, replication, and CAP theorem.'
  }
];
