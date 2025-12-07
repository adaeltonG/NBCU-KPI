// ============================================
// KPI REPORT TOOL - MOCK DATA
// Based on NBCU Monthly Scorecard Excel Structure
// ============================================

import type { Category, KPI, Period, KPIScore, ClientScore, ServiceLine, User, Action } from '../types';

// Service Lines
export const serviceLines: ServiceLine[] = [
  { id: 'sl-1', name: 'All Service Lines' },
  { id: 'sl-2', name: 'Catering' },
  { id: 'sl-3', name: 'Catering lvl 3/ lvl10' },
  { id: 'sl-4', name: 'Events' },
  { id: 'sl-5', name: 'Front of House' },
  { id: 'sl-6', name: 'Cleaning' },
  { id: 'sl-7', name: 'Security' },
  { id: 'sl-8', name: 'Waste' },
  { id: 'sl-9', name: 'Hard FM - Statutory PPM' },
  { id: 'sl-10', name: 'Hard FM - Routine PPM' },
  { id: 'sl-11', name: 'Hard FM - Routine Reactive Tasks' },
  { id: 'sl-12', name: 'Project Works' },
];

// Categories based on Excel groupings
export const categories: Category[] = [
  {
    id: 'cat-1',
    name: 'HSEQ',
    shortName: 'HSEQ',
    description: 'Health, Safety, Environment & Quality (Items 1-3)',
    color: '#7c3aed',
    icon: 'Shield',
    sortOrder: 1,
  },
  {
    id: 'cat-2',
    name: 'Customer/Stakeholder Satisfaction',
    shortName: 'Customer',
    description: 'Leading Customer/Stakeholder satisfaction (Items 4-16)',
    color: '#0891b2',
    icon: 'Users',
    sortOrder: 2,
  },
  {
    id: 'cat-3',
    name: 'People - Retention & Development',
    shortName: 'People',
    description: 'People - Retention & Development (Items 17, 18)',
    color: '#db2777',
    icon: 'UserCheck',
    sortOrder: 3,
  },
  {
    id: 'cat-4',
    name: 'Finance - Variable Billing',
    shortName: 'Finance',
    description: 'Accuracy and Timeliness of Variable Billing Finance (Item 19)',
    color: '#059669',
    icon: 'DollarSign',
    sortOrder: 4,
  },
  {
    id: 'cat-5',
    name: 'Project Management',
    shortName: 'Projects',
    description: 'Project Management (Item 20)',
    color: '#d97706',
    icon: 'FolderKanban',
    sortOrder: 5,
  },
  {
    id: 'cat-6',
    name: 'Reports Accuracy/Timeliness',
    shortName: 'Reports',
    description: 'Accuracy and Timeliness of Reports (Item 21)',
    color: '#2563eb',
    icon: 'FileText',
    sortOrder: 6,
  },
  {
    id: 'cat-7',
    name: 'Supporting NBCU',
    shortName: 'Support',
    description: 'Supporting NBCU (Item 22)',
    color: '#4f46e5',
    icon: 'Handshake',
    sortOrder: 7,
  },
  {
    id: 'cat-8',
    name: 'Processes & Procedures',
    shortName: 'Process',
    description: 'Processes & Procedures (Item 23)',
    color: '#0d9488',
    icon: 'ClipboardList',
    sortOrder: 8,
  },
];

// Users
export const users: User[] = [
  { id: 'user-1', email: 'admin@sodexo.com', name: 'Account Manager', role: 'ADMIN' },
  { id: 'user-2', email: 'catering@sodexo.com', name: 'Catering Manager', role: 'MANAGER' },
  { id: 'user-3', email: 'soft@sodexo.com', name: 'Soft Services Manager', role: 'MANAGER' },
  { id: 'user-4', email: 'tech@sodexo.com', name: 'Technical Manager', role: 'MANAGER' },
  { id: 'user-5', email: 'client@nbcu.com', name: 'NBCU Client', role: 'CLIENT' },
];

