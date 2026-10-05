export interface LegalScenario {
  id: string;
  name: string;
  badge: string;
  document_type: string;
  parties: string;
  terms: string;
  dates: string;
  jurisdiction: string;
  description: string;
}

export const PRESET_SCENARIOS: LegalScenario[] = [
  {
    id: 'freelance-contract',
    name: 'Freelance Work Contract',
    badge: 'Scenario 2 from Spec',
    document_type: 'Freelance Work Contract',
    parties: 'Jane Doe (Service Provider), TechNova Inc. (Client)',
    terms:
      'Work must be delivered by May 15, 2025; Payment will be made within 7 days of invoice; The client retains intellectual property rights; Confidentiality must be maintained at all times; Either party may terminate with 15 days notice',
    dates: 'April 15, 2025',
    jurisdiction: 'State of California',
    description: 'Contract for independent contractor services with milestone deliverables, IP assignment, and 7-day payment cycle.',
  },
  {
    id: 'employment-contract',
    name: 'Employment Contract',
    badge: 'Scenario 1 from Spec',
    document_type: 'Employment Contract',
    parties: 'Apex Technologies Inc. (Employer), David Vance (Employee)',
    terms:
      'Employee appointed as Senior Software Engineer; Base annual salary of $150,000 paid semi-monthly; Comprehensive healthcare and 401(k) match starting day 1; 20 paid vacation days per calendar year; Inventions and code created during employment are work-for-hire; 30 days written notice required for termination without cause',
    dates: 'May 1, 2025',
    jurisdiction: 'State of Delaware',
    description: 'Full-time employment agreement covering roles, compensation, benefits, IP assignment, and confidentiality.',
  },
  {
    id: 'residential-lease',
    name: 'Residential Lease Agreement',
    badge: 'Scenario 3 from Spec',
    document_type: 'Residential Lease Agreement',
    parties: 'Alice Smith (Tenant), XYZ Realty LLC (Landlord)',
    terms:
      'Premises located at 742 Evergreen Terrace, Unit 4B; Monthly rent of $2,450 payable on the 1st of each month; Security deposit of $3,500 held in designated escrow; Initial term duration of 12 full calendar months; Landlord provides water, sewer, and trash removal; Tenant maintains interior care and quiet hours after 10 PM',
    dates: 'June 1, 2025',
    jurisdiction: 'State of New York',
    description: 'Comprehensive residential tenancy lease with payment rules, deposit security, and landlord covenants.',
  },
  {
    id: 'mutual-nda',
    name: 'Non-Disclosure Agreement (NDA)',
    badge: 'Confidentiality',
    document_type: 'Mutual Non-Disclosure Agreement',
    parties: 'Beacon Innovations Corp. (Disclosing Party), Global Ventures LLC (Receiving Party)',
    terms:
      'Protection of proprietary trade secrets, software architecture, and financials; Confidentiality obligations remain binding for 3 years post-disclosure; Disclosure strictly limited to key personnel under written duty of secrecy; Return or certified destruction of materials upon written notice within 7 days; Breach entitles party to immediate injunctive relief',
    dates: 'April 10, 2025',
    jurisdiction: 'State of Texas',
    description: 'Bilateral NDA safeguarding confidential trade secrets, customer data, and proprietary discussions.',
  },
  {
    id: 'consulting-agreement',
    name: 'Consulting Services Agreement',
    badge: 'Advisory',
    document_type: 'Consulting Services Agreement',
    parties: 'Dr. Marcus Vance, Strategic Advisory Partners (Consultant), OmniCorp International (Client)',
    terms:
      'Consultant to deliver quarterly digital transformation roadmap and executive reviews; Retainer fee of $8,500 per month invoiced on the first of each month; Reimbursement of pre-approved travel expenses within 14 days; Independent contractor classification with no employee benefits; Non-solicitation of clients or employees for 12 months post-term',
    dates: 'May 15, 2025',
    jurisdiction: 'State of Illinois',
    description: 'High-level business consulting and advisory agreement with monthly retainer and restrictive covenants.',
  },
];

export const POPULAR_DOC_TYPES = [
  'Freelance Work Contract',
  'Employment Contract',
  'Non-Disclosure Agreement (NDA)',
  'Residential Lease Agreement',
  'Consulting Services Agreement',
  'Partnership Agreement',
  'Independent Contractor Agreement',
  'Cease & Desist Letter',
  'Power of Attorney',
  'Bill of Sale',
];
