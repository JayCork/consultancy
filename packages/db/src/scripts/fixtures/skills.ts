import { max } from "drizzle-orm";

export type DdatSkillFixture = {
  name: string;
  description?: string;
  /** If omitted, derived from name: lowercase, remove parentheses and commas, spaces → hyphens */
  code?: string;
  /** If omitted, defaults to 4 */
  max_level?: number;
};

export const ddatSkills: DdatSkillFixture[] = [
  {
    name: "Accessibility",
    description:
      "Accessibility involves ensuring your service can be used by as many people as possible, including those with impaired vision, motor difficulties, cognitive impairments, learning disabilities and deafness.",
  },
  {
    name: "Adapting to delivery methodologies",
    description:
      "Adapting to delivery methodologies involves contributing to discussions on the appropriate delivery methodology to use, and adapting your approach based on the delivery methodology of the team.",
  },
  {
    name: "Agile and Lean practices",
    description:
      "Agile and Lean practices involves encouraging teams to build incrementally, test and iterate their work based on regular feedback and other useful data.",
  },
  {
    name: "Agile research practices",
    description:
      "Agile delivery involves encouraging teams to build incrementally, test and iterate their work based on regular feedback and other useful data.",
  },
  {
    name: "Agile working",
    description:
      "Agile delivery involves encouraging teams to build incrementally, test and iterate their work based on regular feedback and other useful data.",
  },
  {
    name: "Agile working (content design)",
    description:
      "Agile delivery involves encouraging teams to build incrementally, test and iterate their work based on regular feedback and other useful data.",
  },
  {
    name: "Analysis",
    description:
      "Analysis involves examining, interpreting and analysing data to help make informed decisions.",
  },
  {
    name: "Analysis and insight",
    description:
      "Analysis and insight involves examining, interpreting and analysing data to help make informed decisions.",
  },
  {
    name: "Analysis and synthesis",
  },
  {
    name: "Analysis and synthesis (data ethics)",
  },
  {
    name: "Applied maths, statistics and scientific practices",
    description:
      "Applied mathematics and statistics involves applying analytical methods including exploratory data analysis, visualisation and statistical testing to help make accurate recommendations.",
  },
  {
    name: "Applied social sciences",
    description:
      "Applied social sciences involves using an understanding of the social sciences to evaluate and challenge assumptions made in relevant projects.",
  },
  {
    name: "Applying statistical and analytical tools and techniques",
    description:
      "Applying statistical and analytical techniques involves using and evaluating methods to answer research questions and make data-informed recommendations.",
  },
  {
    name: "Applying user-centred insights",
    description:
      "Applying user-centred insights involves understanding all user needs and the problems that need to be solved, and applying insights to make decisions that meet these needs.",
  },
  {
    name: "Architect for the whole context",
  },
  {
    name: "Architecture communication",
    description:
      "Communication involves conveying information using the most effective medium and language for the audience.",
  },
  {
    name: "Asset and configuration management",
    description:
      "Asset and configuration management involves managing the life cycle of IT assets, such as hardware, software, intellectual property, licences and warranties, the configuration of components, and the relationships between them. Consideration is given to the usage, disposal, compliance, inventory, sustainability, cost optimisation and protection of the IT asset portfolio.",
  },
  {
    name: "Availability and capacity management",
    description:
      "Availability and capacity management involves ensuring services are available with as little downtime or disruption as possible, and that we have sufficient resources to support emerging business needs.",
  },
  {
    name: "Business analysis (IT operations)",
    description:
      "Business analysis involves understanding the business needs and translating those requirements into solutions through detailed analysis and feedback.",
  },
  {
    name: "Business architecture",
    description:
      "Business architecture involves using industry standards to develop integrated views of an organisation that help implement organisational strategy and solve complex problems.",
  },
  {
    name: "Business modelling",
    description:
      "Business modelling involves visualising, analysing and communicating current and future business situations and how business components influence each other.",
  },
  {
    name: "Business process improvement",
    description:
      "Business process improvement involves creating appropriate artefacts and analysing, modifying and testing existing and new processes to make them more efficient.",
  },
  {
    name: "Capability building for digital, data and technology",
  },
  {
    name: "Change management",
    description:
      "Change management involves managing changes to services, organisations, suppliers or configuration items, and the associated documentation.",
  },
  {
    name: "Changing security culture",
  },
  {
    name: "Coding and scripting",
    description:
      "Coding and scripting involves designing, writing and iterating code and scripts from prototype to production.",
  },
  {
    name: "Commercial management",
    description:
      "Commercial management involves exploring commercial opportunities whilst complying with the regulations on how we conduct and manage both internal and third party relationships.",
  },
  {
    name: "Commercial perspective",
    description:
      "Commercial management involves exploring commercial opportunities whilst complying with the regulations on how we conduct and manage both internal and third party relationships.",
  },
  {
    name: "Communicating analysis and insight",
  },
  {
    name: "Communicating between the technical and non-technical",
    description:
      "Communicating between the technical and non-technical involves conveying information using the most effective medium and language for the audience.",
  },
  {
    name: "Communicating data",
  },
  {
    name: "Communicating information",
    description:
      "Communication involves conveying information using the most effective medium and language for the audience.",
  },
  {
    name: "Communication (data ethics)",
    description:
      "Communication involves conveying information using the most effective medium and language for the audience.",
  },
  {
    name: "Communication (security architect)",
    description:
      "Communication involves conveying information using the most effective medium and language for the audience.",
  },
  {
    name: "Community collaboration",
    description:
      "Collaboration in the Government Digital and Data profession typically involves working in a multidisciplinary project team, and contributing to working groups and wider professional communities. It requires a broad understanding of the technologies, principles and perspectives of related professions.",
  },
  {
    name: "Consultancy",
    description:
      "Consultancy involves providing specialist advice to address stakeholder and business needs.",
  },
  {
    name: "Content concepts and prototyping",
    description:
      "Prototyping a service or product involves exploring, testing and sharing different concepts before committing to the final design.",
  },
  {
    name: "Context, problem and option analysis",
    description:
      "Context, problem and option analysis involves holistically investigating the context for a piece of work to define the problem or opportunity, understand root causes, identify high level business and user needs and shape the work to address those needs.",
  },
  {
    name: "Continual service improvement",
  },
  {
    name: "Continuity management",
    description:
      "Continuity management involves clearly defining processes and remediation plans to ensure the availability of systems and services in the event of unplanned downtime.",
  },
  {
    name: "Creating value for money",
    description:
      "Creating value for money involves making the right choices for the right reasons, balancing return on investment and value for the user and the organisation.",
  },
  {
    name: "Customer service management",
    description:
      "Customer service management involves managing customer service functions, such as responding to issue reports, information and access requests.",
  },
  {
    name: "Cyber incident management",
  },
  {
    name: "Cyber risk management",
  },
  {
    name: "Cyber security governance",
  },
  {
    name: "Data analysis and synthesis",
    description:
      "Analysis and insight involves examining, interpreting and analysing data to help make informed decisions.",
  },
  {
    name: "Data architecture",
  },
  {
    name: "Data compliance and security",
    description:
      "Data compliance and security involves ensuring data handling practices at all stages of the data life cycle meet legal, regulatory, technical, ethical and organisation requirements to protect the data, data subjects and organisation.",
  },
  {
    name: "Data development process",
    description:
      "Data development process involves implementing data pipelines, products, services or platforms while ensuring they are secure, scalable, sustainable, reliable and meeting required standards.",
  },
  {
    name: "Data engineering",
    description:
      "Data engineering involves ensuring the correct systems are available to enable the collection, analysis and extrapolation of data.",
  },
  {
    name: "Data ethics and privacy",
    description:
      "Data ethics and privacy involves using data and emerging data techniques in compliance with ethical and legal obligations.",
  },
  {
    name: "Data governance",
    description:
      "Data governance involves the set of standards, processes and policies that ensures your data is consistent and reliable throughout the data life cycle.",
  },
  {
    name: "Data governance (data architect)",
    description:
      "Data governance involves the set of standards, processes and policies that ensures your data is consistent and reliable throughout the data life cycle.",
  },
  {
    name: "Data governance leadership",
  },
  {
    name: "Data innovation",
    description:
      "Keeping actively informed of industry developments to make creative and cost-effective use of emerging technologies and tools, aligned with business goals and user needs.",
  },
  {
    name: "Data integration design",
    description:
      "Data integration design involves designing systems, APIs and data models to enable secure and efficient interoperability across services.",
  },
  {
    name: "Data life cycle",
  },
  {
    name: "Data literacy improvement",
  },
  {
    name: "Data management",
    description:
      "Data management involves the application of data governance policies, including the tools, procedures and methods that manage data access, sharing, dissemination and protection.",
  },
  {
    name: "Data maturity",
    description:
      "Data maturity involves measuring how set up your organisation is to make the best use of its data.",
  },
  {
    name: "Data modelling",
    description:
      "Data modelling involves producing visual representations of information systems to communicate the relationship between different data types.",
  },
  {
    name: "Data modelling, cleansing and enrichment",
    description:
      "Data modelling involves producing visual representations of information systems to communicate the relationship between different data types.",
  },
  {
    name: "Data preparation and linkage",
    description:
      "Data preparation and linkage involves cleansing, modelling, transforming and assuring the quality of data so that it is usable and reproducible.",
  },
  {
    name: "Data risk management",
  },
  {
    name: "Data science innovation",
    description:
      "Data science involves examining data through statistical analysis and data mining, to identify patterns and uncover insights that can inform decision-making.",
  },
  {
    name: "Data standards",
    description:
      "Data standards involve established practices to make it easier and more effective to share and use data across government.",
  },
  {
    name: "Data visualisation",
    description:
      "Data visualisation involves translating business requirements into accessible data visualisations that communicate data, such as tables, charts and graphs.",
  },
  {
    name: "Defining and managing business needs, user needs and requirements",
    description:
      "Defining and managing business needs, user needs and requirements involves eliciting, analysing and validating and communicating needs effectively through appropriate actionable artefacts.",
  },
  {
    name: "Delivering business impact",
  },
  {
    name: "Delivering business impact through data",
    description:
      "Delivering business impact through data involves identifying the priorities of the organisation, recognising the contribution of data and making decisions with data to ensure you deliver business impact.",
  },
  {
    name: "Design communication",
    description:
      "Communication involves conveying information using the most effective medium and language for the audience.",
  },
  {
    name: "Designing and executing tests",
    description:
      "Designing and executing tests involves applying appropriate test types and techniques to create and run tests that align to user needs and requirements.",
  },
  {
    name: "Designing for everyone",
  },
  {
    name: "Designing secure systems",
  },
  {
    name: "Designing strategically",
    description:
      "Strategy involves creating a plan to achieve a team or organisation's objectives.",
  },
  {
    name: "Designing together",
  },
  {
    name: "Developing code for analysis",
    description:
      "Developing code for analysis involves designing, implementing and improving analytical approaches, manually or via an interface.",
  },
  {
    name: "Developing data science capability",
    description:
      "Training and capability improvement involves identifying and advocating ways to develop the skills, knowledge and performance of individuals or organisations.",
  },
  {
    name: "Development process optimisation",
    description:
      "Process optimisation involves ensuring your processes are accurately defined and capture the most efficient way to complete a task by monitoring modified procedures.",
  },
  {
    name: "Digital and data systems analysis",
    description:
      "Digital and data systems analysis involves structured examination of digital and data technologies and infrastructures to understand them enough to enable effective decision making.",
  },
  {
    name: "Empathy and inclusivity",
    description:
      "Inclusion involves including everyone to incorporate disparate views and requirements, whether developing products and services or internal policies.",
  },
  {
    name: "Enabling and informing risk-based decisions",
  },
  {
    name: "Ensuring resilience of digital, data and technology",
  },
  {
    name: "Enterprise and business architecture (business analyst)",
    description:
      "Enterprise architecture involves analysing how to achieve an organisation's objectives by designing and aligning its IT applications and technologies. Business architecture involves defining the business strategy, governance and most important processes of the organisation.",
  },
  {
    name: "Enterprise architecture",
    description:
      "Enterprise architecture involves analysing how to achieve an organisation's objectives by designing and aligning its IT applications and technologies.",
  },
  {
    name: "Evaluation delivery",
    description:
      "Evaluation delivery involves using data collection and analytical techniques to evaluate a digital product or service across the development cycle.",
  },
  {
    name: "Evaluation planning and strategy",
    description:
      "Evaluation planning and strategy involves working with stakeholders to develop plans for monitoring and evaluating products and services, and gaining support for effective evaluation.",
  },
  {
    name: "Evidence-based design",
  },
  {
    name: "Financial decision making for technology",
  },
  {
    name: "Financial management",
    description:
      "Financial management involves planning, organising and monitoring financial resources.",
  },
  {
    name: "Financial management for digital, data and technology",
  },
  {
    name: "Financial ownership",
    description:
      "Financial ownership involves securing funding and prioritising how it is spent to ensure quality and value for money.",
  },
  {
    name: "Governance and assurance",
    description:
      "Governance and assurance involves ensuring appropriate and proportionate governance and assurance is in place to support delivery.",
  },
  {
    name: "Governance and assurance (accessibility)",
    description:
      "Governance and assurance involves defining and ensuring adherence to an organisation's quality control and compliance processes.",
  },
  {
    name: "Incident management",
    description:
      "Incident management involves coordinating the response to incident reports, ensuring effective prioritisation, investigation and resolution.",
  },
  {
    name: "Inclusive research",
    description:
      "Inclusion involves including everyone to incorporate disparate views and requirements, whether developing products and services or internal policies.",
  },
  {
    name: "Information security",
    description:
      "Information security involves maintaining the security, confidentiality and integrity of information.",
  },
  {
    name: "Innovation in digital, data and technology",
  },
  {
    name: "Iterative design",
  },
  {
    name: "IT infrastructure",
    description:
      "IT infrastructure involves ensuring systems and processes are available, adaptable, reliable and secure.",
  },
  {
    name: "IT service reporting",
    description:
      "IT service reporting involves analysing data to understand how an IT product or service has performed against the Key Performance Indicators (KPIs).",
  },
  {
    name: "Leadership and guidance",
    description:
      "Leadership and guidance involves providing effective leadership and management through team motivation, decision making, risk management, mediation and professional development",
  },
  {
    name: "Leadership and guidance (frontend developer)",
    description:
      "Leadership and guidance involves providing effective leadership and management through team motivation, decision making, risk management, mediation and professional development",
  },
  {
    name: "Leading design",
    description:
      "Leadership and guidance involves providing effective leadership and management through team motivation, decision making, risk management, mediation and professional development.",
  },
  {
    name: "Leading digital products and services",
  },
  {
    name: "Leading performance and benefits",
    description:
      "Leading performance and benefits involves using appropriate measures, metrics, data and insights to ensure the delivery of valuable outcomes and business benefits.",
  },
  {
    name: "Life cycle management",
    description:
      "Life cycle management involves deciding what to do at different phases of the life cycle, including discovery, alpha, beta, live and retirement, and if it's the right time to move to a different phase.",
  },
  {
    name: "Maintaining delivery momentum",
    description:
      "Delivery management involves improving the speed and efficiency with which products and services are developed.",
  },
  {
    name: "Making and guiding decisions",
  },
  {
    name: "Making a process work",
    description:
      "Process optimisation involves ensuring your processes are accurately defined and capture the most efficient way to complete a task by monitoring modified procedures.",
  },
  {
    name: "Making architectural decisions",
  },
  {
    name: "Making strategic performance-led change",
  },
  {
    name: "Managing a data project",
    description:
      "Managing a data project involves understanding, planning and implementing the stages of a data project to solve a problem or design and improve a service.",
  },
  {
    name: "Managing decisions and risks",
  },
  {
    name: "Managing product outcomes",
    description:
      "Managing product outcomes involves working with teams to identify key performance indicators and developing methods to ensure that value is achieved through your product, linking to the product vision and strategic goals.",
  },
  {
    name: "Managing, reporting and resolving defects",
    description:
      "Managing, reporting and resolving defects involves reporting progress, outcomes and issues, whilst contributing to improving defect management processes.",
  },
  {
    name: "Metadata management",
    description:
      "Metadata management involves establishing policies and processes that ensure data can be accessed across an organisation.",
  },
  {
    name: "Methods and tools",
  },
  {
    name: "Modern development standards",
    description:
      "Modern development standards involves using the latest technologies and best practices to improve the quality of the software development process.",
  },
  {
    name: "Monitoring and evaluation across the product life cycle",
    description:
      "Monitoring and evaluation across the product life cycle involves effectively integrating evaluation activities into different stages of the delivery process.",
  },
  {
    name: "Operational management",
    description:
      "Operational management involves ensuring the operational processes of a product or service are effective and robust.",
  },
  {
    name: "Optimising technology and data architecture",
  },
  {
    name: "Ownership and initiative",
  },
  {
    name: "Performance measurement",
    description:
      "Performance measurement involves collecting and interpreting data to identify how a team, product or service is performing.",
  },
  {
    name: "Planning",
  },
  {
    name: "Problem definition and shaping",
  },
  {
    name: "Problem management",
    description:
      "Problem management involves anticipating and identifying problems in systems, processes or services, and ensuring appropriate solutions are implemented.",
  },
  {
    name: "Product and service monitoring",
    description:
      "Product and service monitoring involves developing a theory of change and measurement frameworks to understand effects of services on the user and the economy.",
  },
  {
    name: "Product leadership",
    description:
      "Product leadership involves advocating for product management, encouraging a user-focussed, product-led approach and contributing to a self-sustaining product community.",
  },
  {
    name: "Product management",
    description:
      "Product management involves making sure that products provide value and drive the right outcomes, whilst balancing user and business needs. This is achieved by working with other professions in your team to frame the problem and make decisions on priorities for your delivery teams.",
  },
  {
    name: "Product ownership (data ethics)",
  },
  {
    name: "Programming and build (data and analytics engineering)",
    description:
      "Programming and build (data analytics and engineering) involves working with code across the software development life cycle, following modern development standards and practices, test automation, build pipelines and repeatable deployment processes, to implement secure, maintainable software solutions.",
  },
  {
    name: "Programming and build (data science)",
  },
  {
    name: "Programming and build (frontend developer)",
  },
  {
    name: "Programming and build (software engineering)",
  },
  {
    name: "Prototyping",
    description:
      "Prototyping a service or product involves exploring, testing and sharing different concepts before committing to the final design.",
  },
  {
    name: "Quality assurance of data and analysis",
    description:
      "Quality assurance of data and analysis involves sorting and cleansing information so that any conclusions based on it can be made with confidence.",
  },
  {
    name: "Research and innovation",
    description:
      "Keeping actively informed of industry developments to make creative and cost-effective use of emerging technologies and tools, aligned with business goals and user needs.",
  },
  {
    name: "Research management, leadership and assurance",
    description:
      "Leadership and guidance involves providing effective leadership and management through team motivation, decision making, risk management, mediation and professional development",
  },
  {
    name: "Security architecture",
  },
  {
    name: "Security technology",
    description:
      "Security technology involves understanding security architectures and identifying vulnerabilities to prevent and respond to cyber breaches.",
  },
  {
    name: "Service focus",
    description:
      "Service focus involves overseeing the whole service life cycle, including the design, development, deployment and operation of a service.",
  },
  {
    name: "Service management framework knowledge",
    description:
      "IT service management involves identifying, prioritising and implementing IT services, ensuring the organisation gets maximum value for money.",
  },
  {
    name: "Service support",
    description:
      "Service support involves fixing service faults and maintaining the underlying infrastructure, ensuring processes are in place to keep the service running efficiently.",
  },
  {
    name: "Shaping the direction of organisational strategy through digital, data and technology",
  },
  {
    name: "Stakeholder relationship management",
    description:
      "Stakeholder relationship management involves building trust, managing stakeholder expectations and communications, and remaining focused on user needs.",
  },
  {
    name: "Stakeholder relationship management (content design)",
    description:
      "Stakeholder relationship management involves managing stakeholder requirements and communications throughout a project, while remaining focused on the user needs.",
  },
  {
    name: "Stakeholder relationship management (IT operations)",
    description:
      "Stakeholder relationship management involves managing stakeholder requirements and communications throughout a project, while remaining focused on the user needs.",
  },
  {
    name: "Strategic cyber security planning",
  },
  {
    name: "Strategic data planning",
  },
  {
    name: "Strategic design and business change",
    description:
      "Strategy involves creating a plan to achieve a team or organisation's objectives.",
  },
  {
    name: "Strategic ownership",
    description:
      "Strategic ownership involves thinking holistically, and creating and owning an end to end plan to achieve set objectives.",
  },
  {
    name: "Strategic technology planning",
  },
  {
    name: "Strategic thinking",
    description:
      "Strategic thinking involves creating a plan to achieve a team or organisation's objectives.",
  },
  {
    name: "Strategic thinking (content design)",
    description:
      "Strategy involves creating a plan to achieve a team or organisation's objectives.",
  },
  {
    name: "Strategy design",
    description:
      "Strategy involves creating a plan to achieve a team or organisation's objectives.",
  },
  {
    name: "Systems design",
    description:
      "Systems design involves creating the specification and design of systems to meet defined business needs.",
  },
  {
    name: "Systems design (frontend developer)",
  },
  {
    name: "Systems integration",
    description:
      "Systems integration involves identifying points of connection between different systems and processes, or opportunities to combine them, and designing how the components communicate.",
  },
  {
    name: "Systems integration (frontend developer)",
  },
  {
    name: "Team dynamics and collaboration",
  },
  {
    name: "Technical design throughout the life cycle",
  },
  {
    name: "Technical specialism",
  },
  {
    name: "Technical understanding",
  },
  {
    name: "Technical understanding (accessibility)",
    description:
      "Accessibility involves ensuring your service can be used by as many people as possible, including those with impaired vision, motor difficulties, cognitive impairments, learning disabilities and deafness.",
  },
  {
    name: "Technical understanding (performance analyst)",
    description:
      "Performance measurement involves collecting and interpreting data to identify how a team, product or service is performing.",
  },
  {
    name: "Technical understanding (user-centred design)",
  },
  {
    name: "Technology architecture",
  },
  {
    name: "Technology evaluation",
  },
  {
    name: "Test analysis",
    description:
      "Test analysis involves analysing information, such as requirements, user stories, designs and specifications, to identify and understand how to act on quality risks.",
  },
  {
    name: "Test and quality planning",
    description:
      "Test and quality planning involves creating, following and adapting quality testing activities to ensure the quality of products, services and programmes.",
  },
  {
    name: "Test engineering",
    description:
      "Test engineering involves developing test automation solutions that enable fast feedback on quality characteristics.",
  },
  {
    name: "Testing",
    description:
      "Testing involves ensuring that requirements have been fully met by using appropriate tools and techniques to verify that a product or service works.",
  },
  {
    name: "Testing (business analysis)",
    description:
      "Testing involves ensuring that requirements have been fully met by using appropriate tools and techniques to verify that a product or service works.",
  },
  {
    name: "Troubleshooting and problem resolution",
  },
  {
    name: "Turning business problems into data design",
  },
  {
    name: "Understanding analysis across the product life cycle",
  },
  {
    name: "Understanding product delivery",
    description:
      "Product delivery involves ensuring that a product or service is developed in a timely and cost-effective way, meeting the user needs.",
  },
  {
    name: "Understanding security implications of transformation",
    description:
      "Security management involves identifying and protecting an organisation's assets (systems, people and buildings).",
  },
  {
    name: "User-centred analysis",
  },
  {
    name: "User-centred content design",
    description:
      "User-centred content design involves focusing on user needs through an evidence-based and iterative design process, to ensure content is easy to use and understand.",
  },
  {
    name: "User-centred practice and advocacy",
    description:
      "User focus involves understanding the user needs to develop a detailed understanding of the problems that need to be solved.",
  },
  {
    name: "User experience analysis",
  },
  {
    name: "User focus",
    description:
      "User focus involves understanding the user needs to develop a detailed understanding of the problems that need to be solved.",
  },
  {
    name: "User focus (content design)",
    description:
      "User focus involves understanding the user needs to develop a detailed understanding of the problems that need to be solved.",
  },
  {
    name: "User focus (frontend developer)",
    description:
      "User focus involves understanding the user needs to develop a detailed understanding of the problems that need to be solved.",
  },
  {
    name: "User research methods",
    description:
      "User research involves methods to identify user needs and understand how users interact with a product or service.",
  },
  {
    name: "Web performance optimisation",
    description:
      "Web performance optimisation involves improving the efficiency and speed with which web pages load in a browser.",
  },
  {
    name: "Working within constraints (performance analyst)",
  },
];