// KPIs based on Excel data
export const kpis: KPI[] = [
  // HSEQ (1-3)
  {
    id: 'kpi-1',
    kpiNumber: 1,
    desiredOutcome: 'HSEQ',
    objective: '1.1 Health and Safety',
    measurementIntent: 'Promote and evidence strong health and safety culture to provide a safe working environment',
    definition: 'All team members based on the contract will complete legislative training appropriate for their role',
    output: "The Supplier's audit confirms all team members are trained to the appropriate legislative requirements",
    dataSource: 'Training Records',
    calculation: 'Total Number of Supplier Staff Trained to the Relevant Legislative Level / Total Supplier Staff on account',
    frequency: 'QUARTERLY',
    weighting: 0.25,
    failThreshold: '<99%',
    achieveThreshold: '>100%',
    scoringComment: '100% of all staff have completed legislative training. Remaining staff have a plan in place to complete',
    isActive: true,
    sortOrder: 1,
    categoryId: 'cat-1',
    serviceLineId: 'sl-1',
    responsiblePersonId: 'user-1',
  },
  {
    id: 'kpi-2',
    kpiNumber: 2,
    desiredOutcome: 'HSEQ',
    objective: '1.2 Zero Accident Culture',
    measurementIntent: 'Aim towards zero accidents across the Sites in any Contract Year through proactive health and safety',
    definition: 'Report on the number of accidents leading to Loss Time Incidents in each month together with an accident frequency rate',
    output: 'The Supplier embeds a safety culture by reporting on the number of accidents leading to LTIs in the month',
    dataSource: 'Salas App / Root Cause Analysis Incident Report',
    calculation: 'Total number of LTI accidents per month',
    frequency: 'MONTHLY',
    weighting: 0.125,
    failThreshold: '>2',
    achieveThreshold: '<2',
    scoringComment: 'Quantity of accidents',
    isActive: true,
    sortOrder: 2,
    categoryId: 'cat-1',
    serviceLineId: 'sl-1',
    responsiblePersonId: 'user-1',
  },
  {
    id: 'kpi-3',
    kpiNumber: 3,
    desiredOutcome: 'HSEQ',
    objective: '1.3 Sustainability Performance',
    measurementIntent: 'Demonstrate sustainable service delivery by communication of waste performance and reduction to NBCU',
    definition: 'Report monthly Sodexo waste performance',
    output: 'The percentage of food wastage is reduced through reporting and analysis',
    dataSource: 'Sodexo Power BI tool',
    calculation: '% of food wasted from grab & go Barista bar',
    frequency: 'MONTHLY',
    weighting: 0.125,
    failThreshold: '>10%',
    achieveThreshold: '<10%',
    scoringComment: '% of wastage',
    isActive: true,
    sortOrder: 3,
    categoryId: 'cat-1',
    serviceLineId: 'sl-2',
    responsiblePersonId: 'user-1',
  },
  // Customer Satisfaction (4-16)
  {
    id: 'kpi-4',
    kpiNumber: 4,
    desiredOutcome: 'Customer/Stakeholder Satisfaction',
    objective: '2.1 Customer - deliver an exceptional customer service',
    measurementIntent: 'Track customer satisfaction across the barista service',
    definition: 'Customer satisfaction score is a minimum 4 out of 5 from the feedback received',
    output: 'Customer satisfaction is tracked and trends higher through reporting and discussion of feedback',
    dataSource: 'Coffee Feedback Data',
    calculation: 'Central reporting function score - Averaged over a three month rolling period',
    frequency: 'MONTHLY',
    weighting: 0.5,
    failThreshold: '<4',
    achieveThreshold: '>4',
    scoringComment: 'The Scoring Criteria is based on the average score over the past three month period',
    isActive: true,
    sortOrder: 4,
    categoryId: 'cat-2',
    serviceLineId: 'sl-3',
    responsiblePersonId: 'user-2',
  },
  {
    id: 'kpi-5',
    kpiNumber: 5,
    desiredOutcome: 'Customer/Stakeholder Satisfaction',
    objective: '2.1 Customer - deliver an exceptional customer service',
    measurementIntent: 'Track customer satisfaction across the hospitality service',
    definition: 'Customer satisfaction score is a minimum 4 out of 5 from the feedback received',
    output: 'Customer satisfaction is tracked and trends higher through reporting and discussion of feedback',
    dataSource: 'Hospitality Feedback Data',
    calculation: 'Central reporting function score - Averaged over a three month rolling period',
    frequency: 'MONTHLY',
    weighting: 0.125,
    failThreshold: '<4',
    achieveThreshold: '>4',
    scoringComment: 'The Scoring Criteria is based on the average score over the past three month period',
    isActive: true,
    sortOrder: 5,
    categoryId: 'cat-2',
    serviceLineId: 'sl-2',
    responsiblePersonId: 'user-2',
  },
  {
    id: 'kpi-6',
    kpiNumber: 6,
    desiredOutcome: 'Customer/Stakeholder Satisfaction',
    objective: '2.1 Customer - deliver an exceptional customer service',
    measurementIntent: 'Response times to event bookings',
    definition: 'The Contractor shall acknowledge bookings are responded to within 24 hours',
    output: 'Event bookings are managed in a timely manner',
    dataSource: 'Audit undertaken monthly by Circles QA team',
    calculation: 'Response time to events bookings',
    frequency: 'MONTHLY',
    weighting: 0.125,
    failThreshold: '<97%',
    achieveThreshold: '>98%',
    scoringComment: '% of bookings being responded to within the agreed timescale',
    isActive: true,
    sortOrder: 6,
    categoryId: 'cat-2',
    serviceLineId: 'sl-4',
    responsiblePersonId: 'user-2',
  },
  {
    id: 'kpi-7',
    kpiNumber: 7,
    desiredOutcome: 'Customer/Stakeholder Satisfaction',
    objective: '2.1 Customer - deliver an exceptional customer service',
    measurementIntent: 'Response times to guest queries and emails',
    definition: 'The Contractor shall respond to email queries within 2 hours',
    output: 'Queries are responded to in a timely manner',
    dataSource: 'Audit undertaken monthly by Circles QA team',
    calculation: 'Response times to emails',
    frequency: 'MONTHLY',
    weighting: 0.125,
    failThreshold: '<97%',
    achieveThreshold: '>98%',
    scoringComment: '% of reception requests being responded to within the agreed timescale',
    isActive: true,
    sortOrder: 7,
    categoryId: 'cat-2',
    serviceLineId: 'sl-5',
    responsiblePersonId: 'user-3',
  },
  {
    id: 'kpi-8',
    kpiNumber: 8,
    desiredOutcome: 'Customer/Stakeholder Satisfaction',
    objective: '2.1 Customer - deliver an exceptional customer service',
    measurementIntent: 'Consolidation and Reporting of Cleaning Audits, Including Mailroom',
    definition: 'The audits shall be undertaken jointly between the NBCU and Contractor monthly. Negative feedback from end users will also be reported',
    output: 'Regular, joint cleaning audits are undertaken by NBCU and the Supplier and the output of the audit discussed',
    dataSource: 'Audit tool (Sodexo SMS tool) & Archibus',
    calculation: 'Number of audits failed, to include end user feedback. Response time to reactive cleaning work orders',
    frequency: 'MONTHLY',
    weighting: 0.125,
    failThreshold: 'Less than 100%',
    achieveThreshold: '100%',
    scoringComment: 'Audit score / number of failures. All 3 elements must pass to achieve overall monthly pass',
    isActive: true,
    sortOrder: 8,
    categoryId: 'cat-2',
    serviceLineId: 'sl-6',
    responsiblePersonId: 'user-3',
  },
  {
    id: 'kpi-9',
    kpiNumber: 9,
    desiredOutcome: 'Customer/Stakeholder Satisfaction',
    objective: '2.1 Customer - deliver an exceptional customer service',
    measurementIntent: 'Security Service Delivery',
    definition: 'The Contractor shall ensure an appropriate and documented shift to shift handover takes place between the out going and in coming Security personnel',
    output: 'Minimise security incidents across the portfolio and ensure any incidents which occur are managed in a professional manner',
    dataSource: 'Audit undertaken monthly by Sodexo & NBCU Security Site team',
    calculation: 'Shift handover documentation completed fully with dates, times and any incident details',
    frequency: 'MONTHLY',
    weighting: 0.125,
    failThreshold: '>90%',
    achieveThreshold: '<90%',
    scoringComment: 'Audit score / number of failures',
    isActive: true,
    sortOrder: 9,
    categoryId: 'cat-2',
    serviceLineId: 'sl-7',
    responsiblePersonId: 'user-3',
  },
  {
    id: 'kpi-10',
    kpiNumber: 10,
    desiredOutcome: 'Customer/Stakeholder Satisfaction',
    objective: '2.1 Customer - deliver an exceptional customer service',
    measurementIntent: 'Security Incident Reporting',
    definition: 'The Contractor shall ensure Security Services respond within a reasonable timeframe to all reported incidents',
    output: "Security incidents are managed in a professional and timely manner through reporting the Supplier's response",
    dataSource: 'Audit undertaken monthly by Sodexo & NBCU Site team',
    calculation: 'Total number of reported security incidents on the Sites where the Contractor did not respond in a timely manner',
    frequency: 'MONTHLY',
    weighting: 0.125,
    failThreshold: '>3',
    achieveThreshold: '<3',
    scoringComment: 'Audit score / number of failures',
    isActive: true,
    sortOrder: 10,
    categoryId: 'cat-2',
    serviceLineId: 'sl-7',
    responsiblePersonId: 'user-3',
  },
  {
    id: 'kpi-11',
    kpiNumber: 11,
    desiredOutcome: 'Customer/Stakeholder Satisfaction',
    objective: '2.1 Customer - deliver an exceptional customer service',
    measurementIntent: 'Waste Collection Data',
    definition: 'The Contractor shall ensure that confidential waste collections occur in accordance with the waste collection plan',
    output: 'Confidential waste is collected in accordance with the waste management plan',
    dataSource: 'Confidential waste Collection Plan',
    calculation: 'Missed Confidential Waste Collection & PHS Waste Pick Ups / Total Number of Waste Pick Ups',
    frequency: 'MONTHLY',
    weighting: 0.125,
    failThreshold: '>1',
    achieveThreshold: '<1',
    scoringComment: '% of failures',
    isActive: true,
    sortOrder: 11,
    categoryId: 'cat-2',
    serviceLineId: 'sl-8',
    responsiblePersonId: 'user-3',
  },
  {
    id: 'kpi-12',
    kpiNumber: 12,
    desiredOutcome: 'Customer/Stakeholder Satisfaction',
    objective: '2.1 Customer - deliver an exceptional customer service',
    measurementIntent: "Review the Contractor's performance in delivering Statutory PPMs against the PPM Schedule",
    definition: 'The Statutory PPMs shall be recorded and used to measure Statutory PPM completion',
    output: 'Statutory PPMs are completed in accordance with the PPM Schedule',
    dataSource: 'Archibus',
    calculation: 'Central reporting function score',
    frequency: 'MONTHLY',
    weighting: 0.125,
    failThreshold: '<99%',
    achieveThreshold: '<100%',
    scoringComment: "Number of statutory PPM'S completed on time / Total number of statutory PPMs in the month",
    isActive: true,
    sortOrder: 12,
    categoryId: 'cat-2',
    serviceLineId: 'sl-9',
    responsiblePersonId: 'user-4',
  },
  {
    id: 'kpi-13',
    kpiNumber: 13,
    desiredOutcome: 'Customer/Stakeholder Satisfaction',
    objective: '2.1 Customer - deliver an exceptional customer service',
    measurementIntent: "Review the Contractor's performance in delivering routine PPMs against the PPM Schedule",
    definition: 'The PPMs shall be recorded and used to measure PPM completion',
    output: 'Routine PPMs are completed in accordance with the PPM Schedule',
    dataSource: 'Archibus',
    calculation: 'Central reporting function score',
    frequency: 'MONTHLY',
    weighting: 0.125,
    failThreshold: '<95%',
    achieveThreshold: '>96%',
    scoringComment: 'Number of PPMs completed on time / Total number of PPMs in the month',
    isActive: true,
    sortOrder: 13,
    categoryId: 'cat-2',
    serviceLineId: 'sl-10',
    responsiblePersonId: 'user-4',
  },
  {
    id: 'kpi-14',
    kpiNumber: 14,
    desiredOutcome: 'Customer/Stakeholder Satisfaction',
    objective: '2.1 Customer - deliver an exceptional customer service',
    measurementIntent: 'Response times to reactive work order acknowledgement',
    definition: 'The Contractor shall acknowledge work orders are responded to in line with the SLA',
    output: 'Routine reactive tasks are responded to in accordance with the relevant technical services SLAs',
    dataSource: 'Archibus',
    calculation: 'Central reporting function score',
    frequency: 'MONTHLY',
    weighting: 0.125,
    failThreshold: '<84%',
    achieveThreshold: '>85%',
    scoringComment: 'Response time to a work order',
    isActive: true,
    sortOrder: 14,
    categoryId: 'cat-2',
    serviceLineId: 'sl-11',
    responsiblePersonId: 'user-4',
  },
  {
    id: 'kpi-15',
    kpiNumber: 15,
    desiredOutcome: 'Customer/Stakeholder Satisfaction',
    objective: '2.1 Customer - deliver an exceptional customer service',
    measurementIntent: "Review the Contractor's performance in delivering Reactive Work Requests in line with SLAs",
    definition: 'The Contractor shall measure the number of Reactive Work Requested completed in accordance with the SLA',
    output: 'Routine reactive tasks are completed in accordance with the relevant technical services SLAs',
    dataSource: 'Archibus',
    calculation: 'Central reporting function score',
    frequency: 'MONTHLY',
    weighting: 0.125,
    failThreshold: '<84%',
    achieveThreshold: '>85%',
    scoringComment: 'Number of reactive work requests completed on time',
    isActive: true,
    sortOrder: 15,
    categoryId: 'cat-2',
    serviceLineId: 'sl-11',
    responsiblePersonId: 'user-4',
  },
  {
    id: 'kpi-16',
    kpiNumber: 16,
    desiredOutcome: 'Customer/Stakeholder Satisfaction',
    objective: '2.1 Customer - deliver an exceptional customer service',
    measurementIntent: 'To improve first time fix rates',
    definition: 'The Contractor shall measure the number of repeat failures to assets. An asset failure report will be provided',
    output: 'Improve the quality of the assets on the Estate by identifying assets with repeat failure incidents',
    dataSource: 'Archibus',
    calculation: 'Central reporting function score',
    frequency: 'QUARTERLY',
    weighting: 0.125,
    failThreshold: '>5',
    achieveThreshold: '<5',
    scoringComment: 'Number of repeat asset failures',
    isActive: true,
    sortOrder: 16,
    categoryId: 'cat-2',
    serviceLineId: 'sl-11',
    responsiblePersonId: 'user-4',
  },
  // People (17-18)
  {
    id: 'kpi-17',
    kpiNumber: 17,
    desiredOutcome: 'People - Retention & Development',
    objective: '3.1 Attract and retain the best people available',
    measurementIntent: 'Ensure the team are engaged through the opportunity to undertake training by way of PDRs',
    definition: 'A training plan specific to the operational duties is in place for all frontline staff',
    output: 'A relevant training plan is in place for all team members and the team is working towards completion',
    dataSource: "Various sources within the Contractor's HR System",
    calculation: 'Training Plan and opportunities for development / upskilling in place and completed for all frontline staff',
    frequency: 'QUARTERLY',
    weighting: 0.125,
    failThreshold: '<85%',
    achieveThreshold: '>86%',
    scoringComment: '85% of all frontline staff have training plan in place and completed',
    isActive: true,
    sortOrder: 17,
    categoryId: 'cat-3',
    serviceLineId: 'sl-1',
    responsiblePersonId: 'user-1',
  },
  {
    id: 'kpi-18',
    kpiNumber: 18,
    desiredOutcome: 'People - Retention & Development',
    objective: '3.3 Attract and retain the best people available',
    measurementIntent: 'Aim to reduce turnover of Key Personnel',
    definition: 'The Contractor reports on the Retention Rate for Key Personnel (Service Managers and above)',
    output: "The key roles within the Supplier's account team are retained",
    dataSource: 'Retention rate statistics recorded by the account',
    calculation: 'High retention >80% of employees holding key roles. Key Personnel who leave the account / Total Key Personnel',
    frequency: 'QUARTERLY',
    weighting: 0.125,
    failThreshold: '<80%',
    achieveThreshold: '>81%',
    scoringComment: 'Number of staff retained',
    isActive: true,
    sortOrder: 18,
    categoryId: 'cat-3',
    serviceLineId: 'sl-1',
    responsiblePersonId: 'user-1',
  },
  // Finance (19)
  {
    id: 'kpi-19',
    kpiNumber: 19,
    desiredOutcome: 'Finance - Variable Billing',
    objective: '4.1 Provide accurate and timely financial billing information for all variable services',
    measurementIntent: 'All variable billing information to be loaded within 30 days',
    definition: 'The Contractor shall provide accurate variable billing information in the appropriate month of invoicing',
    output: 'The invoicing data provided by the Supplier is accurate and the number of credits/rejected invoices is minimised',
    dataSource: 'SAP',
    calculation: 'Number of invoices past cut off date / Total number of Variable invoices raised / number of errors',
    frequency: 'MONTHLY',
    weighting: 0.125,
    failThreshold: '>100%',
    achieveThreshold: '<100%',
    scoringComment: 'Number of errors on billing / Failures to provide in time',
    isActive: true,
    sortOrder: 19,
    categoryId: 'cat-4',
    serviceLineId: 'sl-1',
    responsiblePersonId: 'user-1',
  },
  // Project Management (20)
  {
    id: 'kpi-20',
    kpiNumber: 20,
    desiredOutcome: 'Project Management',
    objective: '5.1 Work in Partnership with NBCU to ensure project works are delivered in time, on budget and in line with scope',
    measurementIntent: 'Work in Partnership with NBCU to ensure project works are delivered in time, on budget and in line with scope',
    definition: 'The Contractor shall provide a report to show the projects approved are delivered in line with scope',
    output: 'All projects undertaken by the Supplier are reviewed on a regular basis by NBCU',
    dataSource: 'Project Report and Feedback',
    calculation: '% of projects completed on time, aligned with scope and in budget',
    frequency: 'QUARTERLY',
    weighting: 0.125,
    failThreshold: '>100%',
    achieveThreshold: '<100%',
    scoringComment: 'Number of errors on billing / Failures to provide in time',
    isActive: true,
    sortOrder: 20,
    categoryId: 'cat-5',
    serviceLineId: 'sl-12',
    responsiblePersonId: 'user-1',
  },
  // Reports (21)
  {
    id: 'kpi-21',
    kpiNumber: 21,
    desiredOutcome: 'Reports Accuracy/Timeliness',
    objective: '6.1 Ensure NBCU has access to agreed, accurate reports and data in a timely manner',
    measurementIntent: 'Improve Data and Reporting Quality, Insights & Timeliness of the Agreed Reports',
    definition: 'Quality, accuracy and timeliness of all reporting requirements is in accordance with an agreed upon schedule',
    output: 'NBCU has consistent, accurate and timely data relating to the contractual reports required under the agreement',
    dataSource: 'Emails evidencing time line between meeting conducted and distribution of minutes',
    calculation: 'Minutes are sent out within 3 working days after the Tech/HelpDesk, Soft Services, and Hospitality meetings',
    frequency: 'MONTHLY',
    weighting: 0.125,
    failThreshold: '<90%',
    achieveThreshold: '>91%',
    scoringComment: 'Weekly and key meeting minutes distributed within 3 working days',
    isActive: true,
    sortOrder: 21,
    categoryId: 'cat-6',
    serviceLineId: 'sl-1',
    responsiblePersonId: 'user-1',
  },
  // Supporting NBCU (22)
  {
    id: 'kpi-22',
    kpiNumber: 22,
    desiredOutcome: 'Supporting NBCU',
    objective: "7. Ensure NBCU receives the benefits of the Contractor's internal and external experience",
    measurementIntent: "Ability of the account leadership team to provide support to NBCU's key requirements",
    definition: "The Contractor shall introduce subject matter experts to the account to support NBCU's key facilities requirements",
    output: "NBCU receive the benefit of Sodexo's scale and expertise in the FM arena with the intention of introducing best practice",
    dataSource: 'Support visits to be captured and presented to NBCU at quarterly reviews',
    calculation: 'Support visits outcomes are captured and articulate clear defined outcomes. Implementable enhancements are recorded',
    frequency: 'ANNUAL',
    weighting: 0.125,
    failThreshold: '<5',
    achieveThreshold: '>5',
    scoringComment: 'Number of visits per quarter',
    isActive: true,
    sortOrder: 22,
    categoryId: 'cat-7',
    serviceLineId: 'sl-1',
    responsiblePersonId: 'user-1',
  },
  // Processes (23)
  {
    id: 'kpi-23',
    kpiNumber: 23,
    desiredOutcome: 'Processes & Procedures',
    objective: '8. Ensure that all site specific processes/procedures are documented',
    measurementIntent: 'To ensure clear capture of all processes',
    definition: 'All new processes are documented within the SOP template within 14 working days',
    output: 'SOPs are uploaded to the NBCU sharepoint within 14 working days',
    dataSource: 'SOPs sharepoint',
    calculation: 'Any new SOPs not produced and uploaded to the sharepoint within 14 working days of identification',
    frequency: 'MONTHLY',
    weighting: 0.125,
    failThreshold: '1',
    achieveThreshold: '0',
    scoringComment: 'New SOPs uploaded on time',
    isActive: true,
    sortOrder: 23,
    categoryId: 'cat-8',
    serviceLineId: 'sl-1',
    responsiblePersonId: 'user-1',
  },
];

