import assert from 'assert';
import { CareerMatcher } from '../services/careerMatcher.js';
import { ContactExtractor } from '../services/contactExtractor.js';
import { DocumentParser } from '../services/documentParser.js';
import { JobMarketService } from '../services/jobMarketService.js';
import { ScoringEngine } from '../services/scoringEngine.js';
import { SkillExtractor } from '../services/skillExtractor.js';

let passed = 0;
let failed = 0;

function it(desc: string, fn: () => void | Promise<void>) {
  try {
    const res = fn();
    if (res instanceof Promise) {
      return res.then(() => {
        console.log(`  ✓ ${desc}`);
        passed++;
      }).catch(err => {
        console.error(`  ✗ ${desc}:`, err.message);
        failed++;
      });
    } else {
      console.log(`  ✓ ${desc}`);
      passed++;
    }
  } catch (err: any) {
    console.error(`  ✗ ${desc}:`, err.message);
    failed++;
  }
}

async function runTests() {
  console.log('\n========================================');
  console.log('🧪 Running CareerPilot AI Automated Tests');
  console.log('========================================\n');

  console.log('--- 1. Document Parsing & Validation ---');

  await it('Parses plain text resumes correctly', async () => {
    const sample = 'JOHN DOE\nSoftware Engineer\nSkills: React, Node.js, TypeScript';
    const buffer = Buffer.from(sample, 'utf-8');
    const result = await DocumentParser.parse(buffer, 'resume.txt', 'text/plain');
    assert.strictEqual(result.format, 'txt');
    assert.strictEqual(result.wordCount, 8);
    assert.strictEqual(result.isScannedSuspect, false);
  });

  await it('Rejects empty uploaded files with descriptive error', async () => {
    const buffer = Buffer.alloc(0);
    let thrown = false;
    try {
      await DocumentParser.parse(buffer, 'empty.txt', 'text/plain');
    } catch (err: any) {
      thrown = true;
      assert(err.message.includes('completely empty'));
    }
    assert(thrown, 'Should have thrown on 0 byte buffer');
  });

  await it('Rejects files exceeding 5MB size limit', async () => {
    const oversized = Buffer.alloc(6 * 1024 * 1024);
    let thrown = false;
    try {
      await DocumentParser.parse(oversized, 'huge.pdf', 'application/pdf');
    } catch (err: any) {
      thrown = true;
      assert(err.message.includes('exceeds the maximum 5MB'));
    }
    assert(thrown, 'Should have rejected oversized upload');
  });

  await it('Rejects unsupported file formats safely', async () => {
    const buffer = Buffer.from('executable binary code');
    let thrown = false;
    try {
      await DocumentParser.parse(buffer, 'resume.exe', 'application/x-msdownload');
    } catch (err: any) {
      thrown = true;
      assert(err.message.includes('Unsupported document type'));
    }
    assert(thrown);
  });

  console.log('\n--- 2. Section Segmentation & Contact Extraction ---');

  await it('Segments standard resume sections properly', () => {
    const resumeText = `Jane Doe\n\nPROFESSIONAL SUMMARY\nExperienced software engineer with 5 years building scalable web services.\n\nTECHNICAL SKILLS\nReact, TypeScript, Node.js, PostgreSQL\n\nWORK EXPERIENCE\nSenior Developer at TechCorp (2021-2024)\nBuilt microservices handling 10k req/sec.\n\nEDUCATION\nB.S. in Computer Science`;
    const sections = DocumentParser.segmentSections(resumeText);
    assert(sections.summary, 'Summary section should be segmented');
    assert(sections.skills, 'Skills section should be segmented');
    assert(sections.experience, 'Experience section should be segmented');
    assert(sections.education, 'Education section should be segmented');
  });

  await it('Extracts candidate contacts (Email, Phone, LinkedIn, GitHub)', () => {
    const resumeHeader = `ALEX CHEN\nSan Francisco, CA | alex.chen@example.com | (555) 321-7654\nlinkedin.com/in/alexchen-ai | github.com/alexchen-ml`;
    const contact = ContactExtractor.extract(resumeHeader);
    assert.strictEqual(contact.email, 'alex.chen@example.com');
    assert.strictEqual(contact.phone, '(555) 321-7654');
    assert(contact.linkedin?.includes('alexchen-ai'));
    assert(contact.github?.includes('alexchen-ml'));
  });

  console.log('\n--- 3. Skill Extraction & Taxonomy Normalization ---');

  await it('Extracts canonical skills from aliases (js -> JavaScript, k8s -> Kubernetes)', () => {
    const text = 'Developed apps using js, ts, reactjs, k8s, postgres, and aws cloud services.';
    const extracted = SkillExtractor.extractSkills(text);
    const names = extracted.map(s => s.name);
    assert(names.includes('JavaScript'), 'js alias should map to JavaScript');
    assert(names.includes('TypeScript'), 'ts alias should map to TypeScript');
    assert(names.includes('React'), 'reactjs alias should map to React');
    assert(names.includes('Kubernetes'), 'k8s alias should map to Kubernetes');
    assert(names.includes('PostgreSQL'), 'postgres alias should map to PostgreSQL');
  });

  console.log('\n--- 4. Deterministic Scoring Rubric & ATS Checks ---');

  await it('Detects metrics, flags weak verbs, and scores section completeness', () => {
    const strongResume = `PRIYA SHARMA
Bengaluru, India | priya@example.com | +91 9876543210
linkedin.com/in/priya-sharma | github.com/priyasharma

PROFESSIONAL SUMMARY
Results-driven software developer with extensive experience building scalable web applications, REST APIs, and microservices in agile teams.

WORK EXPERIENCE
Senior Full Stack Developer at TechSpire Solutions (2023 - Present)
- Engineered high throughput microservices in Node.js and TypeScript, reducing query latency by 35%.
- Scaled user concurrency to support 10,000+ active users with Redis caching and connection pooling.
- Architected automated deployment pipelines saving $50,000 annually in cloud infrastructure overhead.
- Spearheaded database migrations across 12 services with zero downtime.

EDUCATION
Bachelor of Technology in Computer Science and Engineering
National Institute of Technology | CGPA: 8.8/10

TECHNICAL SKILLS
Languages: JavaScript, TypeScript, Python, SQL, HTML5, CSS3
Frameworks: React, Express, Node.js, Tailwind CSS
Databases & Cloud: PostgreSQL, MongoDB, Docker, Git, AWS

PROJECTS
DevConnect - Developer Collaboration Platform
- Architected full stack social platform with JWT auth, optimistic updates, and PostgreSQL storage.
- Deployed to cloud supporting 500+ active beta testers.`;

    const sections = DocumentParser.segmentSections(strongResume);
    const skills = SkillExtractor.extractSkills(strongResume);
    const evalResult = ScoringEngine.evaluate(strongResume, sections, skills);

    assert(evalResult.scores.overall >= 70, `Score should be >= 70, got ${evalResult.scores.overall}`);
    assert(evalResult.scores.quantifiableImpact >= 60, 'Should detect quantifiable metrics like 35%, 10,000+, $50,000');
    assert(evalResult.scores.sectionCompleteness === 100, 'All 5 core sections present');
  });

  console.log('\n--- 5. Career & Job Matching Engine ---');

  await it('Computes explainable role matches with skill gaps', () => {
    const candidateSkills = ['React', 'JavaScript', 'Node.js', 'PostgreSQL', 'Git', 'TypeScript'];
    const matches = CareerMatcher.matchAgainstRoles(candidateSkills);
    assert(matches.length > 0, 'Should return matched benchmark roles');
    const topMatch = matches[0];
    assert(topMatch.matchScore >= 50, `Full Stack match score should be >= 50%, got ${topMatch.matchScore}`);
    assert(topMatch.matchedSkills.length > 0, 'Should have matched skills');
    assert(topMatch.recommendationReason.includes('evidence'), 'Should explain recommendation reason');
  });

  await it('Filters jobs by location and work mode accurately', () => {
    const remoteJobs = JobMarketService.searchJobs(undefined, undefined, 'Remote');
    assert(remoteJobs.every(j => j.workMode === 'Remote'), 'All returned jobs should be Remote');

    const hybridJobs = JobMarketService.searchJobs(undefined, undefined, 'Hybrid');
    assert(hybridJobs.every(j => j.workMode === 'Hybrid'), 'All returned jobs should be Hybrid');
  });

  console.log('\n========================================');
  console.log(`📊 Test Results: ${passed} passed, ${failed} failed`);
  console.log('========================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