export type SfiaNineSkillFixture = {
  name: string;
  description?: string;
  code: string;
  min_level?: number;
  max_level: number;
};

export const sfiaNineSkills: SfiaNineSkillFixture[] = [
  {
    code: "ACIN",
    name: "Accessibility and inclusion",
    description:
      "Driving accessibility and inclusion in services and products.",
    max_level: 6,
  },
  {
    code: "ANCC",
    name: "Analytical classification and coding",
    description:
      "Interpreting information and assigning classifications or labels based on domain-specific knowledge, standards and guidelines to enable data analysis and use.",
    max_level: 6,
  },
  {
    code: "ADEV",
    name: "Animation development",
    description:
      "Designing and developing animated and interactive systems such as games, simulations and virtual environments.",
    min_level: 2,
    max_level: 6,
  },
  {
    code: "ASUP",
    name: "Application support",
    description:
      "Delivering management, technical and administrative services to support and maintain live applications.",
    max_level: 5,
  },
  {
    code: "AIDE",
    name: "Artificial intelligence (AI) and data ethics",
    description:
      "Implementing and promoting ethical practices in the design, development, deployment and use of AI and data technologies.",
    min_level: 3,
    max_level: 6,
  },
  {
    code: "ASMG",
    name: "Asset management",
    description:
      "Managing the full lifecycle of assets from acquisition, operation, maintenance to disposal.",
    max_level: 6,
  },
  {
    code: "AUDT",
    name: "Audit",
    description:
      "Delivering independent, risk-based assessments of the effectiveness of processes, the controls and the compliance environment of an organisation.",
    max_level: 7,
  },
  {
    code: "AVMT",
    name: "Availability management",
    description:
      "Ensuring services deliver agreed levels of availability to meet the current and future needs of the business.",
    min_level: 3,
    max_level: 6,
  },
  {
    code: "BENM",
    name: "Benefits management",
    description:
      "Forecasting, planning and monitoring the emergence and effective realisation of anticipated benefits from projects and programmes.",
    min_level: 3,
    max_level: 6,
  },
  {
    code: "BIDM",
    name: "Bid/proposal management",
    description:
      "Managing preparation and submission of bids and proposals for contracts, grants, projects, or services.",
    min_level: 3,
    max_level: 6,
  },
  {
    code: "BRMG",
    name: "Brand management",
    description:
      "Managing brand strategy to establish and enhance brand identity and value aligned with organisational goals.",
    min_level: 4,
    max_level: 6,
  },
  {
    code: "BUDF",
    name: "Budgeting and forecasting",
    description:
      "Developing and managing financial budgets and forecasts to enable effective decision-making and resource allocation.",
    max_level: 6,
  },
  {
    code: "ADMN",
    name: "Business administration",
    description:
      "Managing and performing administrative services and tasks to enable individuals, teams and organisations to succeed in their objectives.",
    min_level: 1,
    max_level: 6,
  },
  {
    code: "BINT",
    name: "Business intelligence",
    description:
      "Developing, producing and delivering regular and one-off management information to provide insights and aid decision-making.",
    max_level: 5,
  },
  {
    code: "BSMO",
    name: "Business modelling",
    description:
      "Creating abstract or distilled models of business scenarios, representing processes, data and roles to support decision-making and analysis.",
    max_level: 6,
  },
  {
    code: "BPRE",
    name: "Business process improvement",
    description:
      "Creating new and potentially disruptive approaches to performing business activities.",
    max_level: 7,
  },
  {
    code: "BUSA",
    name: "Business situation analysis",
    description:
      "Investigating business situations to define recommendations for improvement action.",
    max_level: 6,
  },
  {
    code: "CPMG",
    name: "Capacity management",
    description:
      "Ensuring service components have the capacity and performance to meet current and planned business needs.",
    max_level: 6,
  },
  {
    code: "CSOP",
    name: "Certification scheme operation",
    description:
      "Designing, developing and operating certification schemes, accreditations and credentials, including digital credentials or badges.",
    max_level: 6,
  },
  {
    code: "CHMG",
    name: "Change control",
    description:
      "Assessing risks associated with proposed changes and ensuring changes to products, services or systems are controlled and coordinated.",
    max_level: 6,
  },
  {
    code: "LEDA",
    name: "Competency assessment",
    description:
      "Assessing knowledge, skills, competency and behaviours by any means, whether formal or informal, against frameworks such as SFIA.",
    max_level: 6,
  },
  {
    code: "CFMG",
    name: "",
    description:
      "Planning, identifying, controlling, accounting for and auditing of configuration items (CIs) and their interrelationships.",
    max_level: 6,
  },
  {
    code: "CNSL",
    name: "Consultancy",
    description:
      "Providing advice and recommendations, based on expertise and experience, to address client needs.",
    min_level: 4,
    max_level: 7,
  },
  {
    code: "INCA",
    name: "Content design and authoring",
    description:
      "Planning, designing and creating content that meets user-centred and organisational needs, encompassing textual information, graphical content and multimedia elements.",
    min_level: 1,
    max_level: 6,
  },
  {
    code: "ICPM",
    name: "Content publishing",
    description:
      "Managing processes to collect, assemble and publish content across various channels to meet organisational and audience needs.",
    min_level: 1,
    max_level: 6,
  },
  {
    code: "COPL",
    name: "Continuity management",
    description:
      "Developing, implementing and testing a business continuity framework.",
    max_level: 6,
  },
  {
    code: "ITCM",
    name: "Contract management",
    description:
      "Managing and operating formal contracts, addressing supplier and client needs in product and service provision.",
    max_level: 7,
  },
  {
    code: "COMG",
    name: "Cost management",
    description:
      "Planning, controlling and analysing costs to enable the effective use of financial resources.",
    max_level: 6,
  },
  {
    code: "CELO",
    name: "Customer engagement and loyalty",
    description:
      "Developing and executing strategies to attract, engage and retain customers through targeted communications and loyalty initiatives.",
    min_level: 3,
    max_level: 6,
  },
  {
    code: "CEXP",
    name: "Customer experience",
    description:
      "Ensuring the delivery of high-quality interactions and experiences that meet customer expectations across all touchpoints and channels.",
    max_level: 6,
  },
  {
    code: "CSMG",
    name: "Customer service support",
    description:
      "Managing and operating customer service or service desk functions.",
    min_level: 1,
    max_level: 6,
  },
  {
    code: "CRIM",
    name: "Cybercrime investigation",
    description:
      "Investigates cybercrimes, collects evidence, determines incident impacts and collaborates with legal teams to protect digital assets.",
    max_level: 6,
  },
  {
    code: "DAAN",
    name: "Data analytics",
    description:
      "Enabling data-driven decision making by extracting, analysing and communicating insights from structured and unstructured data.",
    max_level: 7,
  },
  {
    code: "DENG",
    name: "Data engineering",
    description:
      "Designing, building, operationalising, securing and monitoring data pipelines, stores and real-time processing systems for scalable and reliable data management.",
    max_level: 6,
  },
  {
    code: "DATM",
    name: "Data management",
    description:
      "Developing and implementing plans, policies and practices that control, protect and optimise the value and governance of data assets.",
    max_level: 6,
  },
  {
    code: "DTAN",
    name: "Data modelling and design",
    description:
      "Developing models and diagrams to represent, communicate and manage data requirements and data assets.",
    max_level: 5,
  },
  {
    code: "DATS",
    name: "Data science",
    description:
      "Applying mathematics, statistics, data mining and predictive modelling techniques to gain insights, predict behaviours and generate value from data.",
    max_level: 6,
  },
  {
    code: "VISL",
    name: "Data visualisation",
    description:
      "Facilitating understanding of data by displaying concepts, ideas and facts using graphical representations.",
    max_level: 5,
  },
  {
    code: "DBAD",
    name: "Database administration",
    description:
      "Installing, configuring, monitoring, maintaining databases and data stores, ensuring performance and security and adapting to evolving technologies.",
    max_level: 5,
  },
  {
    code: "DBDS",
    name: "Database design",
    description:
      "Specifying, designing and maintaining mechanisms for storing and accessing data across various environments and platforms.",
    max_level: 5,
  },
  {
    code: "DEMG",
    name: "Delivery management",
    description:
      "Ensuring successful delivery of new or updated products and services through effective leadership and collaboration within defined delivery cycles.",
    min_level: 3,
    max_level: 6,
  },
  {
    code: "DEMM",
    name: "Demand management",
    description:
      "Analysing and proactively managing business demand for new services or modifications to existing service features or volumes.",
    min_level: 4,
    max_level: 6,
  },
  {
    code: "DEPL",
    name: "Deployment",
    description:
      "Transitioning software from development to live usage, managing risks and ensuring it works as intended.",
    max_level: 6,
  },
  {
    code: "DGFS",
    name: "Digital forensics",
    description:
      "Recovering and investigating material found in digital devices.",
    max_level: 6,
  },
  {
    code: "DIGM",
    name: "Digital marketing",
    description:
      "Planning and executing activities to promote products, services and brands through digital channels and technologies.",
    max_level: 5,
  },
  {
    code: "EMRG",
    name: "Emerging technology monitoring",
    description:
      "Identifying and assessing new and emerging technologies, products, services, methods and techniques.",
    min_level: 4,
    max_level: 6,
  },
  {
    code: "EEXP",
    name: "Employee experience",
    description:
      "Enhancing employee engagement and ways of working, empowering employees and supporting their health and wellbeing.",
    min_level: 4,
    max_level: 6,
  },
  {
    code: "STPL",
    name: "Enterprise and business architecture",
    description:
      "Aligning an organisation's technology strategy with its business mission, strategy and processes and documenting this using architectural models.",
    min_level: 5,
    max_level: 7,
  },
  {
    code: "DCMA",
    name: "Facilities management",
    description:
      "Planning, designing and managing the buildings, space and facilities which, collectively, make up the IT estate.",
    max_level: 6,
  },
  {
    code: "FEAS",
    name: "Feasibility assessment",
    description:
      "Defining, evaluating and describing business change options for financial, technical and business feasibility and strategic alignment.",
    max_level: 6,
  },
  {
    code: "FIAN",
    name: "Financial analysis",
    description:
      "Conducting in-depth analysis of financial data to derive insights and support decision-making.",
    max_level: 6,
  },
  {
    code: "FMIT",
    name: "Financial management",
    description:
      "Managing the effective use and control of financial resources to support business strategies, compliance and risk mitigation.",
    min_level: 4,
    max_level: 6,
  },
  {
    code: "RSCH",
    name: "Formal research",
    description:
      "Systematically creating new knowledge by data gathering, innovation, experimentation, evaluation and dissemination.",
    max_level: 6,
  },
  {
    code: "TEST",
    name: "Functional testing",
    description:
      "Assessing specified or unspecified functional requirements and characteristics of products, systems and services through investigation and testing.",
    min_level: 1,
    max_level: 6,
  },
  {
    code: "GOVN",
    name: "Governance",
    description:
      "Defining and operating frameworks for decision-making, risk management, stakeholder relationships and compliance with organisational and regulatory obligations.",
    min_level: 6,
    max_level: 7,
  },
  {
    code: "GRDN",
    name: "Graphic design",
    description:
      "Creating and applying visual concepts to communicate ideas, enhance aesthetics and improve user experience across digital and print media.",
    min_level: 1,
    max_level: 5,
  },
  {
    code: "HWDE",
    name: "Hardware design",
    description:
      "Specifying and designing hardware systems and components to meet defined requirements by following agreed design principles and standards.",
    max_level: 6,
  },
  {
    code: "HPCC",
    name: "High-performance computing",
    description:
      "Using advanced computer systems and special programming techniques to solve complex computational problems.",
    min_level: 4,
    max_level: 7,
  },
  {
    code: "IAMT",
    name: "Identity and access management",
    description:
      "Manages identity verification and access permissions within organisational systems and environments.",
    min_level: 1,
    max_level: 6,
  },
  {
    code: "USUP",
    name: "Incident management",
    description:
      "Coordinating responses to a diverse range of incidents to minimise negative impacts and quickly restore services.",
    min_level: 1,
    max_level: 6,
  },
  {
    code: "PEDP",
    name: "Information and data compliance",
    description:
      "Implementing and promoting compliance with information and data management legislation.",
    min_level: 4,
    max_level: 6,
  },
  {
    code: "INAS",
    name: "Information assurance",
    description:
      "Protecting against and managing risks related to the use, storage and transmission of data and information systems.",
    max_level: 7,
  },
  {
    code: "IRMG",
    name: "Information management",
    description:
      "Enabling the effective management and use of information assets.",
    min_level: 3,
    max_level: 7,
  },
  {
    code: "SCTY",
    name: "Information security",
    description:
      "Defining and operating a framework of security controls and security management strategies.",
    max_level: 7,
  },
  {
    code: "ISCO",
    name: "Information systems coordination",
    description:
      "Coordinating information and technology strategies where the adoption of a common approach would benefit the organisation.",
    min_level: 6,
    max_level: 7,
  },
  {
    code: "IFDN",
    name: "Infrastructure design",
    description:
      "Designing technology infrastructure to meet business requirements, ensuring scalability, reliability, security and alignment with strategic objectives.",
    max_level: 6,
  },
  {
    code: "ITOP",
    name: "Infrastructure operations",
    description:
      "Provisioning, deploying, configuring, operating and optimising technology infrastructure across physical, virtual and cloud-based environments.",
    min_level: 1,
    max_level: 5,
  },
  {
    code: "INOV",
    name: "Innovation management",
    description:
      "Identifying, prioritising, incubating and exploiting opportunities provided by information, communication and digital technologies.",
    min_level: 5,
    max_level: 7,
  },
  {
    code: "INVA",
    name: "Investment appraisal",
    description:
      "Assessing the attractiveness of possible investments or projects.",
    min_level: 4,
    max_level: 6,
  },
  {
    code: "JADN",
    name: "Job analysis and design",
    description:
      "Planning, analysing and designing job roles and structures to align with organisational requirements, goals and culture.",
    min_level: 3,
    max_level: 5,
  },
  {
    code: "KNOW",
    name: "Knowledge management",
    description:
      "Systematically capturing, developing and leveraging vital knowledge to create value and enhance organisational performance.",
    max_level: 7,
  },
  {
    code: "ETMG",
    name: "Learning and development management",
    description:
      "Delivering management, advisory and administrative services to support the development of knowledge, skills and competencies.",
    max_level: 7,
  },
  {
    code: "ETDL",
    name: "Learning delivery",
    description:
      "Transferring knowledge, developing skills and changing behaviours using a range of techniques, resources and media.",
    max_level: 5,
  },
  {
    code: "TMCR",
    name: "Learning design and development",
    description:
      "Designing and developing resources to transfer knowledge, develop skills and change behaviours.",
    max_level: 5,
  },
  {
    code: "MLNG",
    name: "Machine learning",
    description:
      "Developing systems that learn from data and experience, improving performance, accuracy and adaptability in dynamic environments.",
    max_level: 6,
  },
  {
    code: "MRCH",
    name: "Market research",
    description:
      "Gathering, analysing and interpreting data about markets, customers and competitors to inform business decisions and strategies.",
    min_level: 3,
    max_level: 6,
  },
  {
    code: "MKCM",
    name: "Marketing campaign management",
    description:
      "Executing, monitoring and optimising marketing campaigns across various channels to engage target audiences and achieve desired outcomes.",
    min_level: 3,
    max_level: 5,
  },
  {
    code: "MKTG",
    name: "Marketing management",
    description:
      "Developing, implementing and managing marketing strategies and plans to achieve organisational objectives and drive business growth.",
    min_level: 4,
    max_level: 7,
  },
  {
    code: "MEAS",
    name: "Measurement",
    description:
      "Developing and operating a measurement capability to support agreed organisational information needs.",
    max_level: 6,
  },
  {
    code: "METL",
    name: "Methods and tools",
    description:
      "Leads the adoption, management and optimisation of methods and tools, ensuring effective use and alignment with organisational objectives.",
    max_level: 6,
  },
  {
    code: "NTDS",
    name: "Network design",
    description:
      "Designing communication networks to meet business requirements, ensuring scalability, reliability, security and alignment with strategic objectives.",
    max_level: 6,
  },
  {
    code: "NTAS",
    name: "Network support",
    description:
      "Providing maintenance and support services for communications networks.",
    min_level: 1,
    max_level: 5,
  },
  {
    code: "NFTS",
    name: "Non-functional testing",
    description:
      "Assessing systems and services to evaluate performance, security, scalability and other non-functional qualities against requirements or expected standards.",
    min_level: 1,
    max_level: 6,
  },
  {
    code: "NUAN",
    name: "Numerical analysis",
    description:
      "Creating, analysing, implementing, testing and improving algorithms for numerically solving mathematical problems.",
    min_level: 4,
    max_level: 7,
  },
  {
    code: "OCOP",
    name: "Offensive cyber operations",
    description:
      "Plans, executes and manages offensive cybersecurity operations, including target selection, electronic target folders and post-operation analysis.",
    max_level: 6,
  },
  {
    code: "ORDI",
    name: "Organisation design and implementation",
    description:
      "Planning, designing and implementing an integrated organisation structure and culture.",
    min_level: 3,
    max_level: 7,
  },
  {
    code: "OCDV",
    name: "Organisational capability development",
    description:
      "Providing leadership, advice and implementation support to assess organisational capabilities and to identify, prioritise and implement improvements.",
    min_level: 5,
    max_level: 7,
  },
  {
    code: "OCEN",
    name: "Organisational change enablement",
    description:
      "Facilitates cultural and behavioural change by enabling individuals and teams to embed new ways of working and adapt to changes.",
    min_level: 4,
    max_level: 6,
  },
  {
    code: "CIPM",
    name: "Organisational change management",
    description:
      "Planning, designing and implementing activities to transition the organisation and people to the required future state.",
    max_level: 6,
  },
  {
    code: "OFCL",
    name: "Organisational facilitation",
    description:
      "Supporting workgroups to implement principles and practices for effective teamwork across organisational boundaries and professional specialisms.",
    min_level: 4,
    max_level: 6,
  },
  {
    code: "PENT",
    name: "Penetration testing",
    description:
      "Testing the effectiveness of security controls by emulating the tools and techniques of likely attackers.",
    max_level: 6,
  },
  {
    code: "PEMT",
    name: "Performance management",
    description:
      "Improving organisational performance by developing the performance of individuals and workgroups to meet agreed objectives with measurable results.",
    min_level: 4,
    max_level: 6,
  },
  {
    code: "POMG",
    name: "Portfolio management",
    description:
      "Developing and applying a management framework to define and deliver a portfolio of programmes, projects and/or ongoing services.",
    min_level: 5,
    max_level: 7,
  },
  {
    code: "PROF",
    name: "Portfolio, programme and project support",
    description:
      "Providing support and guidance on portfolio, programme and project management processes, procedures, tools and techniques.",
    max_level: 6,
  },
  {
    code: "PBMG",
    name: "Problem management",
    description:
      "Managing the lifecycle of all problems that have occurred or could occur in delivering a service.",
    max_level: 5,
  },
  {
    code: "PRTS",
    name: "Process testing",
    description:
      "Assessing documented and undocumented process flows within a product, system or service against business needs through investigation and testing.",
    min_level: 1,
    max_level: 6,
  },
  {
    code: "PROD",
    name: "Product management",
    description:
      "Managing and developing products or services throughout their full lifecycle, from inception through growth, maturity, and decline, to retirement.",
    max_level: 6,
  },
  {
    code: "PDSV",
    name: "Professional development",
    description:
      "Facilitating the professional development of individuals in line with their career goals and organisational requirements.",
    min_level: 4,
    max_level: 6,
  },
  {
    code: "PGMG",
    name: "Programme management",
    description:
      "Identifying, planning and coordinating a set of related projects and activities in support of specific business strategies and objectives.",
    min_level: 6,
    max_level: 7,
  },
  {
    code: "PROG",
    name: "Programming/software development",
    description:
      "Developing software components to deliver value to stakeholders.",
    max_level: 6,
  },
  {
    code: "PRMG",
    name: "Project management",
    description:
      "Delivering agreed project outcomes by aligning appropriate management techniques, collaboration, leadership and governance to specific project and organisational contexts.",
    min_level: 4,
    max_level: 7,
  },
  {
    code: "QUAS",
    name: "Quality assurance",
    description:
      "Assuring, through ongoing and periodic assessments and reviews, that the organisation's quality objectives are being met.",
    max_level: 6,
  },
  {
    code: "QUMG",
    name: "Quality management",
    description:
      "Defining and operating a management framework of processes and working practices to deliver the organisation's quality objectives.",
    max_level: 7,
  },
  {
    code: "RFEN",
    name: "Radio frequency engineering",
    description:
      "Designing, installing and maintaining radio frequency based devices and software.",
    max_level: 6,
  },
  {
    code: "RESD",
    name: "Real-time/embedded systems development",
    description:
      "Designing and developing reliable real-time software typically within embedded systems.",
    max_level: 6,
  },
  {
    code: "RMGT",
    name: "Records management",
    description:
      "Planning, implementing and managing the full lifecycle of organisational records.",
    min_level: 1,
    max_level: 5,
  },
  {
    code: "RELM",
    name: "Release management",
    description:
      "Managing the release of new and updated services into production, ensuring alignment with business objectives and compliance standards.",
    max_level: 6,
  },
  {
    code: "REQM",
    name: "Requirements definition and management",
    description:
      "Managing requirements through the entire delivery and operational lifecycle.",
    max_level: 6,
  },
  {
    code: "RESC",
    name: "Resourcing",
    description: "Acquiring, deploying and onboarding resources.",
    max_level: 6,
  },
  {
    code: "BURM",
    name: "Risk management",
    description:
      "Planning and implementing processes for managing risk across the enterprise, aligned with organisational strategy and governance frameworks.",
    max_level: 7,
  },
  {
    code: "SFAS",
    name: "Safety assessment",
    description:
      "Assessing safety-related software and hardware systems to determine compliance with standards and required levels of safety integrity.",
    min_level: 4,
    max_level: 6,
  },
  {
    code: "SFEN",
    name: "Safety engineering",
    description:
      "Applying appropriate methods to assure safety during all lifecycle phases of safety-related systems developments.",
    max_level: 6,
  },
  {
    code: "SSUP",
    name: "Sales support",
    description:
      "Providing advice and support to the sales force, customers and sales partners.",
    min_level: 1,
    max_level: 6,
  },
  {
    code: "SCMO",
    name: "Scientific modelling",
    description:
      "Applying computer simulation and other forms of computation to solve real-world problems in scientific disciplines.",
    min_level: 4,
    max_level: 7,
  },
  {
    code: "SCAD",
    name: "Security operations",
    description:
      "Manages and administers security measures, using tools and intelligence to protect assets, ensuring compliance and operational integrity.",
    min_level: 1,
    max_level: 6,
  },
  {
    code: "SALE",
    name: "Selling",
    description:
      "Finding prospective customers and working with them to identify needs, influence purchase decisions and enhance future business opportunities.",
    min_level: 3,
    max_level: 6,
  },
  {
    code: "SEAC",
    name: "Service acceptance",
    description:
      "Managing the process to obtain formal confirmation that service acceptance criteria have been met.",
    min_level: 3,
    max_level: 6,
  },
  {
    code: "SCMG",
    name: "Service catalogue management",
    description:
      "Providing a source of consistent information about available services and products to customers and users.",
    max_level: 5,
  },
  {
    code: "SLMO",
    name: "Service level management",
    description:
      "Agreeing targets for service levels and assessing, monitoring and managing the delivery of services against the targets.",
    max_level: 7,
  },
  {
    code: "PORT",
    name: "Software configuration",
    description:
      "Designing and deploying software product configurations into software environments or platforms.",
    max_level: 6,
  },
  {
    code: "SWDN",
    name: "Software design",
    description:
      "Architecting and designing software to meet specified requirements, ensuring adherence to established standards and principles.",
    max_level: 6,
  },
  {
    code: "ARCH",
    name: "Solution architecture",
    description:
      "Developing and communicating a multi-dimensional solution architecture to deliver agreed business outcomes.",
    min_level: 4,
    max_level: 6,
  },
  {
    code: "SORC",
    name: "Sourcing",
    description:
      "Managing, or providing advice on, the procurement or commissioning of products and services.",
    max_level: 7,
  },
  {
    code: "TECH",
    name: "Specialist advice",
    description:
      "Providing authoritative, professional advice and direction in a specialist area.",
    min_level: 4,
    max_level: 6,
  },
  {
    code: "RLMT",
    name: "Stakeholder relationship management",
    description:
      "Systematically analysing, managing and influencing stakeholder relationships to achieve mutually beneficial outcomes through structured engagement.",
    min_level: 4,
    max_level: 7,
  },
  {
    code: "STMG",
    name: "Storage management",
    description:
      "Provisioning, configuring and optimising on-premises and cloud-based storage solutions, ensuring data availability, security and alignment with business objectives.",
    max_level: 6,
  },
  {
    code: "ITSP",
    name: "Strategic planning",
    description:
      "Creating and maintaining organisational-level strategies to align overall business plans, actions and resources with high-level business objectives.",
    min_level: 4,
    max_level: 7,
  },
  {
    code: "SUBF",
    name: "Subject formation",
    description:
      "Specifying, designing and developing curricula within a structured and systematic education environment.",
    min_level: 4,
    max_level: 7,
  },
  {
    code: "SUPP",
    name: "Supplier management",
    description:
      "Aligning the organisation's supplier performance objectives and activities with sourcing strategies and plans, balancing costs, efficiencies and service quality.",
    min_level: 2,
    max_level: 7,
  },
  {
    code: "SUST",
    name: "Sustainability",
    description:
      "Advising and leading sustainability initiatives to reduce environmental impact and ensure compliance with relevant standards and regulations.",
    min_level: 4,
    max_level: 6,
  },
  {
    code: "SYSP",
    name: "System software administration",
    description:
      "Installing, managing and maintaining operating systems, data management, office automation and utility software across various infrastructure environments.",
    max_level: 5,
  },
  {
    code: "SLEN",
    name: "Systems and software lifecycle engineering",
    description:
      "Establishing and deploying an environment for developing, continually improving and securely operating software and systems products and services.",
    min_level: 3,
    max_level: 7,
  },
  {
    code: "DESN",
    name: "Systems design",
    description:
      "Designing systems to meet specified requirements and agreed systems architectures.",
    min_level: 2,
    max_level: 6,
  },
  {
    code: "DLMG",
    name: "Systems development management",
    description:
      "Planning, estimating and executing systems development work to time, budget and quality targets.",
    min_level: 4,
    max_level: 7,
  },
  {
    code: "HSIN",
    name: "Systems installation and removal",
    description:
      "Installing and testing, or decommissioning and removing, systems or system components.",
    min_level: 1,
    max_level: 6,
  },
  {
    code: "SINT",
    name: "Systems integration and build",
    description:
      "Planning, implementing and controlling activities to integrate system elements, subsystems and interfaces to create operational systems, products or services.",
    max_level: 6,
  },
  {
    code: "TEAC",
    name: "Teaching",
    description:
      "Delivering and assessing curricula in a structured and systematic education environment.",
    max_level: 7,
  },
  {
    code: "ITMG",
    name: "Technology service management",
    description:
      "Managing the provision of technology-based services to meet defined organisational needs.",
    min_level: 5,
    max_level: 7,
  },
  {
    code: "THIN",
    name: "Threat intelligence",
    description:
      "Developing and sharing actionable insights on current and potential security threats to the success or integrity of an organisation.",
    max_level: 6,
  },
  {
    code: "BPTS",
    name: "User acceptance testing",
    description:
      "Validating systems, products, business processes or services to determine whether the acceptance criteria have been satisfied.",
    max_level: 6,
  },
  {
    code: "UNAN",
    name: "User experience analysis",
    description:
      "Understanding the context of use for systems, products and services and specifying user experience requirements and design goals.",
    max_level: 5,
  },
  {
    code: "HCEV",
    name: "User experience design",
    description:
      "Producing design concepts and prototypes for user interactions and experiences of a product, system or service.",
    max_level: 6,
  },
  {
    code: "USEV",
    name: "User experience evaluation",
    description:
      "Validating systems, products or services against user experience goals, metrics and targets.",
    max_level: 6,
  },
  {
    code: "URCH",
    name: "User research",
    description:
      "Identifying users' behaviours, needs and motivations using observational research methods.",
    max_level: 6,
  },
  {
    code: "VUAS",
    name: "Vulnerability assessment",
    description:
      "Identifying and classifying security vulnerabilities in networks, systems and applications and mitigating or eliminating their impact.",
    max_level: 5,
  },
  {
    code: "VURE",
    name: "Vulnerability research",
    description:
      "Conducting applied research to discover, evaluate and mitigate new or unknown security vulnerabilities and weaknesses.",
    max_level: 6,
  },
  {
    code: "WFPL",
    name: "Workforce planning",
    description:
      "Strategically projecting the demand for people and skills and proactively planning the workforce supply to meet organisational needs.",
    min_level: 4,
    max_level: 6,
  },
];