// Generate periods for 2025
export const periods: Period[] = [
  { id: 'period-1', year: 2025, month: 1, quarter: 1, startDate: '2025-01-01', endDate: '2025-01-31', isClosed: true },
  { id: 'period-2', year: 2025, month: 2, quarter: 1, startDate: '2025-02-01', endDate: '2025-02-28', isClosed: true },
  { id: 'period-3', year: 2025, month: 3, quarter: 1, startDate: '2025-03-01', endDate: '2025-03-31', isClosed: true },
  { id: 'period-4', year: 2025, month: 4, quarter: 2, startDate: '2025-04-01', endDate: '2025-04-30', isClosed: true },
  { id: 'period-5', year: 2025, month: 5, quarter: 2, startDate: '2025-05-01', endDate: '2025-05-31', isClosed: true },
  { id: 'period-6', year: 2025, month: 6, quarter: 2, startDate: '2025-06-01', endDate: '2025-06-30', isClosed: true },
  { id: 'period-7', year: 2025, month: 7, quarter: 3, startDate: '2025-07-01', endDate: '2025-07-31', isClosed: true },
  { id: 'period-8', year: 2025, month: 8, quarter: 3, startDate: '2025-08-01', endDate: '2025-08-31', isClosed: false },
  { id: 'period-9', year: 2025, month: 9, quarter: 3, startDate: '2025-09-01', endDate: '2025-09-30', isClosed: false },
  { id: 'period-10', year: 2025, month: 10, quarter: 4, startDate: '2025-10-01', endDate: '2025-10-31', isClosed: false },
  { id: 'period-11', year: 2025, month: 11, quarter: 4, startDate: '2025-11-01', endDate: '2025-11-30', isClosed: false },
  { id: 'period-12', year: 2025, month: 12, quarter: 4, startDate: '2025-12-01', endDate: '2025-12-31', isClosed: false },
];

