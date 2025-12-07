import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import 'dotenv/config';

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Starting database seed...');

  // ============================================
  // USERS
  // ============================================
  console.log('Creating users...');
  
  const users = await Promise.all([
    prisma.user.upsert({
      where: { email: 'admin@sodexo.com' },
      update: {},
      create: {
        email: 'admin@sodexo.com',
        name: 'Account Manager',
        role: 'ADMIN',
      },
    }),
    prisma.user.upsert({
      where: { email: 'catering@sodexo.com' },
      update: {},
      create: {
        email: 'catering@sodexo.com',
        name: 'Catering Manager',
        role: 'MANAGER',
      },
    }),
    prisma.user.upsert({
      where: { email: 'soft@sodexo.com' },
      update: {},
      create: {
        email: 'soft@sodexo.com',
        name: 'Soft Services Manager',
        role: 'MANAGER',
      },
    }),
    prisma.user.upsert({
      where: { email: 'tech@sodexo.com' },
      update: {},
      create: {
        email: 'tech@sodexo.com',
        name: 'Technical Manager',
        role: 'MANAGER',
      },
    }),
    prisma.user.upsert({
      where: { email: 'client@nbcu.com' },
      update: {},
      create: {
        email: 'client@nbcu.com',
        name: 'NBCU Client',
        role: 'CLIENT',
      },
    }),
  ]);

  const [adminUser, cateringManager, softManager, techManager, clientUser] = users;

  // ============================================
  // SERVICE LINES
  // ============================================
  console.log('Creating service lines...');

  const serviceLineData = [
    'All Service Lines',
    'Catering',
    'Catering lvl 3/ lvl10',
    'Events',
    'Front of House',
    'Cleaning',
    'Security',
    'Waste',
    'Hard FM - Statutory PPM',
    'Hard FM - Routine PPM',
    'Hard FM - Routine Reactive Tasks',
    'Project Works',
  ];

  const serviceLines: Record<string, any> = {};
  for (const name of serviceLineData) {
    const sl = await prisma.serviceLine.upsert({
      where: { name },
      update: {},
      create: { name },
    });
    serviceLines[name] = sl;
  }

  // ============================================
  // CATEGORIES
  // ============================================
  console.log('Creating categories...');

  const categoryData = [
    {
      name: 'HSEQ',
      shortName: 'HSEQ',
      description: 'Health, Safety, Environment & Quality (Items 1-3)',
      color: '#8b5cf6',
      icon: 'Shield',
      sortOrder: 1,
    },
    {
      name: 'Customer/Stakeholder Satisfaction',
      shortName: 'Customer',
      description: 'Leading Customer/Stakeholder satisfaction (Items 4-16)',
      color: '#06b6d4',
      icon: 'Users',
      sortOrder: 2,
    },
    {
      name: 'People - Retention & Development',
      shortName: 'People',
      description: 'People - Retention & Development (Items 17, 18)',
      color: '#ec4899',
      icon: 'UserCheck',
      sortOrder: 3,
    },
    {
      name: 'Finance - Variable Billing',
      shortName: 'Finance',
      description: 'Accuracy and Timeliness of Variable Billing Finance (Item 19)',
      color: '#10b981',
      icon: 'DollarSign',
      sortOrder: 4,
    },
    {
      name: 'Project Management',
      shortName: 'Projects',
      description: 'Project Management (Item 20)',
      color: '#f59e0b',
      icon: 'FolderKanban',
      sortOrder: 5,
    },
    {
      name: 'Reports Accuracy/Timeliness',
      shortName: 'Reports',
      description: 'Accuracy and Timeliness of Reports (Item 21)',
      color: '#3b82f6',
      icon: 'FileText',
      sortOrder: 6,
    },
    {
      name: 'Supporting NBCU',
      shortName: 'Support',
      description: 'Supporting NBCU (Item 22)',
      color: '#6366f1',
      icon: 'Handshake',
      sortOrder: 7,
    },
    {
      name: 'Processes & Procedures',
      shortName: 'Process',
      description: 'Processes & Procedures (Item 23)',
      color: '#14b8a6',
      icon: 'ClipboardList',
      sortOrder: 8,
    },
  ];

  const categories: Record<string, any> = {};
  for (const cat of categoryData) {
    const created = await prisma.category.upsert({
      where: { id: `cat-${cat.sortOrder}` },
      update: cat,
      create: { id: `cat-${cat.sortOrder}`, ...cat },
    });
    categories[cat.shortName] = created;
  }

  // ============================================
  // PERIODS (Jan 2025 - Dec 2025)
  // ============================================
  console.log('Creating periods...');

  const periods: Record<string, any> = {};
  for (let month = 1; month <= 12; month++) {
    const quarter = Math.ceil(month / 3);
    const startDate = new Date(2025, month - 1, 1);
    const endDate = new Date(2025, month, 0);
    
    const period = await prisma.period.upsert({
      where: { year_month: { year: 2025, month } },
      update: {},
      create: {
        year: 2025,
        month,
        quarter,
        startDate,
        endDate,
        isClosed: month <= 7, // Jan-Jul closed
      },
    });
    periods[month] = period;
  }

  // ============================================
  // KPIs (Based on Excel Data)
  // ============================================
  console.log('Creating KPIs...');

  const kpiData = [
    // HSEQ (1-3)
    {
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
      categoryId: categories['HSEQ'].id,
      serviceLineId: serviceLines['All Service Lines'].id,
      responsiblePersonId: adminUser.id,
    },
    {
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
      categoryId: categories['HSEQ'].id,
      serviceLineId: serviceLines['All Service Lines'].id,
      responsiblePersonId: adminUser.id,
    },
    {
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
      categoryId: categories['HSEQ'].id,
      serviceLineId: serviceLines['Catering'].id,
      responsiblePersonId: adminUser.id,
    },
    // Customer Satisfaction (4-16)
    {
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
      categoryId: categories['Customer'].id,
      serviceLineId: serviceLines['Catering lvl 3/ lvl10'].id,
      responsiblePersonId: cateringManager.id,
    },
    {
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
      categoryId: categories['Customer'].id,
      serviceLineId: serviceLines['Catering'].id,
      responsiblePersonId: cateringManager.id,
    },
    {
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
      categoryId: categories['Customer'].id,
      serviceLineId: serviceLines['Events'].id,
      responsiblePersonId: cateringManager.id,
    },
    {
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
      categoryId: categories['Customer'].id,
      serviceLineId: serviceLines['Front of House'].id,
      responsiblePersonId: softManager.id,
    },
    {
      kpiNumber: 8,
      desiredOutcome: 'Customer/Stakeholder Satisfaction',
      objective: '2.1 Customer - deliver an exceptional customer service',
      measurementIntent: 'Consolidation and Reporting of Cleaning Audits, Including Mailroom',
      definition: 'The audits shall be undertaken jointly between the NBCU and Contractor monthly',
      output: 'Regular, joint cleaning audits are undertaken by NBCU and the Supplier',
      dataSource: 'Audit tool (Sodexo SMS tool) & Archibus',
      calculation: 'Number of audits failed, to include end user feedback',
      frequency: 'MONTHLY',
      weighting: 0.125,
      failThreshold: 'Less than 100%',
      achieveThreshold: '100%',
      scoringComment: 'Audit score / number of failures. All 3 elements must pass',
      categoryId: categories['Customer'].id,
      serviceLineId: serviceLines['Cleaning'].id,
      responsiblePersonId: softManager.id,
    },
    {
      kpiNumber: 9,
      desiredOutcome: 'Customer/Stakeholder Satisfaction',
      objective: '2.1 Customer - deliver an exceptional customer service',
      measurementIntent: 'Security Service Delivery',
      definition: 'The Contractor shall ensure an appropriate and documented shift to shift handover',
      output: 'Minimise security incidents across the portfolio',
      dataSource: 'Audit undertaken monthly by Sodexo & NBCU Security Site team',
      calculation: 'Shift handover documentation completed fully',
      frequency: 'MONTHLY',
      weighting: 0.125,
      failThreshold: '>90%',
      achieveThreshold: '<90%',
      scoringComment: 'Audit score / number of failures',
      categoryId: categories['Customer'].id,
      serviceLineId: serviceLines['Security'].id,
      responsiblePersonId: softManager.id,
    },
    {
      kpiNumber: 10,
      desiredOutcome: 'Customer/Stakeholder Satisfaction',
      objective: '2.1 Customer - deliver an exceptional customer service',
      measurementIntent: 'Security Incident Reporting',
      definition: 'The Contractor shall ensure Security Services respond within a reasonable timeframe',
      output: 'Security incidents are managed in a professional and timely manner',
      dataSource: 'Audit undertaken monthly by Sodexo & NBCU Site team',
      calculation: 'Total number of reported security incidents where Contractor did not respond timely',
      frequency: 'MONTHLY',
      weighting: 0.125,
      failThreshold: '>3',
      achieveThreshold: '<3',
      scoringComment: 'Audit score / number of failures',
      categoryId: categories['Customer'].id,
      serviceLineId: serviceLines['Security'].id,
      responsiblePersonId: softManager.id,
    },
    {
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
      categoryId: categories['Customer'].id,
      serviceLineId: serviceLines['Waste'].id,
      responsiblePersonId: softManager.id,
    },
    {
      kpiNumber: 12,
      desiredOutcome: 'Customer/Stakeholder Satisfaction',
      objective: '2.1 Customer - deliver an exceptional customer service',
      measurementIntent: "Review the Contractor's performance in delivering Statutory PPMs",
      definition: 'The Statutory PPMs shall be recorded and used to measure Statutory PPM completion',
      output: 'Statutory PPMs are completed in accordance with the PPM Schedule',
      dataSource: 'Archibus',
      calculation: 'Central reporting function score',
      frequency: 'MONTHLY',
      weighting: 0.125,
      failThreshold: '<99%',
      achieveThreshold: '<100%',
      scoringComment: "Number of statutory PPM'S completed on time / Total number of statutory PPMs",
      categoryId: categories['Customer'].id,
      serviceLineId: serviceLines['Hard FM - Statutory PPM'].id,
      responsiblePersonId: techManager.id,
    },
    {
      kpiNumber: 13,
      desiredOutcome: 'Customer/Stakeholder Satisfaction',
      objective: '2.1 Customer - deliver an exceptional customer service',
      measurementIntent: "Review the Contractor's performance in delivering routine PPMs",
      definition: 'The PPMs shall be recorded and used to measure PPM completion',
      output: 'Routine PPMs are completed in accordance with the PPM Schedule',
      dataSource: 'Archibus',
      calculation: 'Central reporting function score',
      frequency: 'MONTHLY',
      weighting: 0.125,
      failThreshold: '<95%',
      achieveThreshold: '>96%',
      scoringComment: 'Number of PPMs completed on time / Total number of PPMs',
      categoryId: categories['Customer'].id,
      serviceLineId: serviceLines['Hard FM - Routine PPM'].id,
      responsiblePersonId: techManager.id,
    },
    {
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
      categoryId: categories['Customer'].id,
      serviceLineId: serviceLines['Hard FM - Routine Reactive Tasks'].id,
      responsiblePersonId: techManager.id,
    },
    {
      kpiNumber: 15,
      desiredOutcome: 'Customer/Stakeholder Satisfaction',
      objective: '2.1 Customer - deliver an exceptional customer service',
      measurementIntent: "Review the Contractor's performance in delivering Reactive Work Requests",
      definition: 'The Contractor shall measure the number of Reactive Work Requested completed in accordance with the SLA',
      output: 'Routine reactive tasks are completed in accordance with the relevant technical services SLAs',
      dataSource: 'Archibus',
      calculation: 'Central reporting function score',
      frequency: 'MONTHLY',
      weighting: 0.125,
      failThreshold: '<84%',
      achieveThreshold: '>85%',
      scoringComment: 'Number of reactive work requests completed on time',
      categoryId: categories['Customer'].id,
      serviceLineId: serviceLines['Hard FM - Routine Reactive Tasks'].id,
      responsiblePersonId: techManager.id,
    },
    {
      kpiNumber: 16,
      desiredOutcome: 'Customer/Stakeholder Satisfaction',
      objective: '2.1 Customer - deliver an exceptional customer service',
      measurementIntent: 'To improve first time fix rates',
      definition: 'The Contractor shall measure the number of repeat failures to assets',
      output: 'Improve the quality of the assets on the Estate by identifying assets with repeat failure incidents',
      dataSource: 'Archibus',
      calculation: 'Central reporting function score',
      frequency: 'QUARTERLY',
      weighting: 0.125,
      failThreshold: '>5',
      achieveThreshold: '<5',
      scoringComment: 'Number of repeat asset failures',
      categoryId: categories['Customer'].id,
      serviceLineId: serviceLines['Hard FM - Routine Reactive Tasks'].id,
      responsiblePersonId: techManager.id,
    },
    // People (17-18)
    {
      kpiNumber: 17,
      desiredOutcome: 'People - Retention & Development',
      objective: '3.1 Attract and retain the best people available',
      measurementIntent: 'Ensure the team are engaged through the opportunity to undertake training by way of PDRs',
      definition: 'A training plan specific to the operational duties is in place for all frontline staff',
      output: 'A relevant training plan is in place for all team members',
      dataSource: "Various sources within the Contractor's HR System",
      calculation: 'Training Plan and opportunities for development / upskilling in place',
      frequency: 'QUARTERLY',
      weighting: 0.125,
      failThreshold: '<85%',
      achieveThreshold: '>86%',
      scoringComment: '85% of all frontline staff have training plan in place and completed',
      categoryId: categories['People'].id,
      serviceLineId: serviceLines['All Service Lines'].id,
      responsiblePersonId: adminUser.id,
    },
    {
      kpiNumber: 18,
      desiredOutcome: 'People - Retention & Development',
      objective: '3.3 Attract and retain the best people available',
      measurementIntent: 'Aim to reduce turnover of Key Personnel',
      definition: 'The Contractor reports on the Retention Rate for Key Personnel',
      output: "The key roles within the Supplier's account team are retained",
      dataSource: 'Retention rate statistics recorded by the account',
      calculation: 'High retention >80% of employees holding key roles',
      frequency: 'QUARTERLY',
      weighting: 0.125,
      failThreshold: '<80%',
      achieveThreshold: '>81%',
      scoringComment: 'Number of staff retained',
      categoryId: categories['People'].id,
      serviceLineId: serviceLines['All Service Lines'].id,
      responsiblePersonId: adminUser.id,
    },
    // Finance (19)
    {
      kpiNumber: 19,
      desiredOutcome: 'Finance - Variable Billing',
      objective: '4.1 Provide accurate and timely financial billing information',
      measurementIntent: 'All variable billing information to be loaded within 30 days',
      definition: 'The Contractor shall provide accurate variable billing information in the appropriate month',
      output: 'The invoicing data provided by the Supplier is accurate',
      dataSource: 'SAP',
      calculation: 'Number of invoices past cut off date / Total number of Variable invoices raised',
      frequency: 'MONTHLY',
      weighting: 0.125,
      failThreshold: '>100%',
      achieveThreshold: '<100%',
      scoringComment: 'Number of errors on billing / Failures to provide in time',
      categoryId: categories['Finance'].id,
      serviceLineId: serviceLines['All Service Lines'].id,
      responsiblePersonId: adminUser.id,
    },
    // Project Management (20)
    {
      kpiNumber: 20,
      desiredOutcome: 'Project Management',
      objective: '5.1 Work in Partnership with NBCU to ensure project works are delivered',
      measurementIntent: 'Work in Partnership with NBCU to ensure project works are delivered in time, on budget',
      definition: 'The Contractor shall provide a report to show the projects approved are delivered in line with scope',
      output: 'All projects undertaken by the Supplier are reviewed on a regular basis by NBCU',
      dataSource: 'Project Report and Feedback',
      calculation: '% of projects completed on time, aligned with scope and in budget',
      frequency: 'QUARTERLY',
      weighting: 0.125,
      failThreshold: '>100%',
      achieveThreshold: '<100%',
      scoringComment: 'Number of errors on billing / Failures to provide in time',
      categoryId: categories['Projects'].id,
      serviceLineId: serviceLines['Project Works'].id,
      responsiblePersonId: adminUser.id,
    },
    // Reports (21)
    {
      kpiNumber: 21,
      desiredOutcome: 'Reports Accuracy/Timeliness',
      objective: '6.1 Ensure NBCU has access to agreed, accurate reports and data',
      measurementIntent: 'Improve Data and Reporting Quality, Insights & Timeliness',
      definition: 'Quality, accuracy and timeliness of all reporting requirements is in accordance with agreed schedule',
      output: 'NBCU has consistent, accurate and timely data',
      dataSource: 'Emails evidencing time line between meeting conducted and distribution',
      calculation: 'Minutes are sent out within 3 working days after meetings',
      frequency: 'MONTHLY',
      weighting: 0.125,
      failThreshold: '<90%',
      achieveThreshold: '>91%',
      scoringComment: 'Weekly and key meeting minutes distributed within 3 working days',
      categoryId: categories['Reports'].id,
      serviceLineId: serviceLines['All Service Lines'].id,
      responsiblePersonId: adminUser.id,
    },
    // Supporting NBCU (22)
    {
      kpiNumber: 22,
      desiredOutcome: 'Supporting NBCU',
      objective: "7. Ensure NBCU receives the benefits of the Contractor's experience",
      measurementIntent: "Ability of the account leadership team to provide support to NBCU's key requirements",
      definition: "The Contractor shall introduce subject matter experts to the account",
      output: "NBCU receive the benefit of Sodexo's scale and expertise in the FM arena",
      dataSource: 'Support visits to be captured and presented to NBCU at quarterly reviews',
      calculation: 'Support visits outcomes are captured and articulate clear defined outcomes',
      frequency: 'ANNUAL',
      weighting: 0.125,
      failThreshold: '<5',
      achieveThreshold: '>5',
      scoringComment: 'Number of visits per quarter',
      categoryId: categories['Support'].id,
      serviceLineId: serviceLines['All Service Lines'].id,
      responsiblePersonId: adminUser.id,
    },
    // Processes (23)
    {
      kpiNumber: 23,
      desiredOutcome: 'Processes & Procedures',
      objective: '8. Ensure that all site specific processes/procedures are documented',
      measurementIntent: 'To ensure clear capture of all processes',
      definition: 'All new processes are documented within the SOP template within 14 working days',
      output: 'SOPs are uploaded to the NBCU sharepoint within 14 working days',
      dataSource: 'SOPs sharepoint',
      calculation: 'Any new SOPs not produced and uploaded within 14 working days',
      frequency: 'MONTHLY',
      weighting: 0.125,
      failThreshold: '1',
      achieveThreshold: '0',
      scoringComment: 'New SOPs uploaded on time',
      categoryId: categories['Process'].id,
      serviceLineId: serviceLines['All Service Lines'].id,
      responsiblePersonId: adminUser.id,
    },
  ];

  const kpis: Record<number, any> = {};
  for (const kpi of kpiData) {
    const created = await prisma.kPI.upsert({
      where: { id: `kpi-${kpi.kpiNumber}` },
      update: kpi,
      create: { id: `kpi-${kpi.kpiNumber}`, ...kpi },
    });
    kpis[kpi.kpiNumber] = created;
  }

  // ============================================
  // KPI SCORES (From Excel Data)
  // ============================================
  console.log('Creating KPI scores...');

  // Monthly scores from Excel (Jan-Aug 2025)
  const monthlyScores: Record<number, (number | null)[]> = {
    1: [1, 0.99, 0.99, 1, 1, 1, 0.99, 1],           // Health and Safety
    2: [0, 0, 0, 1, 0, 0, 1, null],                  // Zero Accident Culture
    3: [null, 0.2578, 0.139, 0.0863, 0.09, 0.04, 0.11, 0.03], // Sustainability
    4: [4.87, 4.92, 4.93, 4.87, 4.86, 4.9, 4.9, 4.6], // Customer Satisfaction (Barista)
    5: [4.9, 4.93, 5, 5, 4.6, 4.9, 4.6, 4.9],       // Customer Satisfaction (Hospitality)
    6: [1, 1, 1, 1, 1, 1, 1, 1],                     // Event Bookings
    7: [1, 1, 1, 1, 1, 1, 1, 1],                     // Guest Queries
    9: [0.97, 0.97, 0.95, 0.92, null, null, null, null], // Security Service Delivery
    11: [1, 1, 1, 1, 1, 0.666, 0.666, 1],            // Waste Collection
    12: [1, 1, 1, 1, 1, 1, 1, 1],                    // Statutory PPM
    13: [0.98, 1, 1, 1, 1, 1, 1, 1],                 // Routine PPM
    15: [0.99, 1, 1, 0.93, 0.9, 0.82, 0.87, 0.92],   // Reactive Work Requests
    18: [1, 0.89, 1, 1, 1, 1, 0.86, 0.86],           // Staff Retention
  };

  for (const [kpiNum, scores] of Object.entries(monthlyScores)) {
    const kpiNumber = parseInt(kpiNum);
    for (let month = 1; month <= scores.length; month++) {
      const value = scores[month - 1];
      if (value !== null) {
        await prisma.kPIScore.upsert({
          where: {
            kpiId_periodId: {
              kpiId: kpis[kpiNumber].id,
              periodId: periods[month].id,
            },
          },
          update: {
            actualValue: String(value),
            numericValue: value,
            score: value <= 1 ? value : value / 5,
            status: 'APPROVED',
            submittedById: adminUser.id,
            submittedAt: new Date(2025, month - 1, 15),
          },
          create: {
            kpiId: kpis[kpiNumber].id,
            periodId: periods[month].id,
            actualValue: String(value),
            numericValue: value,
            score: value <= 1 ? value : value / 5,
            status: 'APPROVED',
            submittedById: adminUser.id,
            submittedAt: new Date(2025, month - 1, 15),
          },
        });
      }
    }
  }

  // ============================================
  // CLIENT SCORES (Sample)
  // ============================================
  console.log('Creating client scores...');

  const clientScoreData = [
    { kpiNumber: 1, score: 4.5, justification: 'Good overall performance with minor areas for improvement' },
    { kpiNumber: 2, score: 5, justification: 'Excellent zero accident record maintained' },
    { kpiNumber: 3, score: 4, justification: 'Sustainability efforts showing good progress' },
    { kpiNumber: 4, score: 4.8, justification: 'Customer satisfaction consistently high' },
  ];

  for (const cs of clientScoreData) {
    await prisma.clientScore.upsert({
      where: {
        kpiId_periodId: {
          kpiId: kpis[cs.kpiNumber].id,
          periodId: periods[1].id,
        },
      },
      update: {
        score: cs.score,
        justification: cs.justification,
        scoredById: clientUser.id,
      },
      create: {
        kpiId: kpis[cs.kpiNumber].id,
        periodId: periods[1].id,
        score: cs.score,
        justification: cs.justification,
        scoredById: clientUser.id,
      },
    });
  }

  // ============================================
  // ACTIONS (From Excel Data)
  // ============================================
  console.log('Creating actions...');

  const actionsData = [
    {
      actionNumber: 1,
      description: 'Coffee Survey Questions',
      requiredAction: 'Reduce the number of survey questions so as to encourage greater participation',
      raisedBy: 'BT',
      dueDate: new Date('2025-10-15'),
      status: 'OPEN',
      responsibleId: cateringManager.id,
    },
    {
      actionNumber: 2,
      description: '3rd Floor Food/snack options',
      requiredAction: 'Investigate providing cheaper food and snack items at the 3rd floor coffee bar',
      raisedBy: 'BT',
      dueDate: new Date('2025-10-30'),
      status: 'IN_PROGRESS',
      responsibleId: cateringManager.id,
    },
    {
      actionNumber: 3,
      description: 'Survey competition between 3rd & 10th Floors',
      requiredAction: 'Implement a competition between the 2 coffee bars to drive survey feedback number',
      raisedBy: 'BT',
      dueDate: new Date('2025-10-15'),
      status: 'OPEN',
      responsibleId: cateringManager.id,
    },
    {
      actionNumber: 4,
      description: 'House Keeping',
      requiredAction: 'Great feedback received from BT regarding how they had embraced the Friday walk around feedback',
      raisedBy: 'BT',
      dueDate: new Date('2025-09-30'),
      completedDate: new Date('2025-09-30'),
      status: 'COMPLETED',
      responsibleId: softManager.id,
    },
    {
      actionNumber: 5,
      description: 'Process Documents',
      requiredAction: '1 x Circles process to be uploaded',
      raisedBy: 'PM',
      dueDate: new Date('2025-10-15'),
      status: 'OPEN',
      responsibleId: softManager.id,
    },
    {
      actionNumber: 6,
      description: 'Overdue Reactive Maintenance tasks',
      requiredAction: 'Current number is 23 overdue reactives. Objective is to clear this number down as much as possible',
      raisedBy: 'BT',
      dueDate: new Date('2025-10-15'),
      status: 'IN_PROGRESS',
      responsibleId: techManager.id,
    },
  ];

  for (const action of actionsData) {
    await prisma.action.upsert({
      where: { id: `action-${action.actionNumber}` },
      update: action,
      create: { id: `action-${action.actionNumber}`, ...action as any },
    });
  }

  // ============================================
  // SAMPLE COMMENTS
  // ============================================
  console.log('Creating sample comments...');

  await prisma.kPIComment.create({
    data: {
      kpiId: kpis[1].id,
      periodId: periods[8].id,
      authorId: adminUser.id,
      content: 'Great progress this month. Team exceeded expectations.',
      type: 'ACHIEVEMENT',
    },
  });

  await prisma.kPIComment.create({
    data: {
      kpiId: kpis[1].id,
      periodId: periods[8].id,
      authorId: techManager.id,
      content: 'Need to address the pending items from last audit.',
      type: 'ACTION_REQUIRED',
    },
  });

  // ============================================
  // SAMPLE EVIDENCE
  // ============================================
  console.log('Creating sample evidence...');

  await prisma.kPIEvidence.create({
    data: {
      kpiId: kpis[1].id,
      periodId: periods[8].id,
      uploadedById: adminUser.id,
      title: 'August Training Report',
      description: 'Monthly training completion report for all staff',
      fileName: 'training_report_aug.pdf',
      fileType: 'application/pdf',
      type: 'DOCUMENT',
    },
  });

  await prisma.kPIEvidence.create({
    data: {
      kpiId: kpis[1].id,
      periodId: periods[8].id,
      uploadedById: techManager.id,
      title: 'Safety Audit Results',
      description: 'Q3 Safety audit results and findings',
      fileName: 'safety_audit_q3.xlsx',
      fileType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      type: 'REPORT',
    },
  });

  console.log('✅ Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

