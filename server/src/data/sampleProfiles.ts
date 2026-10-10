export interface DemoProfile {
  id: string;
  name: string;
  title: string;
  education: string;
  experienceYears: number;
  targetRole: string;
  skills: string[];
  bio: string;
  resumeText: string;
  targetJobDescription: string;
}

export const DEMO_PROFILES: DemoProfile[] = [
  {
    id: 'demo_fullstack',
    name: 'Priya Sharma',
    title: 'Aspiring Full Stack Engineer',
    education: 'B.Tech in Computer Science (2025)',
    experienceYears: 1,
    targetRole: 'Full Stack Software Engineer',
    skills: ['JavaScript', 'React', 'HTML5', 'CSS3', 'Git', 'Node.js', 'SQL'],
    bio: 'Junior software developer with a strong foundation in modern web technologies and frontend state management. Passionate about building responsive user interfaces and robust web APIs.',
    resumeText: `PRIYA SHARMA
Bengaluru, India | priya.sharma@example.com | +91 98765 43210
LinkedIn: linkedin.com/in/priya-sharma-dev | GitHub: github.com/priyasharma-web

PROFESSIONAL SUMMARY
Motivated Software Developer with 1 year of hands-on experience building web applications using React, JavaScript, and Node.js. Seeking to transition into a Full Stack Software Engineer role to leverage expertise in component architecture and API integration.

EDUCATION
Bachelor of Technology in Computer Science and Engineering
National Institute of Technology | 2021 – 2025
CGPA: 8.6/10

TECHNICAL SKILLS
Languages: JavaScript (ES6+), TypeScript (Basic), Python, HTML5, CSS3, SQL
Frameworks & Libraries: React, Express.js, Node.js, Tailwind CSS, Bootstrap
Databases & Tools: PostgreSQL, MongoDB, Git, GitHub, Postman, VS Code

EXPERIENCE
Frontend Developer Intern | TechSpire Solutions, Bengaluru
July 2024 – December 2024
- Developed responsive client dashboard pages using React, Tailwind CSS, and Context API.
- Integrated 15+ RESTful API endpoints for user authentication, payment processing, and profile management.
- Improved web application page load speed by 28% by code splitting and optimizing image assets.
- Collaborated in a 5-member Agile scrum team with daily standups and bi-weekly sprint reviews.

PROJECTS
1. DevConnect – Developer Networking Platform
- Built a full-stack social platform enabling developers to share code snippets, articles, and job postings.
- Implemented user authentication with JSON Web Tokens (JWT) and bcrypt password hashing.
- Designed database schema in PostgreSQL with 6 normalized tables and indexed foreign keys.
- Deployed frontend to Vercel and backend service to Render, supporting 400+ active users.

2. CryptoPulse – Real-Time Cryptocurrency Tracker
- Developed cryptocurrency price tracker consuming CoinGecko public REST API with auto-polling every 30s.
- Visualized historical token pricing trends using Chart.js with customizable time horizons.
- Implemented persistent user watchlist using local browser storage.

CERTIFICATIONS
- Meta Front-End Developer Professional Certificate (Coursera)
- HackerRank Certified JavaScript (Intermediate)`,
    targetJobDescription: `Nexus Cloud Technologies - Junior Full Stack Engineer
Location: Bangalore, India (Hybrid)
We are seeking an ambitious Junior Full Stack Engineer to join our core cloud platform team.
Requirements:
- Strong proficiency in React, TypeScript, and modern JavaScript
- Hands-on experience building backend APIs with Node.js and Express.js
- Proficiency in relational databases such as PostgreSQL or MySQL
- Familiarity with containerization (Docker) and CI/CD pipelines
- Strong communication skills and collaborative team mindset`
  },
  {
    id: 'demo_ai_ml',
    name: 'Alex Chen',
    title: 'Data Science & ML Graduate',
    education: 'M.S. in Data Science (2025)',
    experienceYears: 1,
    targetRole: 'AI / Machine Learning Engineer',
    skills: ['Python', 'Pandas', 'NumPy', 'Scikit-Learn', 'PyTorch', 'SQL', 'Git'],
    bio: 'Data science graduate specializing in applied machine learning, exploratory statistical modeling, and LLM prompt engineering.',
    resumeText: `ALEX CHEN
San Francisco, CA | alex.chen@example.com | (555) 321-7654
LinkedIn: linkedin.com/in/alexchen-ai | GitHub: github.com/alexchen-ml

PROFESSIONAL SUMMARY
Applied Machine Learning Researcher and Graduate Data Scientist with strong skills in Python, PyTorch, Scikit-Learn, and statistical data modeling. Experienced in developing supervised learning pipelines, data preprocessing, and exploratory analytics.

EDUCATION
Master of Science in Data Science
University of California | 2023 – 2025 | GPA: 3.85/4.0
Bachelor of Science in Applied Mathematics | 2019 – 2023

TECHNICAL SKILLS
Languages & Frameworks: Python, SQL, PyTorch, Scikit-Learn, Pandas, NumPy, FastAPI
AI & Data Concepts: Machine Learning, NLP, Data Visualization, Feature Engineering, Regression, Random Forest
Tools & Platforms: Jupyter Notebooks, Docker, Git, AWS (S3, EC2), Streamlit

EXPERIENCE
Machine Learning Intern | Dataview Analytics, San Jose, CA
June 2024 – November 2024
- Built customer churn prediction model using Scikit-Learn (XGBoost) achieving 87% ROC-AUC score.
- Cleaned and normalized 500,000+ customer transaction rows using Pandas and automated imputation scripts.
- Developed an interactive data visualization dashboard in Streamlit to present model inference to stakeholders.
- Deployed inference endpoint as a containerized FastAPI service on AWS EC2.

PROJECTS
1. Medical Symptom Classifier & NLP Q&A
- Fine-tuned transformer models on biomedical texts for multi-label disease classification with 91% F1 score.
- Implemented semantic search over medical documentation using sentence-transformers and FAISS vector index.
- Created interactive web interface for clinicians to query treatment guidelines.

2. House Price Prediction Engine
- Conducted exploratory data analysis and feature engineering on 80+ residential property features.
- Evaluated Ridge, Lasso, and Gradient Boosting regressors, reducing RMSE by 18% over baseline models.

PUBLICATIONS & CERTIFICATIONS
- DeepLearning.AI Machine Learning Specialization (Andrew Ng)
- Co-author on workshop paper on tabular representation learning (NeurIPS Workshop 2024)`,
    targetJobDescription: `Cognitive Dynamics AI - Associate Machine Learning Engineer
Location: Hyderabad, India / Remote
Join our applied AI team to build production NLP and machine learning systems.
Requirements:
- Strong programming proficiency in Python, NumPy, Pandas, and PyTorch
- Experience building and evaluating ML models with Scikit-Learn
- Understanding of Generative AI, embeddings, and vector databases
- Experience deploying machine learning APIs via FastAPI or Flask
- Familiarity with Docker containerization and MLOps tools`
  }
];