// Monthly scores - UNIFIED 100% SCALE
// All values represent achievement percentage (0-100%)
// For "lower is better" KPIs like accidents, 0 incidents = 100%, 1 incident = 50%, 2+ = 0%
// August (index 7): 22 KPIs at 90%+, 1 KPI below 90%, 0 pending
const monthlyValues: Record<string, (number | null)[]> = {
  // HSEQ (1-3)
  'kpi-1': [100, 99, 99, 100, 100, 100, 99, 100, null, null, null, null],  // Health & Safety
  'kpi-2': [100, 100, 100, 50, 100, 100, 50, 100, null, null, null, null], // Zero Accident Culture
  'kpi-3': [null, 74, 86, 91, 91, 96, 89, 97, null, null, null, null],     // Sustainability
  
  // Customer Satisfaction (4-16)
  'kpi-4': [97, 98, 99, 97, 97, 98, 98, 96, null, null, null, null],       // Barista satisfaction
  'kpi-5': [98, 99, 100, 100, 92, 98, 92, 98, null, null, null, null],     // Hospitality satisfaction
  'kpi-6': [100, 100, 100, 100, 100, 100, 100, 100, null, null, null, null], // Event booking response
  'kpi-7': [100, 100, 100, 100, 100, 100, 100, 100, null, null, null, null], // Email response time
  'kpi-8': [100, 100, 98, 100, 100, 100, 98, 100, null, null, null, null],   // Cleaning audits
  'kpi-9': [97, 97, 95, 92, 94, 96, 95, 98, null, null, null, null],         // Security handover
  'kpi-10': [100, 100, 100, 100, 100, 100, 100, 100, null, null, null, null], // Security incidents
  'kpi-11': [100, 100, 100, 100, 100, 67, 67, 100, null, null, null, null],   // Waste collection
  'kpi-12': [100, 100, 100, 100, 100, 100, 100, 100, null, null, null, null], // Statutory PPM
  'kpi-13': [98, 100, 100, 100, 100, 100, 100, 100, null, null, null, null],  // Routine PPM
  'kpi-14': [95, 97, 98, 96, 94, 92, 95, 96, null, null, null, null],         // Reactive acknowledgement
  'kpi-15': [99, 100, 100, 93, 90, 82, 87, 92, null, null, null, null],       // Reactive completion
  'kpi-16': [100, 100, 100, 100, 100, 100, 100, 100, null, null, null, null], // First time fix
  
  // People (17-18)
  'kpi-17': [92, 94, 96, 95, 97, 98, 96, 95, null, null, null, null],         // Training plan
  'kpi-18': [100, 89, 100, 100, 100, 100, 86, 93, null, null, null, null],    // Key personnel retention
  
  // Finance (19)
  'kpi-19': [100, 100, 100, 100, 100, 100, 100, 100, null, null, null, null], // Variable billing
  
  // Project Management (20)
  'kpi-20': [95, 98, 100, 97, 95, 98, 96, 98, null, null, null, null],        // Project delivery
  
  // Reports (21)
  'kpi-21': [100, 100, 98, 100, 100, 100, 98, 100, null, null, null, null],   // Reports timeliness
  
  // Supporting NBCU (22)
  'kpi-22': [100, 100, 100, 100, 100, 100, 100, 95, null, null, null, null],  // Support visits
  
  // Processes (23)  - This one is below 90% in August (85%)
  'kpi-23': [100, 100, 95, 100, 92, 88, 90, 85, null, null, null, null],      // SOPs - IN PROGRESS
};

