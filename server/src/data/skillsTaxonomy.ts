export interface SkillDefinition {
  id: string;
  name: string;
  category: 'frontend' | 'backend' | 'database' | 'cloud_devops' | 'ai_data' | 'mobile' | 'security' | 'product_agile' | 'soft_skills';
  aliases: string[];
  description?: string;
}

export const SKILLS_TAXONOMY: SkillDefinition[] = [
  // Frontend
  { id: 'react', name: 'React', category: 'frontend', aliases: ['reactjs', 'react.js', 'react 18', 'react 19'] },
  { id: 'typescript', name: 'TypeScript', category: 'frontend', aliases: ['ts', 'typescript language'] },
  { id: 'javascript', name: 'JavaScript', category: 'frontend', aliases: ['js', 'es6', 'es6+', 'ecmascript'] },
  { id: 'html5', name: 'HTML5', category: 'frontend', aliases: ['html', 'semantic html'] },
  { id: 'css3', name: 'CSS3', category: 'frontend', aliases: ['css', 'cascading style sheets'] },
  { id: 'tailwind', name: 'Tailwind CSS', category: 'frontend', aliases: ['tailwindcss', 'tailwind'] },
  { id: 'nextjs', name: 'Next.js', category: 'frontend', aliases: ['next', 'nextjs'] },
  { id: 'vue', name: 'Vue.js', category: 'frontend', aliases: ['vue', 'vuejs', 'vue 3'] },
  { id: 'angular', name: 'Angular', category: 'frontend', aliases: ['angularjs', 'angular 2+'] },
  { id: 'svelte', name: 'Svelte', category: 'frontend', aliases: ['sveltejs', 'sveltekit'] },
  { id: 'redux', name: 'Redux', category: 'frontend', aliases: ['redux toolkit', 'rtk'] },
  { id: 'zustand', name: 'Zustand', category: 'frontend', aliases: ['zustand state'] },
  { id: 'vite', name: 'Vite', category: 'frontend', aliases: ['vitejs'] },
  { id: 'webpack', name: 'Webpack', category: 'frontend', aliases: ['module bundler'] },
  { id: 'sass', name: 'Sass/SCSS', category: 'frontend', aliases: ['sass', 'scss'] },
  { id: 'graphql_client', name: 'Apollo Client', category: 'frontend', aliases: ['apollo', 'urql'] },
  { id: 'web_accessibility', name: 'Web Accessibility (a11y)', category: 'frontend', aliases: ['a11y', 'wcag', 'aria'] },
  { id: 'responsive_design', name: 'Responsive Web Design', category: 'frontend', aliases: ['responsive design', 'mobile-first'] },

  // Backend
  { id: 'nodejs', name: 'Node.js', category: 'backend', aliases: ['node', 'nodejs'] },
  { id: 'express', name: 'Express.js', category: 'backend', aliases: ['express', 'expressjs'] },
  { id: 'nestjs', name: 'NestJS', category: 'backend', aliases: ['nest', 'nestjs framework'] },
  { id: 'python', name: 'Python', category: 'backend', aliases: ['python 3', 'python3', 'py'] },
  { id: 'django', name: 'Django', category: 'backend', aliases: ['django framework', 'django rest framework', 'drf'] },
  { id: 'fastapi', name: 'FastAPI', category: 'backend', aliases: ['fast api'] },
  { id: 'flask', name: 'Flask', category: 'backend', aliases: ['flask framework'] },
  { id: 'java', name: 'Java', category: 'backend', aliases: ['java 17', 'java 21', 'jdk'] },
  { id: 'springboot', name: 'Spring Boot', category: 'backend', aliases: ['spring', 'spring framework', 'spring mvc'] },
  { id: 'golang', name: 'Go (Golang)', category: 'backend', aliases: ['go', 'golang', 'goroutines'] },
  { id: 'csharp', name: 'C#', category: 'backend', aliases: ['c# .net', 'csharp'] },
  { id: 'dotnet', name: '.NET Core', category: 'backend', aliases: ['asp.net', 'dotnet', '.net'] },
  { id: 'rust', name: 'Rust', category: 'backend', aliases: ['rustlang'] },
  { id: 'cplusplus', name: 'C++', category: 'backend', aliases: ['cpp', 'c/c++'] },
  { id: 'rest_api', name: 'RESTful APIs', category: 'backend', aliases: ['rest api', 'restful api', 'rest', 'api development'] },
  { id: 'graphql', name: 'GraphQL', category: 'backend', aliases: ['graphql api', 'apollo server'] },
  { id: 'grpc', name: 'gRPC', category: 'backend', aliases: ['grpc protocol', 'protobuf'] },
  { id: 'microservices', name: 'Microservices Architecture', category: 'backend', aliases: ['microservices', 'distributed systems'] },
  { id: 'websockets', name: 'WebSockets', category: 'backend', aliases: ['socket.io', 'websocket'] },
  { id: 'message_queues', name: 'Message Queues', category: 'backend', aliases: ['rabbitmq', 'kafka', 'apache kafka', 'sqs', 'pub/sub', 'celery'] },

  // Database
  { id: 'postgresql', name: 'PostgreSQL', category: 'database', aliases: ['postgres', 'psql'] },
  { id: 'mysql', name: 'MySQL', category: 'database', aliases: ['mariadb'] },
  { id: 'mongodb', name: 'MongoDB', category: 'database', aliases: ['mongo', 'nosql mongodb'] },
  { id: 'redis', name: 'Redis', category: 'database', aliases: ['redis cache', 'in-memory db'] },
  { id: 'sqlite', name: 'SQLite', category: 'database', aliases: ['sqlite3'] },
  { id: 'prisma', name: 'Prisma ORM', category: 'database', aliases: ['prisma'] },
  { id: 'typeorm', name: 'TypeORM', category: 'database', aliases: ['type orm'] },
  { id: 'supabase', name: 'Supabase', category: 'database', aliases: ['supabase backend'] },
  { id: 'elasticsearch', name: 'Elasticsearch', category: 'database', aliases: ['elastic search', 'elk'] },
  { id: 'dynamodb', name: 'Amazon DynamoDB', category: 'database', aliases: ['dynamodb'] },
  { id: 'sql', name: 'SQL', category: 'database', aliases: ['structured query language', 'relational databases'] },
  { id: 'database_indexing', name: 'Database Query Optimization', category: 'database', aliases: ['query optimization', 'indexing', 'db tuning'] },

  // Cloud & DevOps
  { id: 'docker', name: 'Docker', category: 'cloud_devops', aliases: ['docker containers', 'containerization'] },
  { id: 'kubernetes', name: 'Kubernetes', category: 'cloud_devops', aliases: ['k8s', 'kube'] },
  { id: 'aws', name: 'Amazon Web Services (AWS)', category: 'cloud_devops', aliases: ['aws', 'amazon cloud', 'ec2', 's3', 'lambda'] },
  { id: 'gcp', name: 'Google Cloud Platform (GCP)', category: 'cloud_devops', aliases: ['gcp', 'google cloud', 'bigquery', 'cloud run'] },
  { id: 'azure', name: 'Microsoft Azure', category: 'cloud_devops', aliases: ['azure', 'azure cloud'] },
  { id: 'ci_cd', name: 'CI/CD Pipelines', category: 'cloud_devops', aliases: ['cicd', 'continuous integration', 'continuous deployment'] },
  { id: 'github_actions', name: 'GitHub Actions', category: 'cloud_devops', aliases: ['gh actions', 'github workflows'] },
  { id: 'terraform', name: 'Terraform', category: 'cloud_devops', aliases: ['infrastructure as code', 'iac'] },
  { id: 'linux', name: 'Linux', category: 'cloud_devops', aliases: ['ubuntu', 'bash', 'shell scripting', 'unix'] },
  { id: 'git', name: 'Git & Version Control', category: 'cloud_devops', aliases: ['git', 'github', 'gitlab', 'version control'] },
  { id: 'nginx', name: 'Nginx', category: 'cloud_devops', aliases: ['nginx reverse proxy'] },
  { id: 'monitoring', name: 'Monitoring & Observability', category: 'cloud_devops', aliases: ['prometheus', 'grafana', 'datadog', 'sentry', 'cloudwatch'] },

  // AI & Data Science
  { id: 'machine_learning', name: 'Machine Learning', category: 'ai_data', aliases: ['ml', 'supervised learning', 'unsupervised learning'] },
  { id: 'deep_learning', name: 'Deep Learning', category: 'ai_data', aliases: ['neural networks', 'ann', 'cnn', 'rnn'] },
  { id: 'nlp', name: 'Natural Language Processing (NLP)', category: 'ai_data', aliases: ['nlp', 'text processing', 'transformers', 'bert'] },
  { id: 'gen_ai', name: 'Generative AI & LLMs', category: 'ai_data', aliases: ['generative ai', 'genai', 'llm', 'llms', 'prompt engineering', 'rag'] },
  { id: 'pytorch', name: 'PyTorch', category: 'ai_data', aliases: ['torch'] },
  { id: 'tensorflow', name: 'TensorFlow', category: 'ai_data', aliases: ['tf', 'keras'] },
  { id: 'scikit_learn', name: 'Scikit-Learn', category: 'ai_data', aliases: ['sklearn'] },
  { id: 'pandas', name: 'Pandas', category: 'ai_data', aliases: ['python pandas', 'dataframe manipulation'] },
  { id: 'numpy', name: 'NumPy', category: 'ai_data', aliases: ['numerical python'] },
  { id: 'langchain', name: 'LangChain & LlamaIndex', category: 'ai_data', aliases: ['langchain', 'llamaindex'] },
  { id: 'data_visualization', name: 'Data Visualization', category: 'ai_data', aliases: ['matplotlib', 'seaborn', 'tableau', 'power bi'] },
  { id: 'computer_vision', name: 'Computer Vision', category: 'ai_data', aliases: ['cv', 'opencv', 'object detection'] },
  { id: 'feature_engineering', name: 'Feature Engineering', category: 'ai_data', aliases: ['data preprocessing', 'feature selection'] },
  { id: 'mlops', name: 'MLOps', category: 'ai_data', aliases: ['mlflow', 'model deployment', 'weights & biases'] },
  { id: 'spark', name: 'Apache Spark', category: 'ai_data', aliases: ['pyspark', 'spark streaming'] },

  // Mobile
  { id: 'react_native', name: 'React Native', category: 'mobile', aliases: ['rn', 'react-native'] },
  { id: 'flutter', name: 'Flutter', category: 'mobile', aliases: ['dart', 'flutter framework'] },
  { id: 'swift', name: 'Swift (iOS)', category: 'mobile', aliases: ['ios development', 'swiftui', 'xcode'] },
  { id: 'kotlin', name: 'Kotlin (Android)', category: 'mobile', aliases: ['android development', 'jetpack compose'] },

  // Security
  { id: 'cybersecurity', name: 'Cybersecurity Fundamentals', category: 'security', aliases: ['information security', 'infosec'] },
  { id: 'owasp', name: 'OWASP Top 10', category: 'security', aliases: ['appsec', 'web security vulnerabilities'] },
  { id: 'auth', name: 'Authentication & Authorization', category: 'security', aliases: ['oauth2', 'jwt', 'sso', 'rbac', 'identity management'] },
  { id: 'penetration_testing', name: 'Penetration Testing', category: 'security', aliases: ['pen testing', 'ethical hacking', 'kali linux'] },

  // Product & Agile
  { id: 'agile', name: 'Agile & Scrum', category: 'product_agile', aliases: ['scrum', 'kanban', 'sprint planning', 'agile methodology'] },
  { id: 'system_design', name: 'System Design & Architecture', category: 'product_agile', aliases: ['system design', 'software architecture', 'scalability'] },
  { id: 'ui_ux_design', name: 'UI/UX Design & Prototyping', category: 'product_agile', aliases: ['figma', 'wireframing', 'user research', 'prototyping'] },
  { id: 'product_management', name: 'Product Management', category: 'product_agile', aliases: ['roadmap planning', 'user stories', 'okrs', 'kpis'] },
  { id: 'unit_testing', name: 'Automated Testing', category: 'product_agile', aliases: ['unit testing', 'jest', 'vitest', 'cypress', 'playwright', 'tdd'] },

  // Soft Skills
  { id: 'communication', name: 'Technical Communication', category: 'soft_skills', aliases: ['written communication', 'presentation skills', 'documentation'] },
  { id: 'leadership', name: 'Team Leadership & Mentoring', category: 'soft_skills', aliases: ['mentorship', 'team lead', 'cross-functional collaboration'] },
  { id: 'problem_solving', name: 'Analytical Problem Solving', category: 'soft_skills', aliases: ['problem solving', 'troubleshooting', 'debugging'] },
  { id: 'time_management', name: 'Time & Project Prioritization', category: 'soft_skills', aliases: ['prioritization', 'deadline management'] }
];

// Helper mapping for fast lookup
export const ALIAS_MAP = new Map<string, SkillDefinition>();
SKILLS_TAXONOMY.forEach(skill => {
  ALIAS_MAP.set(skill.name.toLowerCase(), skill);
  ALIAS_MAP.set(skill.id.toLowerCase(), skill);
  skill.aliases.forEach(alias => {
    ALIAS_MAP.set(alias.toLowerCase(), skill);
  });
});
