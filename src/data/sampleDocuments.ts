import { LegalDocument } from '../types/legal';

export const SAMPLE_DOCUMENTS: LegalDocument[] = [
  {
    id: 'residential-lease-2025',
    title: 'Standard Residential Tenancy Agreement',
    subtitle: 'Urban Properties LLC vs. Tenant (Includes Common Rental Traps)',
    category: 'lease',
    rawText: `RESIDENTIAL LEASE AGREEMENT

This Residential Lease Agreement ("Agreement") is made and entered into as of January 15, 2025, by and between Urban Real Estate Management LLC ("Landlord"), having an address at 742 Evergreen Terrace, Suite 300, and Jane Doe ("Tenant"), with email jane.doe@example.com and phone +1 (555) 234-5678.

1. DEMISED PREMISES & TERM
Landlord hereby leases to Tenant the real property located at 450 Maple Avenue, Apt 4B ("Premises"). The lease term shall commence on February 1, 2025, and shall terminate on January 31, 2026 ("Initial Term").

2. AUTOMATIC EXTENSION & EVERGREEN CLAUSE
Unless Tenant delivers formal written notice of intent to vacate by certified registered mail at least ninety (90) calendar days prior to the expiration of the Initial Term, this Agreement shall automatically renew for an additional successive twenty-four (24) month period at a rental rate determined exclusively by Landlord, not to exceed a thirty percent (30%) increase.

3. SECURITY DEPOSIT & FORFEITURE
Tenant shall deposit with Landlord the sum of $3,200.00 as a Security Deposit. Landlord shall retain this deposit in a non-interest-bearing operating account. In the event Tenant vacates before the end of the term for any reason whatsoever, the entire Security Deposit shall be irrevocably forfeited as liquidated damages, notwithstanding any legal mitigation obligations. Furthermore, a non-refundable cleaning fee of $450.00 will be deducted automatically upon move-out regardless of property cleanliness.

4. UNANNOUNCED LANDLORD ACCESS & INSPECTION
Landlord, its agents, and prospective purchasers or tenants may enter the Premises at any time, with or without prior notice, between the hours of 7:00 AM and 10:00 PM for the purposes of inspection, maintenance, repairs, or property showing. Tenant shall not install auxiliary security deadbolts or change lock cylinders without prior written consent.

5. MAINTENANCE, REPAIRS, AND OCCUPANT LIABILITY
Tenant shall be solely responsible for all maintenance, routine plumbing repairs, unclogging drains, HVAC filter replacements, and any pest extermination expenses incurred during the tenancy, regardless of origin or pre-existing infestation status.

6. UNILATERAL TERMINATION & ACCELERATED RENT
In the event Tenant fails to pay rent within three (3) business days of the due date, Landlord may immediately terminate Tenant's right of possession without notice or judicial proceeding. Upon such default, all remaining rent due for the remainder of the full lease term shall immediately become due and payable in full ("Rent Acceleration").

7. WAIVER OF JURY TRIAL & MANDATORY ARBITRATION
Tenant hereby irrevocably waives any right to a trial by jury in any action or proceeding arising out of or related to this Agreement. Any dispute shall be resolved through confidential binding arbitration before a single arbitrator selected solely by Landlord. The costs of arbitration shall be borne entirely by Tenant unless the arbitrator determines otherwise.`,
    summary: {
      tldr: 'A heavily one-sided residential rental agreement that gives the landlord unilateral access, automatic 2-year lock-in renewals, immediate deposit forfeiture, and shifts standard maintenance expenses onto the tenant.',
      plainEnglish: 'This lease locks you into aggressive landlord terms. If you don’t give a 90-day certified mail notice before your lease ends, it automatically renews for 2 full years with up to a 30% rent hike. The landlord can enter your home anytime between 7am and 10pm without notice, and you are forced to pay for all plumbing and pest issues. If you leave early, you lose your entire $3,200 deposit.',
      eli5: 'Imagine borrowing a toy from someone who says: "If you don’t tell me 3 months in advance, you have to keep paying for it for 2 more years at double the price. Also, I can walk into your bedroom whenever I want without knocking, and if the toy breaks by itself, you have to pay to fix it."'
    },
    keyTakeaways: [
      '⚠️ Automatic 24-month renewal with up to 30% rent increase unless 90 days notice given.',
      '🚨 Landlord can enter without prior notice between 7:00 AM and 10:00 PM.',
      '❌ Unlawful complete security deposit forfeiture clause if lease broken early.',
      '🛠️ Tenant forced to pay for pest control and plumbing regardless of fault.',
      '⚖️ Mandatory arbitration before landlord-selected arbitrator with full tenant fees.'
    ],
    riskAssessment: {
      overallScore: 88,
      grade: 'F',
      verdict: 'Extremely High Risk — Multiple Predatory Clauses Detected',
      summary: 'This lease contains multiple unconscionable and likely unenforceable clauses under standard tenant protection laws (e.g. entry without notice, unilateral arbitrator selection, automatic deposit forfeiture). Highly advised to request redlines before signing.',
      highRiskCount: 4,
      mediumRiskCount: 2,
      lowRiskCount: 1,
      predatoryTrapsFound: [
        'Evergreen 24-month auto-renewal with 30% uncapped hike',
        'Unannounced entry without notice (Violates Quiet Enjoyment)',
        'Full security deposit forfeiture as penalty',
        'Asymmetric arbitration with unilateral arbitrator choice'
      ],
      flags: [
        {
          id: 'flag-1',
          clauseId: 'lease-c2',
          clauseNumber: 'Clause 2',
          title: 'Evergreen Auto-Renewal Trap (24 Months)',
          severity: 'critical',
          category: 'Termination',
          whyItMatters: 'If you miss the 90-day certified mail window, you are trapped for 2 additional years, and the landlord can hike the rent by 30%.',
          recommendation: 'Negotiate down to month-to-month continuation or 30-day notice with maximum 3-5% inflation cap.',
          suggestedAlternativeText: 'Upon expiration of the Initial Term, this Agreement shall convert to a month-to-month tenancy terminable by either party upon thirty (30) days written notice. Any rent adjustments shall not exceed the regional CPI index.'
        },
        {
          id: 'flag-2',
          clauseId: 'lease-c4',
          clauseNumber: 'Clause 4',
          title: 'Unannounced Entry (Infringement of Privacy)',
          severity: 'critical',
          category: 'Privacy',
          whyItMatters: 'Standard statutory law requires at least 24-48 hours advance notice before landlord entry, except during bona fide emergencies.',
          recommendation: 'Demand 24-hour written notice for non-emergency inspections.',
          suggestedAlternativeText: 'Landlord may enter the Premises only with at least twenty-four (24) hours advance written notice, during reasonable business hours (9 AM - 5 PM), except in genuine emergencies.'
        },
        {
          id: 'flag-3',
          clauseId: 'lease-c3',
          clauseNumber: 'Clause 3',
          title: 'Unlawful Security Deposit Forfeiture & Mandatory Deductions',
          severity: 'high',
          category: 'Financial',
          whyItMatters: 'Security deposits are legally tenant funds held in trust for actual verifiable damages beyond normal wear and tear, not punitive bonuses.',
          recommendation: 'Remove automatic forfeiture and automatic cleaning deductions.',
          suggestedAlternativeText: 'The Security Deposit shall be returned within thirty (30) days of move-out, less itemized deductions only for physical damage exceeding normal wear and tear.'
        },
        {
          id: 'flag-4',
          clauseId: 'lease-c6',
          clauseNumber: 'Clause 6',
          title: 'Illegal Self-Help Eviction & Accelerated Rent',
          severity: 'critical',
          category: 'Termination',
          whyItMatters: 'Terminating possession without judicial due process (court eviction proceedings) is illegal self-help eviction in almost all jurisdictions.',
          recommendation: 'Strike immediate termination without notice and limit damages to actual mitigated losses.',
          suggestedAlternativeText: 'In the event of non-payment, Landlord shall provide statutory notice to cure prior to commencing formal eviction proceedings in accordance with applicable state law.'
        }
      ]
    },
    clauses: [
      {
        id: 'lease-c1',
        number: '1',
        title: 'Demised Premises & Term',
        originalText: 'Landlord hereby leases to Tenant the real property located at 450 Maple Avenue, Apt 4B ("Premises"). The lease term shall commence on February 1, 2025, and shall terminate on January 31, 2026 ("Initial Term").',
        simplifiedText: 'You are renting Apartment 4B from Feb 1, 2025 to Jan 31, 2026 (a standard 12-month period).',
        readingLevels: {
          tldr: 'Standard 1-year lease from Feb 1, 2025 to Jan 31, 2026.',
          plainEnglish: 'Defines the rental address (450 Maple Ave, Apt 4B) and the initial lease duration of exactly one year.',
          eli5: 'You get to live in the apartment for one year starting February 1st.'
        },
        category: 'Termination',
        riskLevel: 'low'
      },
      {
        id: 'lease-c2',
        number: '2',
        title: 'Automatic Extension & Evergreen Clause',
        originalText: 'Unless Tenant delivers formal written notice of intent to vacate by certified registered mail at least ninety (90) calendar days prior to the expiration of the Initial Term, this Agreement shall automatically renew for an additional successive twenty-four (24) month period at a rental rate determined exclusively by Landlord, not to exceed a thirty percent (30%) increase.',
        simplifiedText: 'If you do not send a registered letter 90 days before the lease ends, you are automatically locked into 2 more years at up to 30% higher rent.',
        readingLevels: {
          tldr: 'Requires 90-day certified mail notice or traps you in a 2-year renewal with +30% rent.',
          plainEnglish: 'A strict renewal clause. If you forget to mail a certified cancellation notice 3 months ahead, your lease automatically extends for two whole years, and the landlord can raise your rent by nearly a third.',
          eli5: 'If you don\'t warn the landlord 3 months early with special mail, you are stuck paying way more rent for two extra years.'
        },
        category: 'Termination',
        riskLevel: 'critical',
        riskExplanation: 'Automatic renewal clauses with tight, burdensome notice requirements and large discretionary rent hikes are common predatory tactics.',
        counterProposalRecommendation: 'Request converting to month-to-month after year 1 with 30 days email notice.'
      },
      {
        id: 'lease-c3',
        number: '3',
        title: 'Security Deposit & Forfeiture',
        originalText: 'Tenant shall deposit with Landlord the sum of $3,200.00 as a Security Deposit. Landlord shall retain this deposit in a non-interest-bearing operating account. In the event Tenant vacates before the end of the term for any reason whatsoever, the entire Security Deposit shall be irrevocably forfeited as liquidated damages, notwithstanding any legal mitigation obligations. Furthermore, a non-refundable cleaning fee of $450.00 will be deducted automatically upon move-out regardless of property cleanliness.',
        simplifiedText: 'You pay $3,200 deposit. If you leave early for any reason, they keep all of it. Also, they take $450 cleaning fee automatically even if it is spotless.',
        readingLevels: {
          tldr: '$3,200 deposit is forfeited if you move early; mandatory $450 cleaning fee deducted regardless of clean state.',
          plainEnglish: 'Your $3,200 deposit is placed in the landlord’s general bank account without interest. If you break the lease early, the landlord claims 100% of it immediately. On top of that, $450 is taken out for cleaning upon departure no matter how clean the unit is.',
          eli5: 'They keep your $3,200 if you have to move, and charge $450 to clean even if you scrubbed the floors with a toothbrush.'
        },
        category: 'Financial',
        riskLevel: 'high',
        riskExplanation: 'Security deposits must typically be held in escrow and returned minus verifiable repair costs. Mandatory cleaning fees often violate local ordinances.',
        counterProposalRecommendation: 'Demand escrow protection and remove mandatory cleaning deduction.'
      },
      {
        id: 'lease-c4',
        number: '4',
        title: 'Unannounced Landlord Access & Inspection',
        originalText: 'Landlord, its agents, and prospective purchasers or tenants may enter the Premises at any time, with or without prior notice, between the hours of 7:00 AM and 10:00 PM for the purposes of inspection, maintenance, repairs, or property showing. Tenant shall not install auxiliary security deadbolts or change lock cylinders without prior written consent.',
        simplifiedText: 'The landlord or strangers can walk into your apartment between 7 AM and 10 PM whenever they want without telling you first.',
        readingLevels: {
          tldr: 'Landlord can enter your apartment without any notice between 7:00 AM and 10:00 PM.',
          plainEnglish: 'The landlord claims the right to enter your home for 15 hours every single day without calling or texting you beforehand, stripping away your right to privacy and quiet enjoyment.',
          eli5: 'The landlord can unlock your door and walk in while you are eating breakfast or sleeping in your pyjamas without calling you.'
        },
        category: 'Privacy',
        riskLevel: 'critical',
        riskExplanation: 'Severely breaches standard statutory rights to quiet enjoyment and reasonable 24-hour notice.',
        counterProposalRecommendation: 'Change to mandatory 24-hour written notice between 9 AM - 5 PM.'
      },
      {
        id: 'lease-c5',
        number: '5',
        title: 'Maintenance, Repairs, and Occupant Liability',
        originalText: 'Tenant shall be solely responsible for all maintenance, routine plumbing repairs, unclogging drains, HVAC filter replacements, and any pest extermination expenses incurred during the tenancy, regardless of origin or pre-existing infestation status.',
        simplifiedText: 'You have to pay for all plumbing, repairs, and pest exterminators, even if the bugs or broken pipes were there before you moved in.',
        readingLevels: {
          tldr: 'Tenant pays for all plumbing, HVAC, and pest control even if caused by previous tenants.',
          plainEnglish: 'Shifts traditional landlord warranty of habitability duties onto the tenant. If pipes leak inside the wall or bedbugs exist in the building, the landlord tries to make you pay for it.',
          eli5: 'If termites or mice were already living in the walls, the landlord makes you pay the exterminator.'
        },
        category: 'Liability',
        riskLevel: 'medium',
        riskExplanation: 'Landlords are legally obligated to maintain habitability and common structural plumbing.',
        counterProposalRecommendation: 'Tenant responsible only for repairs caused by tenant misuse.'
      },
      {
        id: 'lease-c6',
        number: '6',
        title: 'Unilateral Termination & Accelerated Rent',
        originalText: 'In the event Tenant fails to pay rent within three (3) business days of the due date, Landlord may immediately terminate Tenant\'s right of possession without notice or judicial proceeding. Upon such default, all remaining rent due for the remainder of the full lease term shall immediately become due and payable in full ("Rent Acceleration").',
        simplifiedText: 'If you are 3 days late on rent, the landlord can kick you out without going to court and demand you pay all remaining months of rent right away.',
        readingLevels: {
          tldr: '3-day default leads to instant eviction without court order and demands full year\'s rent immediately.',
          plainEnglish: 'If rent is 3 days late, the landlord claims the power to lock you out immediately without a court hearing and demand all future rent upfront.',
          eli5: 'If you pay late on Friday, they kick you out on Monday and still demand rent for the whole rest of the year.'
        },
        category: 'Termination',
        riskLevel: 'critical',
        riskExplanation: 'Accelerated rent without duty to mitigate and self-help evictions are explicitly prohibited in most states/regions.',
        counterProposalRecommendation: 'Standard 5-day grace period, statutory notice to cure, and striking rent acceleration.'
      },
      {
        id: 'lease-c7',
        number: '7',
        title: 'Waiver of Jury Trial & Mandatory Arbitration',
        originalText: 'Tenant hereby irrevocably waives any right to a trial by jury in any action or proceeding arising out of or related to this Agreement. Any dispute shall be resolved through confidential binding arbitration before a single arbitrator selected solely by Landlord. The costs of arbitration shall be borne entirely by Tenant unless the arbitrator determines otherwise.',
        simplifiedText: 'You give up your right to go to court or have a jury. The landlord picks the private arbitrator, and you have to pay all the expensive arbitration fees.',
        readingLevels: {
          tldr: 'Waives jury trial, forces arbitration with landlord-picked arbitrator, and forces tenant to pay costs.',
          plainEnglish: 'You cannot sue the landlord in small claims or civil court. You must use a private arbitrator picked by the landlord, and you have to pay the arbitration fees which can cost thousands of dollars.',
          eli5: 'You can\'t go to a real judge. The landlord picks the referee, and you have to pay the referee\'s salary.'
        },
        category: 'Dispute Resolution',
        riskLevel: 'high',
        riskExplanation: 'Unilateral arbitrator selection creates an inherent conflict of interest and heavily chills tenant grievances.',
        counterProposalRecommendation: 'Preserve small claims court rights; strike unilateral arbitrator selection.'
      }
    ],
    obligations: [
      {
        id: 'ob-1',
        clauseRef: 'Clause 2',
        party: 'user',
        title: 'Send 90-Day Vacate Notice',
        description: 'Deliver formal written notice by certified registered mail at least 90 days before lease ends (by Nov 2, 2025) to prevent 2-year auto-renewal.',
        deadlineOrFrequency: 'Nov 2, 2025',
        isRecurring: false,
        consequenceOfDefault: 'Automatic renewal for 24 months with up to 30% rent increase.'
      },
      {
        id: 'ob-2',
        clauseRef: 'Clause 3',
        party: 'user',
        title: 'Security Deposit Payment',
        description: 'Pay $3,200 security deposit upon lease signing.',
        deadlineOrFrequency: 'Due at signing',
        isRecurring: false,
        consequenceOfDefault: 'Inability to take possession.'
      },
      {
        id: 'ob-3',
        clauseRef: 'Clause 5',
        party: 'user',
        title: 'Routine Maintenance & Pest Incurrence',
        description: 'Perform all plumbing maintenance and pay for any pest extermination needed.',
        deadlineOrFrequency: 'As issues arise',
        isRecurring: true,
        consequenceOfDefault: 'Out-of-pocket repair bills and potential damage claims.'
      }
    ],
    suggestedQuestions: [
      'Can the landlord really enter my apartment without giving 24 hours notice?',
      'What happens if I forget to give notice 90 days before my lease ends?',
      'Is the automatic $450 cleaning fee deduction legally valid?',
      'Can the landlord kick me out without a court eviction order if I pay 4 days late?',
      'How do I negotiate a safer version of Clause 2 and Clause 4?'
    ]
  },
  {
    id: 'freelance-contractor-2025',
    title: 'Independent Contractor Services Agreement',
    subtitle: 'Apex Global Software Inc. vs. Freelance Engineer (Predatory IP & Non-Compete)',
    category: 'freelance',
    rawText: `INDEPENDENT CONTRACTOR SERVICES AGREEMENT

This Agreement is entered into on March 1, 2025, between Apex Global Software Inc. ("Company") and Alex Rivera ("Contractor"), residing at 120 Silicon Way, Austin, TX.

1. SCOPE & PAYMENT TERMS
Contractor shall develop backend REST API microservices. Company shall pay Contractor an hourly rate of $95.00 USD. Contractor shall submit invoices on the last day of each month. Payment shall be made within ninety (90) business days following receipt and approval of invoice ("Net 90").

2. ALL-ENCOMPASSING INTELLECTUAL PROPERTY ASSIGNMENT
Contractor hereby irrevocably assigns, transfers, and conveys to Company all right, title, and interest worldwide in and to all inventions, ideas, computer code, discoveries, designs, and works of authorship created, conceived, or reduced to practice by Contractor during the term of this Agreement, whether or not conceived on Company equipment, outside normal business hours, or unrelated to Company's business. Contractor waives all moral rights.

3. WORLDWIDE 24-MONTH NON-COMPETE & NON-SOLICITATION
During the term of this Agreement and for a period of twenty-four (24) months following termination for any reason, Contractor shall not, directly or indirectly, perform software engineering services, consult for, advise, or be employed by any entity that operates in the technology, cloud computing, or software sector worldwide. Contractor shall not solicit any Company client or worker.

4. UNLIMITED INDEMNIFICATION & CONSEQUENTIAL DAMAGES
Contractor shall defend, indemnify, and hold harmless Company, its directors, officers, and affiliates from and against any and all claims, liabilities, losses, damages, attorney fees, and costs arising out of any alleged bug, code error, service outage, delay, or breach of warranty. Contractor agrees that Contractor's liability under this Agreement shall be uncapped and shall include lost profits and consequential damages.

5. TERMINATION AT WILL BY COMPANY ONLY
Company may terminate this Agreement immediately for convenience with zero notice and zero termination compensation. Contractor may terminate only upon sixty (60) days advance written notice and must provide up to forty (40) hours of uncompensated transition assistance.`,
    summary: {
      tldr: 'An aggressive freelance agreement that delays pay for 3+ months (Net 90), steals all personal side-project IP, bans you from coding for any tech company worldwide for 2 years, and makes you liable for unlimited damages.',
      plainEnglish: 'This contractor agreement is highly dangerous for a freelancer. You don\'t get paid until 90 days after your invoice. Any code or hobby project you build in your spare time becomes the company\'s property. You are banned from writing software for any tech business globally for 2 years after leaving, and you can be sued for unlimited amounts if your code has a bug.',
      eli5: 'You do chores for someone, but they don’t pay your allowance for 3 months. Any drawings or LEGO castles you build on your own time belong to them. If you quit, you\'re forbidden from building with LEGOs for anyone else in the whole world for two years.'
    },
    keyTakeaways: [
      '🚨 Net 90 payment terms: You may work 4 months before seeing a single dollar.',
      '❌ Unreasonable IP grab: Company claims ownership of your personal side projects.',
      '⛔ 2-year worldwide non-compete banning you from any software job.',
      '💥 Unlimited liability including lost profits if your software has bugs.',
      '⚖️ Asymmetric termination: Company can fire with 0 notice; you must give 60 days.'
    ],
    riskAssessment: {
      overallScore: 94,
      grade: 'F',
      verdict: 'Critical Risk — Highly Predatory Terms for Freelancers',
      summary: 'Severely disproportionate risks. The IP clause attempts to claim unrelated personal projects, the non-compete is a career-chilling restraint of trade, and the uncapped indemnification exposes personal assets.',
      highRiskCount: 5,
      mediumRiskCount: 0,
      lowRiskCount: 0,
      predatoryTrapsFound: [
        'Overreaching assignment of personal side-project IP',
        'Global 24-month ban on working in tech',
        'Net 90 delayed payments (90 business days is ~4.5 months)',
        'Uncapped liability including lost profits for software bugs',
        'Unilateral termination rights with uncompensated transition work'
      ],
      flags: [
        {
          id: 'flag-f1',
          clauseId: 'fc-c2',
          clauseNumber: 'Clause 2',
          title: 'Total Intellectual Property Seizure',
          severity: 'critical',
          category: 'Intellectual Property',
          whyItMatters: 'Claims code made on your own time, equipment, and unrelated to the project.',
          recommendation: 'Scope assignment strictly to deliverables created specifically for the project during billable hours.',
          suggestedAlternativeText: 'Contractor assigns to Company only the specific Deliverables created for Company pursuant to a written Statement of Work. Pre-existing IP, tools, and unrelated personal projects remain the sole property of Contractor.'
        },
        {
          id: 'flag-f2',
          clauseId: 'fc-c3',
          clauseNumber: 'Clause 3',
          title: 'Unenforceable Worldwide 2-Year Non-Compete',
          severity: 'critical',
          category: 'Restrictive Covenant',
          whyItMatters: 'Deprives you of the ability to earn a living in your profession anywhere on earth.',
          recommendation: 'Completely strike non-compete. Keep only reasonable non-solicitation of direct clients.',
          suggestedAlternativeText: 'Contractor shall not directly solicit Company\'s active clients for identical services for a period of six (6) months following termination.'
        },
        {
          id: 'flag-f3',
          clauseId: 'fc-c4',
          clauseNumber: 'Clause 4',
          title: 'Uncapped Liability & Consequential Damages',
          severity: 'critical',
          category: 'Liability',
          whyItMatters: 'A single software bug causing downtime could result in a lawsuit for millions of dollars of company lost profits.',
          recommendation: 'Cap total liability to the amount of fees paid in the preceding 6 months; exclude consequential damages.',
          suggestedAlternativeText: 'Neither party shall be liable for indirect, incidental, or consequential damages. Contractor\'s total liability under this Agreement shall be strictly capped at the total fees actually paid to Contractor in the three (3) months prior to the claim.'
        },
        {
          id: 'flag-f4',
          clauseId: 'fc-c1',
          clauseNumber: 'Clause 1',
          title: 'Net 90 Business Days Payment Terms',
          severity: 'high',
          category: 'Financial',
          whyItMatters: '90 business days equates to approximately 18 weeks (4.5 months) before getting paid for completed work.',
          recommendation: 'Change to standard Net 15 or Net 30 days with interest on late payments.',
          suggestedAlternativeText: 'Invoices shall be payable within thirty (30) calendar days of receipt. Late payments shall accrue interest at 1.5% per month.'
        }
      ]
    },
    clauses: [
      {
        id: 'fc-c1',
        number: '1',
        title: 'Scope & Payment Terms',
        originalText: 'Contractor shall develop backend REST API microservices. Company shall pay Contractor an hourly rate of $95.00 USD. Contractor shall submit invoices on the last day of each month. Payment shall be made within ninety (90) business days following receipt and approval of invoice ("Net 90").',
        simplifiedText: 'You get $95/hr, but the company can wait 90 business days (over 4 months) after approving your invoice before paying you.',
        readingLevels: {
          tldr: 'Hourly rate is $95/hr, but payment takes 90 business days (~4.5 months) after invoice approval.',
          plainEnglish: 'You bill at $95/hr, but you might work in March, invoice in April, and not see your money until August or September.',
          eli5: 'You do the work now, but they don\'t give you the money until four months later.'
        },
        category: 'Financial',
        riskLevel: 'high'
      },
      {
        id: 'fc-c2',
        number: '2',
        title: 'All-Encompassing Intellectual Property Assignment',
        originalText: 'Contractor hereby irrevocably assigns, transfers, and conveys to Company all right, title, and interest worldwide in and to all inventions, ideas, computer code, discoveries, designs, and works of authorship created, conceived, or reduced to practice by Contractor during the term of this Agreement, whether or not conceived on Company equipment, outside normal business hours, or unrelated to Company\'s business. Contractor waives all moral rights.',
        simplifiedText: 'The company claims ownership of everything you create—even personal open source projects, game ideas, or blogs you write on weekends.',
        readingLevels: {
          tldr: 'Company owns all code and ideas you create during the contract, even on weekends and personal computers.',
          plainEnglish: 'The company claims full ownership over every invention, code repository, or idea you touch while this contract is active, even if made on your own laptop at 2 AM with no connection to the client.',
          eli5: 'If you draw a comic book or build an app for fun on Sunday, they say it belongs to them, not you.'
        },
        category: 'Intellectual Property',
        riskLevel: 'critical'
      },
      {
        id: 'fc-c3',
        number: '3',
        title: 'Worldwide 24-Month Non-Compete',
        originalText: 'During the term of this Agreement and for a period of twenty-four (24) months following termination for any reason, Contractor shall not, directly or indirectly, perform software engineering services, consult for, advise, or be employed by any entity that operates in the technology, cloud computing, or software sector worldwide. Contractor shall not solicit any Company client or worker.',
        simplifiedText: 'You cannot work in tech or write software anywhere in the world for 2 years after this contract ends.',
        readingLevels: {
          tldr: 'Global 2-year non-compete preventing you from writing software for any tech company.',
          plainEnglish: 'An impossible non-compete restriction. It says you cannot do software engineering anywhere on Earth for any technology firm for two full years.',
          eli5: 'If you stop working for them, you are banned from having any programming job anywhere on Earth for two whole years.'
        },
        category: 'Restrictive Covenant',
        riskLevel: 'critical'
      },
      {
        id: 'fc-c4',
        number: '4',
        title: 'Unlimited Indemnification & Consequential Damages',
        originalText: 'Contractor shall defend, indemnify, and hold harmless Company, its directors, officers, and affiliates from and against any and all claims, liabilities, losses, damages, attorney fees, and costs arising out of any alleged bug, code error, service outage, delay, or breach of warranty. Contractor agrees that Contractor\'s liability under this Agreement shall be uncapped and shall include lost profits and consequential damages.',
        simplifiedText: 'If there is a software bug or downtime, you personally must pay for the company\'s lost profits, with no dollar limit.',
        readingLevels: {
          tldr: 'Uncapped liability for bugs; you must pay for company downtime and lost profits.',
          plainEnglish: 'You assume total personal financial risk for any bug or system outage, including lost revenue of the client. This could bankrupt an individual freelancer.',
          eli5: 'If the website goes down because of your code, they could try to take your savings and house to pay for their lost sales.'
        },
        category: 'Liability',
        riskLevel: 'critical'
      },
      {
        id: 'fc-c5',
        number: '5',
        title: 'Termination at Will by Company Only',
        originalText: 'Company may terminate this Agreement immediately for convenience with zero notice and zero termination compensation. Contractor may terminate only upon sixty (60) days advance written notice and must provide up to forty (40) hours of uncompensated transition assistance.',
        simplifiedText: 'They can fire you instantly without warning or severance, but you must give 60 days notice and work 40 hours for free before leaving.',
        readingLevels: {
          tldr: 'Company can fire with 0 notice; you need 60 days notice and must work 40 hours for free.',
          plainEnglish: 'The company can cut you off immediately, while you must give 2 months notice and provide 40 hours of free labor to train your replacement.',
          eli5: 'They can tell you to leave today, but if you want to leave, you have to stay for two months and work a whole week without getting paid.'
        },
        category: 'Termination',
        riskLevel: 'high'
      }
    ],
    obligations: [
      {
        id: 'f-ob-1',
        clauseRef: 'Clause 1',
        party: 'user',
        title: 'Invoice Submission',
        description: 'Submit itemized invoices on the final day of each calendar month.',
        deadlineOrFrequency: 'Monthly on last day',
        isRecurring: true,
        consequenceOfDefault: 'Delayed payment timeline.'
      },
      {
        id: 'f-ob-2',
        clauseRef: 'Clause 5',
        party: 'user',
        title: '60-Day Termination Notice & 40 Free Hours',
        description: 'Must provide 60 days advance written notice before stopping services and perform 40 hours of unpaid handoff.',
        deadlineOrFrequency: 'Upon termination',
        isRecurring: false,
        consequenceOfDefault: 'Breach of contract claims.'
      }
    ],
    suggestedQuestions: [
      'Can the company legally own my personal hobby projects written on my own laptop?',
      'Is a worldwide 2-year non-compete legally enforceable for an independent contractor?',
      'How can I cap my liability to what the client actually paid me?',
      'What is the standard payment timeline for software freelancers?',
      'How should I counter-propose the termination clause?'
    ]
  },
  {
    id: 'saas-terms-privacy-2025',
    title: 'Consumer SaaS Platform Terms of Service & Privacy Policy',
    subtitle: 'CloudSync Productivity Suite (Mandatory Arbitration & Data Sharing)',
    category: 'saas',
    rawText: `CLOUDSYNC TERMS OF SERVICE & PRIVACY POLICY

Last Updated: January 1, 2025

1. SUBSCRIPTION BILLING & UNILATERAL PRICE INCREASES
By subscribing to CloudSync Premium ($19.99/month), you authorize automatic recurring monthly charges. CloudSync reserves the right to modify subscription pricing at any time without individual notice. Continued use of the Service following any pricing change posted on our website constitutes your irrevocable acceptance of the new fees.

2. USER CONTENT LICENSE & AI TRAINING RIGHTS
You retain ownership of documents, files, and communications uploaded to the Service. However, you grant CloudSync a perpetual, irrevocable, worldwide, royalty-free, sublicensable license to use, host, reproduce, modify, distribute, and analyze your content, and to utilize your uploaded data and personal inputs to train, improve, and commercialize our proprietary Artificial Intelligence and Machine Learning models.

3. MANDATORY ARBITRATION & CLASS ACTION WAIVER
ALL DISPUTES ARISING OUT OF OR RELATING TO THESE TERMS SHALL BE RESOLVED EXCLUSIVELY THROUGH BINDING INDIVIDUAL ARBITRATION IN WILMINGTON, DELAWARE, RATHER THAN IN COURT. YOU AND CLOUDSYNC AGREE THAT EACH MAY BRING CLAIMS AGAINST THE OTHER ONLY IN AN INDIVIDUAL CAPACITY AND NOT AS A PLAINTIFF OR CLASS MEMBER IN ANY PURPORTED CLASS OR REPRESENTATIVE PROCEEDING.

4. DISCLAIMER OF ALL WARRANTIES & $100 LIABILITY CAP
THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND. UNDER NO CIRCUMSTANCES SHALL CLOUDSYNC BE LIABLE FOR ANY LOSS OF DATA, BUSINESS INTERRUPTION, OR DIRECT, INDIRECT, INCIDENTAL, OR CONSEQUENTIAL DAMAGES. CLOUDSYNC'S AGGREGATE LIABILITY SHALL BE STRICTLY LIMITED TO THE AMOUNT OF ONE HUNDRED DOLLARS ($100.00 USD).

5. THIRD-PARTY DATA BROKER SHARING
CloudSync may share, sell, or monetize anonymized, aggregated, or pseudo-anonymized metadata, behavioral telemetry, location traces, and interaction patterns with our trusted advertising partners and third-party data analytics vendors for behavioral targeting.`,
    summary: {
      tldr: 'A standard cloud software agreement that can raise subscription prices without telling you, uses your private files to train their AI models, bans class-action lawsuits, caps their liability at $100 for lost data, and shares telemetry with ad brokers.',
      plainEnglish: 'When using this app, the company can hike your subscription price without sending you an email. While you technically own your files, you give them permission to read your documents and feed your confidential information into their AI systems. You cannot join a class action if they suffer a massive data breach, and they only owe you at most $100 even if they lose all your company files.',
      eli5: 'You pay to store your notebook in their locker. They can raise the price without telling you, read your notebook to teach their robot, and share clues about what you do with advertisers. If they accidentally burn your notebook, they will only give you $100.'
    },
    keyTakeaways: [
      '🤖 AI Training Rights: Your uploaded documents and content can be used to train commercial AI models.',
      '💳 Silent Price Hikes: Prices can increase without direct email notification.',
      '⚖️ Class Action Waiver: You give up rights to join group lawsuits if data is leaked.',
      '💸 $100 Maximum Liability: Even if all your business data is destroyed.',
      '📊 Telemetry sharing with ad partners.'
    ],
    riskAssessment: {
      overallScore: 74,
      grade: 'D',
      verdict: 'Moderate to High Risk — Data Privacy & AI Rights Surrender',
      summary: 'Broad user content license allows training commercial AI on user data. Unilateral price modifications and $100 liability caps significantly favor the platform over the consumer.',
      highRiskCount: 2,
      mediumRiskCount: 3,
      lowRiskCount: 0,
      predatoryTrapsFound: [
        'Commercial AI training license on user uploaded confidential files',
        'Silent unilateral price modifications without direct notification',
        'Mandatory arbitration in remote jurisdiction (Delaware) with class action ban',
        '$100 total liability limit for catastrophic data loss'
      ],
      flags: [
        {
          id: 'flag-s1',
          clauseId: 'saas-c2',
          clauseNumber: 'Clause 2',
          title: 'Perpetual License for AI Training on User Data',
          severity: 'high',
          category: 'Intellectual Property',
          whyItMatters: 'If you upload sensitive trade secrets, personal journals, or confidential code, the company can feed it to their LLMs.',
          recommendation: 'Look for an opt-out toggle or demand an enterprise clause ensuring zero retention for model training.',
          suggestedAlternativeText: 'CloudSync will not use Customer Content, documents, or data to train, fine-tune, or improve any machine learning or artificial intelligence models without Customer\'s explicit opt-in consent.'
        },
        {
          id: 'flag-s2',
          clauseId: 'saas-c3',
          clauseNumber: 'Clause 3',
          title: 'Mandatory Binding Arbitration & Class Action Waiver',
          severity: 'high',
          category: 'Dispute Resolution',
          whyItMatters: 'Forces individual arbitration in Delaware, making it economically impossible to dispute small claims.',
          recommendation: 'Verify if a 30-day arbitration opt-out window is available.',
          suggestedAlternativeText: 'Disputes may be resolved in small claims courts in the jurisdiction of user\'s residence. Users may opt out of arbitration within thirty (30) days of account registration.'
        }
      ]
    },
    clauses: [
      {
        id: 'saas-c1',
        number: '1',
        title: 'Subscription Billing & Unilateral Price Increases',
        originalText: 'By subscribing to CloudSync Premium ($19.99/month), you authorize automatic recurring monthly charges. CloudSync reserves the right to modify subscription pricing at any time without individual notice. Continued use of the Service following any pricing change posted on our website constitutes your irrevocable acceptance of the new fees.',
        simplifiedText: 'They can raise your monthly fee anytime without emailing you. Just keeping your account open means you agreed.',
        readingLevels: {
          tldr: 'Auto-renews at $19.99/mo; price can go up without individual notice.',
          plainEnglish: 'The platform can increase your subscription charge at will. Instead of emailing you, they merely post it on their website, and if you don\'t cancel, you are charged the higher rate.',
          eli5: 'They can charge you more money whenever they want, and won\'t even send you an email first.'
        },
        category: 'Financial',
        riskLevel: 'medium'
      },
      {
        id: 'saas-c2',
        number: '2',
        title: 'User Content License & AI Training Rights',
        originalText: 'You retain ownership of documents, files, and communications uploaded to the Service. However, you grant CloudSync a perpetual, irrevocable, worldwide, royalty-free, sublicensable license to use, host, reproduce, modify, distribute, and analyze your content, and to utilize your uploaded data and personal inputs to train, improve, and commercialize our proprietary Artificial Intelligence and Machine Learning models.',
        simplifiedText: 'You own your files, but you give them permission to read them and use your data to teach their commercial AI models forever.',
        readingLevels: {
          tldr: 'Grants perpetual rights to use your files and text to train their AI models.',
          plainEnglish: 'While claiming you retain copyright, the license terms give CloudSync the legal right to feed your documents, code, and text into their AI training pipelines without paying you royalties.',
          eli5: 'They can show your homework and stories to their smart computers to teach them how to think.'
        },
        category: 'Intellectual Property',
        riskLevel: 'high'
      },
      {
        id: 'saas-c3',
        number: '3',
        title: 'Mandatory Arbitration & Class Action Waiver',
        originalText: 'ALL DISPUTES ARISING OUT OF OR RELATING TO THESE TERMS SHALL BE RESOLVED EXCLUSIVELY THROUGH BINDING INDIVIDUAL ARBITRATION IN WILMINGTON, DELAWARE, RATHER THAN IN COURT. YOU AND CLOUDSYNC AGREE THAT EACH MAY BRING CLAIMS AGAINST THE OTHER ONLY IN AN INDIVIDUAL CAPACITY AND NOT AS A PLAINTIFF OR CLASS MEMBER IN ANY PURPORTED CLASS OR REPRESENTATIVE PROCEEDING.',
        simplifiedText: 'You cannot sue in court or join with other users in a class action. You must travel to Delaware for private arbitration.',
        readingLevels: {
          tldr: 'Mandatory individual arbitration in Delaware; strips rights to participate in class actions.',
          plainEnglish: 'Prevents you from taking CloudSync to court or banding together with other affected consumers in a class action lawsuit if a major breach or fraud occurs.',
          eli5: 'If they mess up, you can\'t team up with other angry customers or go to a normal court.'
        },
        category: 'Dispute Resolution',
        riskLevel: 'high'
      },
      {
        id: 'saas-c4',
        number: '4',
        title: 'Disclaimer of All Warranties & $100 Liability Cap',
        originalText: 'THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND. UNDER NO CIRCUMSTANCES SHALL CLOUDSYNC BE LIABLE FOR ANY LOSS OF DATA, BUSINESS INTERRUPTION, OR DIRECT, INDIRECT, INCIDENTAL, OR CONSEQUENTIAL DAMAGES. CLOUDSYNC\'S AGGREGATE LIABILITY SHALL BE STRICTLY LIMITED TO THE AMOUNT OF ONE HUNDRED DOLLARS ($100.00 USD).',
        simplifiedText: 'If CloudSync loses all your files or crashes your business, the most they will ever pay you is $100.',
        readingLevels: {
          tldr: 'Service is "as is"; maximum compensation for lost data is capped at $100.',
          plainEnglish: 'CloudSync disclaims all responsibility for data loss, server crashes, or damages, and caps their maximum legal liability to just $100.',
          eli5: 'Even if they accidentally erase 10 years of your photos or business files, they will only hand you $100 and say sorry.'
        },
        category: 'Liability',
        riskLevel: 'medium'
      },
      {
        id: 'saas-c5',
        number: '5',
        title: 'Third-Party Data Broker Sharing',
        originalText: 'CloudSync may share, sell, or monetize anonymized, aggregated, or pseudo-anonymized metadata, behavioral telemetry, location traces, and interaction patterns with our trusted advertising partners and third-party data analytics vendors for behavioral targeting.',
        simplifiedText: 'They can sell your activity, location data, and usage habits to advertisers and data brokers.',
        readingLevels: {
          tldr: 'Monetizes user metadata and location traces with ad networks and data brokers.',
          plainEnglish: 'CloudSync monetizes telemetry, app usage habits, and location traces by sharing them with ad networks and third-party data brokers.',
          eli5: 'They tell advertisers when you log in, where you are, and what buttons you click so ads can follow you.'
        },
        category: 'Privacy',
        riskLevel: 'medium'
      }
    ],
    obligations: [
      {
        id: 'saas-ob-1',
        clauseRef: 'Clause 1',
        party: 'user',
        title: 'Monthly Subscription Payment',
        description: 'Automatic recurring monthly payment of $19.99 or adjusted fee.',
        deadlineOrFrequency: 'Monthly recurring',
        isRecurring: true,
        consequenceOfDefault: 'Account suspension and deletion of files.'
      }
    ],
    suggestedQuestions: [
      'Can I opt out of having my documents used to train CloudSync’s AI models?',
      'Can CloudSync raise my subscription price without sending an email notification?',
      'What happens if my business data is permanently deleted by a CloudSync server outage?',
      'How does the class action waiver affect me if there is a data breach?'
    ]
  }
];