// Generate KPI Scores
export const kpiScores: KPIScore[] = [];
Object.entries(monthlyValues).forEach(([kpiId, values]) => {
  values.forEach((value, monthIndex) => {
    if (value !== null) {
      kpiScores.push({
        id: `score-${kpiId}-${monthIndex + 1}`,
        actualValue: `${value}%`,
        numericValue: value, // Now stored as 0-100 percentage
        score: value / 100, // Normalized 0-1 scale
        status: 'APPROVED',
        kpiId,
        periodId: `period-${monthIndex + 1}`,
        submittedById: 'user-1',
        submittedAt: new Date(2025, monthIndex, 15).toISOString(),
      });
    }
  });
});

// Sample client scores
export const clientScores: ClientScore[] = [
  { id: 'cs-1', score: 4.5, justification: 'Good overall performance with minor areas for improvement', scoredAt: '2025-01-20', kpiId: 'kpi-1', periodId: 'period-1', scoredById: 'user-5' },
  { id: 'cs-2', score: 5, justification: 'Excellent zero accident record maintained', scoredAt: '2025-01-20', kpiId: 'kpi-2', periodId: 'period-1', scoredById: 'user-5' },
  { id: 'cs-3', score: 4, justification: 'Sustainability efforts showing good progress', scoredAt: '2025-01-20', kpiId: 'kpi-3', periodId: 'period-1', scoredById: 'user-5' },
  { id: 'cs-4', score: 4.8, justification: 'Customer satisfaction consistently high', scoredAt: '2025-01-20', kpiId: 'kpi-4', periodId: 'period-1', scoredById: 'user-5' },
];