export const roleFamilyDefinitions: Array<{
  name: string;
  description: string;
  referenceDdatRole?: string;
}> = [
  {
    name: "Cloud Engineer",
    description:
      "A Cloud Engineer is responsible for any technological duties associated with cloud computing, including design, planning, management, maintenance and support of cloud systems and services.",
    referenceDdatRole: "Infrastructure engineer",
  },
  { name: "Talent Acquisition Specialist", description: "" },
  {
    name: "Software Developer",
    description:
      "A software developer designs, runs and improves software that meets user needs.",
    referenceDdatRole: "Software developer",
  },
  {
    name: "IT Support",
    description: "",
    referenceDdatRole: "End user computing engineer",
  },
  {
    name: "PMO",
    description: "",
    referenceDdatRole: "Programme delivery manager",
  },
  {
    name: "Test Engineer",
    description:
      "A test engineer designs, builds, automates and executes comprehensive, robust and maintainable test suites. They apply test engineering standards, perform exploratory testing and use diverse techniques to identify risks and improve testing efficiency and quality.",
    referenceDdatRole: "Test engineer",
  },
  {
    name: "Data Scientist",
    description:
      "Data science is a broad and fast-moving field spanning maths, statistics, software engineering and communications. Data scientists will often work as part of a multidisciplinary team, using data and analytics to inform and achieve organisational goals.",
    referenceDdatRole: "Data scientist",
  },
  {
    name: "Agile Delivery Manager",
    description:
      "A delivery manager is accountable for the delivery of products and services.",
    referenceDdatRole: "Delivery manager",
  },
  {
    name: "Solution Architect",
    description:
      "A solution architect designs solutions for problems that affect the organisation.",
    referenceDdatRole: "Solution architect",
  },
  {
    name: "Service Designer",
    description:
      "Service designers design the end-to-end journey of a service. This helps a user complete their goal and government deliver a policy intent. In this role, your work may involve the creation of, or change to, transactions, products and content across both digital and offline channels provided by different parts of government.",
    referenceDdatRole: "Service designer",
  },
  {
    name: "Digital Service Manager",
    description: "",
    referenceDdatRole: "Service owner",
  },
  {
    name: "Content Designer",
    description:
      "Content designers make things easier for people to understand and use. This can involve working on a single piece of content or on the end-to-end journey of a service to help users complete their goal and government deliver a policy intent. In this role your work may involve the creation of, or change to, a transaction, product or single piece of content that stretches across digital and offline channels.",
    referenceDdatRole: "Content designer",
  },
  {
    name: "Business Analyst",
    description:
      "Business analysts help teams to: analyse and understand a business problem or opportunity, undertake research and analysis to understand how a business or business area works, considering the people, organisation, processes, information, data and technology, identify areas for improvement, explore feasible options, analyse the effects of change and define success measures, identify and elaborate user and business needs to enable effective design, development and testing of services and business change, make decisions related to prioritisation and minimum viable product by using analysis led insights, ensure new products and services meet business and user needs, and are aligned with organisational goals, understand any business and policy constraints that need to be considered, and assess the implications.",
    referenceDdatRole: "Business analyst",
  },
  {
    name: "UX Designer",
    description: "",
    referenceDdatRole: "Interaction designer",
  },
  {
    name: "Product Manager",
    description:
      "A product manager makes sure that their products provide value and achieve the right outcomes by balancing user and business needs.",
    referenceDdatRole: "Product manager",
  },
];
