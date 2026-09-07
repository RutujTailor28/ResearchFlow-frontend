import { PlanSectionItem, ResearchDepth } from '../types';

export const HEALTHCARE_DEFAULT_PLAN: PlanSectionItem[] = [
  {
    id: 'sec-01',
    orderNumber: '01',
    title: 'Introduction to AI in Healthcare',
    subQuestions: [
      'What constitutes clinical-grade artificial intelligence today?',
      'What are the primary hospital departments leading adoption?',
      'Why is adoption accelerating at an unprecedented rate post-2024?'
    ]
  },
  {
    id: 'sec-02',
    orderNumber: '02',
    title: 'Medical Diagnosis & Clinical Decision Support',
    subQuestions: [
      'How are multimodal foundation models transforming radiology and pathology?',
      'What quantifiable diagnostic accuracy improvements have multi-center trials demonstrated?',
      'How do AI copilot tools integrate into emergency triage and ICU monitoring?'
    ]
  },
  {
    id: 'sec-03',
    orderNumber: '03',
    title: 'Operational Efficiency & Clinician Burnout',
    subQuestions: [
      'How does ambient voice documentation reduce EHR burden and cognitive fatigue?',
      'What are the projected administrative savings in prior-authorization and billing?',
      'Can AI scheduling algorithms resolve chronic nurse and staff shortages?'
    ]
  },
  {
    id: 'sec-04',
    orderNumber: '04',
    title: 'Regulatory Oversight, Bias, & Patient Safety',
    subQuestions: [
      'How are the FDA and EMA regulating adaptive, continuous-learning clinical algorithms?',
      'What safeguards mitigate algorithmic bias across diverse demographic cohorts?',
      'What are the liability frameworks when an AI recommendation results in an adverse event?'
    ]
  },
  {
    id: 'sec-05',
    orderNumber: '05',
    title: 'Future Outlook: 2026–2031 Strategic Horizon',
    subQuestions: [
      'What will multidisciplinary surgical and oncology tumor boards look like by 2030?',
      'How will agentic autonomous clinical workflows interact with human specialists?',
      'What actionable governance steps must health system CIOs implement immediately?'
    ]
  }
];

export function getPlanForDepth(topic: string, depth: ResearchDepth): PlanSectionItem[] {
  if (depth === 'quick') {
    return [
      {
        id: 'sec-01',
        orderNumber: '01',
        title: `Core Overview & Current State: ${topic.slice(0, 35)}...`,
        subQuestions: [
          'What are the foundational technologies defining this domain?',
          'What are the most impactful immediate applications?'
        ]
      },
      {
        id: 'sec-02',
        orderNumber: '02',
        title: 'Key Industry Drivers & Practical Benefits',
        subQuestions: [
          'What economic and operational advantages are observed?',
          'How are industry leaders capturing measurable ROI?'
        ]
      },
      {
        id: 'sec-03',
        orderNumber: '03',
        title: 'Major Roadblocks & Near-Term Trajectory',
        subQuestions: [
          'What are the immediate friction points and regulatory hurdles?',
          'What will the landscape look like over the next 24 months?'
        ]
      }
    ];
  }

  if (depth === 'deep') {
    return [
      ...HEALTHCARE_DEFAULT_PLAN,
      {
        id: 'sec-06',
        orderNumber: '06',
        title: 'Technological Architecture: Foundation Models vs Specialized Ensembles',
        subQuestions: [
          'How do federated learning architectures preserve data sovereignty?',
          'What compute requirements and on-prem edge inferences are necessary?'
        ]
      },
      {
        id: 'sec-07',
        orderNumber: '07',
        title: 'Global Macroeconomic & Public Health Implications',
        subQuestions: [
          'How will developing nations leverage mobile AI diagnostics to bypass specialist deficits?',
          'What are the projected macroeconomic impacts on health insurance underwriting?'
        ]
      },
      {
        id: 'sec-08',
        orderNumber: '08',
        title: 'Synthesized Recommendations & Implementation Playbook',
        subQuestions: [
          'Phase 1 to Phase 4 hospital rollout checklist',
          'Metrics for auditing model calibration drift in production'
        ]
      }
    ];
  }

  return HEALTHCARE_DEFAULT_PLAN;
}