// Sample actions
export const actions: Action[] = [
  {
    id: 'action-1',
    actionNumber: 1,
    description: 'Coffee Survey Questions',
    requiredAction: 'Reduce the number of survey questions so as to encourage greater participation',
    raisedBy: 'BT',
    dueDate: '2025-10-15',
    status: 'OPEN',
    responsibleId: 'user-2',
  },
  {
    id: 'action-2',
    actionNumber: 2,
    description: '3rd Floor Food/snack options',
    requiredAction: 'Investigate providing cheaper food and snack items at the 3rd floor coffee bar',
    raisedBy: 'BT',
    dueDate: '2025-10-30',
    status: 'IN_PROGRESS',
    responsibleId: 'user-2',
  },
  {
    id: 'action-3',
    actionNumber: 3,
    description: 'Survey competition between 3rd & 10th Floors',
    requiredAction: 'Implement a competition between the 2 coffee bars to drive survey feedback number',
    raisedBy: 'BT',
    dueDate: '2025-10-15',
    status: 'OPEN',
    responsibleId: 'user-2',
  },
  {
    id: 'action-4',
    actionNumber: 4,
    description: 'House Keeping',
    requiredAction: 'Great feedback received from BT regarding how they had embraced the Friday walk around feedback',
    raisedBy: 'BT',
    dueDate: '2025-09-30',
    completedDate: '2025-09-30',
    status: 'COMPLETED',
    responsibleId: 'user-3',
  },
  {
    id: 'action-5',
    actionNumber: 5,
    description: 'Process Documents',
    requiredAction: '1 x Circles process to be uploaded',
    raisedBy: 'PM',
    dueDate: '2025-10-15',
    status: 'OPEN',
    responsibleId: 'user-3',
  },
  {
    id: 'action-6',
    actionNumber: 6,
    description: 'Overdue Reactive Maintenance tasks',
    requiredAction: 'Current number is 23 overdue reactives. Objective is to clear this number down as much as possible',
    raisedBy: 'BT',
    dueDate: '2025-10-15',
    status: 'IN_PROGRESS',
    responsibleId: 'user-4',
  },
];

// Helper function to get month name
export const getMonthName = (month: number): string => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return months[month - 1];
};

// Helper to calculate score status
export const getScoreStatus = (score: number | undefined, failThreshold: string, achieveThreshold: string): 'PASS' | 'FAIL' | 'PENDING' => {
  if (score === undefined || score === null) return 'PENDING';
  
  // Simple threshold parsing (can be enhanced)
  const parseThreshold = (t: string): { operator: string; value: number } | null => {
    const match = t.match(/([<>]=?)\s*(\d+\.?\d*%?)/);
    if (match) {
      const value = parseFloat(match[2].replace('%', '')) / (match[2].includes('%') ? 100 : 1);
      return { operator: match[1], value };
    }
    return null;
  };

  const achieve = parseThreshold(achieveThreshold);
  if (achieve) {
    switch (achieve.operator) {
      case '>':
        return score > achieve.value ? 'PASS' : 'FAIL';
      case '>=':
        return score >= achieve.value ? 'PASS' : 'FAIL';
      case '<':
        return score < achieve.value ? 'PASS' : 'FAIL';
      case '<=':
        return score <= achieve.value ? 'PASS' : 'FAIL';
    }
  }
  
  return score >= 0.9 ? 'PASS' : 'FAIL';
};

