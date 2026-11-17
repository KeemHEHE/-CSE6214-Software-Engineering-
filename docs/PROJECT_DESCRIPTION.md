# CSE6214 Software Engineering Fundamentals
## November 2026 (Term 2630) — Project Description (Part I & II)

## Significant Dates

| Item | Date |
|---|---|
| Group formation | 10.11.2026 – 20.11.2026 (Week 01 & 02) |
| **Part I** — Software Project Planning, Requirements Analysis and System Design | **27.12.2026, 11:59 PM (Week 07)** |
| **Part II** — Software Development, Testing, Project Evaluation | **31.01.2027, 11:59 PM (Week 12)** |
| Online Presentation (Individual Oral Defence) | 01.02.2027 – 05.02.2027 (Week 13) |

> Strictly adhere to the dates above. A penalty may apply for late submission.

## Instructions

Form a group of **3 to 4 students from the SAME tutorial section**. Produce and submit documentation on requirements, design and implementation (prototype) of a system. Rubrics for Part I and Part II are on pages 11, 12 and 13 of the original PDF (see [Rubrics](#rubrics) below). Project titles are assigned by tutorial section.

## Project Titles by Tutorial Section

### TT1L — Circular Campus: Smart Reuse and Resource Sharing System (Dr. Mohana)
A platform where users list reusable items, request items, arrange exchanges and track their contributions to waste reduction.

**Users:** 3–4 user types (e.g. Student, Staff, Resource Coordinator, Administrator)

- User Management
- Resource Listing and Management
- Resource Exchange and Donation Management
- Repair and Reuse Management
- Sustainability Reporting and Notifications

**Additional features for Level 5:**
- Points-based recognition system for active contributors
- Recommendations based on users' interests and previous exchanges
- QR codes for confirming item collection
- Monthly sustainability challenges

### TT2L — GreenPulse: Smart Campus Energy and Water Management System (Dr. Mohana)
A web app to help universities monitor and manage electricity and water consumption across campus buildings. Simulated consumption data is allowed.

**Users:** 3–4 user types (e.g. Student/Staff, Building Supervisor, Facilities Manager, Administrator)

- User Management
- Building and Resource Management
- Energy and Water Consumption Monitoring
- Resource Conservation and Issue Management
- Sustainability Reporting and Notifications

**Additional features for Level 5:**
- Predictive consumption analysis using historical data
- Energy-saving recommendations
- Estimated carbon emissions based on configurable conversion factors
- Building-level sustainability rankings

### TT3L — FoodLoop: Smart Campus Food Surplus (Ms. Venushini)
Lets campus cafeterias and event organisers list surplus food for students and staff to reserve and collect. Supports food availability tracking, collection scheduling and food waste reporting.

**Users:** 3–4 user types (e.g. Student/Staff, Food Provider, Food Redistribution Coordinator, Administrator)

- User Management
- Food Surplus Listing and Availability Management
- Food Reservation and Collection Management
- Food Waste Reporting and Notifications
- Food Redistribution and Feedback Management

**Additional features for Level 5:**
- QR codes for confirming food collection
- Automatic listing expiry based on provider-defined collection deadlines
- Demand forecasting using historical reservation data
- Points-based recognition system for participating food providers

### TT4L — Student Skills and Internship Matching System (Dr. Zuriani)
**Users:** 3–4 user types (e.g. Student, Company Representative, Internship Coordinator, System Administrator)

- User and Profile Management
- Internship Vacancy Management
- Internship Application and Selection Management
- Student Placement and Progress Monitoring
- Internship Evaluation and Reporting

**Additional features for Level 5:**
- Skills-based internship matching and recommendation
- Automated resume keyword analysis
- Internship application suitability scoring
- Internship progress analytics and performance comparison

### TT5L — Clinic Appointment and Queue Management System (Dr. Zuriani)
**Users:** 3–4 user types (e.g. Patient, Clinic Staff, Healthcare Professional, Clinic Administrator)

- User and Patient Management
- Appointment Booking and Scheduling
- Patient Queue Management
- Consultation and Appointment History Management
- Clinic Utilization and Performance Reporting

**Additional features for Level 5:**
- Estimated waiting time based on current queue conditions
- Intelligent appointment slot recommendations
- Automated appointment reminders
- Analysis of peak clinic hours and patient demand

### TT6L — Campus Recycling and Waste Collection Management System (Dr. Zuriani)
**Users:** 3–4 user types (e.g. Student/Staff, Collection Worker, Sustainability Officer, Administrator)

- User Management
- Recycling Point and Bin Management
- Waste Reporting and Collection Management
- Collection Scheduling and Assignment
- Recycling Performance Reporting and Notifications

**Additional features for Level 5:**
- Collection route optimization based on bin locations
- Recycling rewards and points-based recognition
- Waste generation trend analysis
- Interactive recycling location map and collection status tracking

### TT7L — EcoRide: Smart Campus Carpool (Ms. Venushini)
Helps students and staff coordinate shared journeys to and from campus. Users can offer rides, request seats, arrange pickup locations and track participation in sustainable travel.

**Users:** 3–4 user types (e.g. Passenger, Driver, Transport Coordinator, Administrator)

- User and Vehicle Management
- Ride Listing and Route Management
- Ride Booking and Approval Management
- Trip Completion and Feedback Management
- Sustainable Travel Reporting and Notifications

**Additional features for Level 5:**
- Ride recommendations based on routes and preferred travel times
- Recurring ride scheduling for regular commuters
- Estimated carbon savings based on configurable assumptions
- Shared-trip cost calculator

### TT8L — Student Peer Tutoring and Learning Support System (Ms. Venushini)
Lets students request academic support, find peer tutors, book tutoring sessions and monitor their learning progress.

**Users:** 4 user types (Student, Peer Tutor, Academic Coordinator, System Administrator)

- User and Academic Profile Management
- Tutor Registration and Subject Offering Management
- Tutoring Request and Session Booking Management
- Session Attendance and Learning Progress Management
- Tutor Evaluation and Reporting

**Additional features for Level 5:**
- Tutor recommendations based on subjects, availability and learning needs
- Diagnostic quizzes to identify areas requiring support
- Automated scheduling with timetable conflict detection

### TT9L — Student Revision Planning and Practice Assessment System (Ms. Venushini)
Lets students organise revision schedules, attempt practice assessments and monitor subject mastery. Lecturers maintain question banks and review learning difficulties.

**Users:** 4 user types (Student, Lecturer, Course Coordinator, System Administrator)

- User and Course Enrolment Management
- Topic and Question Bank Management
- Revision Plan and Study Schedule Management
- Practice Assessment and Feedback Management
- Learning Progress and Performance Reporting

**Additional features for Level 5:**
- Adaptive practice question selection based on previous performance
- Revision priorities based on weak topics and examination dates
- Spaced repetition reminders for previously attempted topics

### T10L — PetCare: Pet Grooming and Veterinary Appointment Management System (Dr. Naveen)
Pet owners register pets, browse services, book grooming or veterinary appointments and track appointment status. Service providers manage services, schedules and pet care records.

**Users:** 3–4 user types (e.g. Pet Owner, Grooming Staff, Veterinarian, System Administrator)

| Module | Records with full CRUD |
|---|---|
| M1 User and Pet Management | Users, pet profiles, pet breeds, pet types, owner information |
| M2 Service and Pricing Management | Grooming services, veterinary services, service categories, service prices |
| M3 Appointment Booking Management | Appointments, selected services, appointment dates, time slots, booking status |
| M4 Pet Care and Treatment Management | Pet health records, grooming history, treatment records, veterinarian notes |
| M5 Appointment Reporting and Notifications | Appointment summaries, service history, cancellation records, customer notifications |

**Additional features for Level 5:**
- **(M1) Pet profile management:** Maintain pet photos, breed, age, vaccination status and special care requirements. Flag incomplete or overdue vaccination records.
- **(M3) Appointment scheduling and conflict prevention:** Prevent double booking of grooming staff or vets. Recommend alternative slots when the requested time is unavailable.
- **(M4) Pet health and care tracking:** Show previous grooming sessions, treatments and vaccination records. Let authorised staff update records and generate a pet care history report.
- **(M5) Service performance dashboard and notifications:** Show popular services, appointment trends, cancellation rates and staff workload. Notify owners about upcoming appointments, overdue vaccinations and recommended follow-ups.

### T11L — StayEasy: Homestay Reservation Management System (Dr. Naveen)
Customers search and book homestays, check availability and track reservations. Property owners manage listings, bookings and guest check-in/check-out.

**Users:** 3–4 user types (e.g. Customer (Guest), Property Owner, Property Manager, System Administrator)

| Module | Records with full CRUD |
|---|---|
| M1 User and Property Owner Management | Users, property owners, user profiles, roles |
| M2 Homestay and Property Management | Homestays, property descriptions, room details, facilities, photographs |
| M3 Availability and Reservation Management | Reservations, check-in dates, check-out dates, guest details, booking status |
| M4 Check-in, Check-out and Maintenance Management | Check-in records, check-out records, maintenance reports, property status |
| M5 Reservation Reporting and Notifications | Booking summaries, occupancy records, cancellation records, customer notifications |

**Additional features for Level 5:**
- **(M2) Dynamic pricing and rental cost optimisation:** Calculate rental cost from room type, stay duration, seasonal rates, guest capacity, discounts and add-ons. Owners configure pricing rules and promotions.
- **(M3) Reservation and availability:** Validate availability, prevent overlapping bookings, suggest alternative dates or rooms.
- **(M4) Maintenance and room availability control:** Schedule maintenance, record room issues and automatically block affected rooms until available again.
- **(M5) Analytics and guest notifications:** Dashboards on occupancy, revenue and booking trends; automated guest notifications; recommend properties or dates based on preferences and booking history.

### T12L — Scholarship, Financial Aid and Student Success Management System (Dr. Zarina)
Helps universities manage scholarships, bursaries, financial aid programmes and sponsorship schemes across the student lifecycle: application processing, eligibility assessment, award allocation, renewal monitoring and academic performance tracking.

**Users:** 3–4 user types (e.g. Student, Financial Aid Officer, Scholarship Sponsor, System Administrator)

- User and Student Profile Management
- Scholarship and Financial Aid Programme Management
- Application and Supporting Document Management
- Award Evaluation, Allocation and Renewal Management
- Student Success Reporting and Notifications

**Additional features for Level 5:**
- Scholarship recommendation engine based on academic performance, household income, programme of study and eligibility criteria
- Automated suitability scoring and applicant ranking using configurable rubrics
- Renewal monitoring based on CGPA, credit completion, disciplinary records and sponsor requirements
- Financial aid analytics dashboard (award distribution, recipient performance, retention rates, funding utilisation)

### T13L — FixFlow: Maintenance Work Order System (Dr. Nicole)
Staff and students report faults, which become work orders for technicians. Also schedules preventive maintenance for equipment.

**Users:** Requester (Staff/Student), Technician, Maintenance Supervisor, Administrator

| Module | Records with full CRUD |
|---|---|
| M1 User and Technician Management | Users, technicians and their skills (electrical, plumbing, IT) |
| M2 Facility and Equipment Management | Buildings, rooms, equipment, equipment history |
| M3 Fault Report and Work Order Management | Fault reports with photo, work orders, priority, status |
| M4 Preventive Maintenance and Spare Parts Management | Maintenance schedules, spare parts, parts used per job |
| M5 Maintenance Reporting and Notifications | Open jobs, average repair time, overdue work orders |

**Delete rule:** a duplicate report is closed as a duplicate, not deleted. Completed work orders are kept as safety records.

**Additional features for Level 5:**
- (M2) QR code on each piece of equipment to report a fault from a phone
- (M3) Automatic assignment by technician skill and current workload
- (M4) Automatic creation of preventive work orders from the schedule
- (M5) Repeat-fault analysis showing which equipment fails most

### T14L — ParcelPath: Parcel Delivery and Shipment Tracking System (Dr. Nicole)
Takes parcel bookings, records each scan as a parcel moves through hubs, assigns riders and stores proof of delivery.

**Users:** Customer (Sender/Recipient), Rider, Hub Operator, Administrator

| Module | Records with full CRUD |
|---|---|
| M1 User and Rider Management | Users, riders, delivery zones |
| M2 Shipment Booking Management | Shipments, sender and recipient, weight, service type, shipping fee |
| M3 Hub Operations and Tracking Management | Hubs, scan events (received, in transit, out for delivery) |
| M4 Delivery Assignment and Proof of Delivery Management | Rider assignments, delivery attempts, failed-delivery reasons, proof of delivery |
| M5 Delivery Reporting and Notifications | On-time rate, failed deliveries, status updates to customers |

**Delete rule:** a booking can be cancelled before pickup. After pickup, scan events and proof of delivery are never deleted (they settle disputes).

**Additional features for Level 5:**
- (M2) Shipping fee calculator using actual or volumetric weight, whichever is higher
- (M3) Public tracking page by tracking number
- (M4) Proof of delivery with photo and signature, plus rider route ordering
- (M5) On-time delivery dashboard by zone and rider

### T15L — Graduate Employability and Career Development Management System (Dr. Zarina)
Helps universities monitor and improve students' employability readiness. Students assess career readiness, join career development activities, track industry engagement, manage cadetship participation and build portfolios. Staff and career advisors monitor outcomes and identify students who need support.

**Users:** 3–4 user types (e.g. Student, Career Advisor, Programme Coordinator, System Administrator)

- User and Career Profile Management
- Employability Assessment and Skill Development Management
- Career Activity and Cadetship Participation Management
- Career Coaching and Development Plan Management
- Employability Analytics and Reporting

**Additional features for Level 5:**
- Career pathway recommendations based on skills, interests, academic performance and preferred industries
- Automated career readiness scoring using configurable competency frameworks
- iCadet/eCadet point calculation and completion tracking
- Skill gap analysis and personalised development recommendations

## Permitted Technologies

| Programming Language | Recommended Framework |
|---|---|
| Python | Django |
| PHP 8.4 or later | Laravel or custom PHP application |
| Java | Spring Boot with Spring Security |
| C# | ASP.NET Core |
| JavaScript / TypeScript | Node.js with Express or NestJS |

**Other permitted:**
- Frontend: HTML, CSS, JavaScript, TypeScript, React or Vue
- Database: MySQL, PostgreSQL or SQLite

**Explicitly prohibited:**
- WordPress
- Other ready-made CMS (Joomla, Drupal, etc.)
- Low-code / no-code website builders
- Preconfigured templates or plugins used in place of your own application logic
- Any other technology your tutor deems unsuitable

## Weekly Progress Monitoring
- Update the **AI Thought Partner Tracker** (see template) every week
- Show the tracker to your tutor

## File Naming

**Part I:** `Proj_PI_TTxL_Gx_stud1, stud2, stud3, stud4.pdf`
Example: `Proj_PI_TT3L_G5_David, Edwin, Ella, Othman.pdf`

- `Proj` — Project
- `Px` — Project part (PI)
- `TTxL` — tutorial class code (TT1L, TT2L, …)
- `Gx` — group number
- `stud` — member's short name (e.g. David Fong Seow Kee → David)

**Part II:**
- Group: `Proj_PII_TTxx_Gxx_Source.zip`
- Individual: `Proj_PII_TTxx_Gxx_StudentName_StudentID.pdf`

---

## Rubrics

### Mark Summary

| Project Phase | Cognitive | Affective | Total |
|---|---|---|---|
| Project – Part I | 20% | NIL | 20% |
| Project – Part II | 40% | NIL | 40% |
| Documentation Project – Part I | NIL | 20% | 20% |
| **Grand Total** | | | **80%** |

### Cognitive and Affective Assessment

| Component | Submission | Element | Marks |
|---|---|---|---|
| Cognitive | Part I – Technical Evaluation | 1) Project definition, plan, Gantt chart and role allocation | 3 |
| | | 2) Functional/non-functional requirements and detailed use cases | 6 |
| | | 3) Use-case and requirements models, coherence and coverage | 3 |
| | | 4) Logical database design (ERD, entities, keys, cardinalities) | 4 |
| | | 5) High-level system architecture and interfaces | 4 |
| Affective | Part I – Documentation | 1) Clear project purpose, scope and planning documentation | 3 |
| | | 2) Well-structured, understandable SRS and use case descriptions | 6 |
| | | 3) Correct, consistently annotated design documentation and models | 7 |
| | | 4) Requirement-to-design cross-references and revision control | 2 |
| | | 5) Language, presentation, citations and references | 2 |
| Cognitive | Part II – Development, Testing, Evaluation and Individual Oral Defence | 1) Implementation and correct operation of assigned functions | 14 |
| | | 2) Subsystem/database integration and software quality | 7 |
| | | 3) Individual test design, execution, evidence and defect handling | 8 |
| | | 4) Engineering decisions, change/configuration awareness | 4 |
| | | 5) Presentation – live demonstration and technical oral defence | 7 |

Part I = 20 · Part I Documentation = 20 · Part II = 40 · **Grand Total = 80**

### Cognitive Rubric — Part I (Planning, Requirements Analysis and System Design)

| Criterion | Max | L0 Non-existent | L1 Very Weak | L2 Weak | L3 Fair | L4 Good | L5 Excellent |
|---|---|---|---|---|---|---|---|
| Project Planning | 3 | No project plan or scope (0) | Purpose unclear; schedule/roles mostly absent (0.6) | Basic objectives; unrealistic schedule or vague roles (1.2) | Plausible scope, method, Gantt chart and roles; gaps remain (1.8) | Well-justified scope, process and feasible plan; roles clear (2.4) | Precise scope and rationale; realistic dependencies, milestones, risks and accountability, weekly progress monitoring (3) |
| Requirements analysis | 6 | No usable requirements or use cases (0) | Major actors/functions missing; use cases unclear (1.2) | Some functional needs identified; flows and NFRs incomplete (2.4) | Core actors, FRs/NFRs and principal flows described with minor omissions (3.6) | Clear, testable requirements and detailed principal/alternative flows (4.8) | Comprehensive, prioritised, unambiguous, testable requirements and consistent flows (6) |
| Requirements modelling | 3 | No use-case model (0) | Diagram largely incorrect or disconnected from needs (0.6) | Some valid actors/use cases; significant notation or coverage errors (1.2) | Mostly correct model with acceptable coverage and some inconsistencies (1.8) | Correct notation and strong consistency with requirements (2.4) | Accurate, complete model with clear system boundary and traceable scenarios (3) |
| Logical database design | 4 | No ERD/data model (0) | Few relevant entities; relationships unusable (0.8) | Partial entities/keys; major cardinality errors (1.6) | Main entities, keys and relationships present; several minor issues (2.4) | Coherent ERD with appropriate attributes, keys and cardinalities (3.2) | Complete, well-normalised logical model; constraints and relationships justified (4) |
| Architecture and interfaces | 4 | No architecture or interface design (0) | Unclear modules, data flows and screen concepts (0.8) | Partial modules/wireframes; weak link to requirements (1.6) | Plausible layers, subsystems and core wireframes; minor gaps (2.4) | Clear architecture, subsystem interaction and usable annotated wireframes (3.2) | Well-justified, cohesive architecture; interfaces and module boundaries fully aligned (4) |

*FR = Functional Requirement; NFR = Non-Functional Requirement*

### Affective Rubric — Part I (Documentation Evaluation)

| Criterion | Max | L0 Non-existent | L1 Very Weak | L2 Weak | L3 Fair | L4 Good | L5 Excellent |
|---|---|---|---|---|---|---|---|
| Introduction and planning write-up | 3 | No relevant documentation (0) | Scattered or unintelligible objectives/plan (0.6) | Important details missing or poorly organised (1.2) | Purpose, scope and plan understandable but uneven (1.8) | Clearly structured, coherent project context and planning narrative (2.4) | Concise, precise, professionally organised context, rationale and planning record (3) |
| SRS and use-case descriptions | 6 | No SRS/use-case text (0) | Descriptions mostly absent or incoherent (1.2) | Several sections incomplete; ambiguous wording (2.4) | Most sections readable; some missing flows/definitions (3.6) | Complete, consistent, correctly structured SRS and use-case records (4.8) | Highly clear, precise, traceable SRS with exemplary scenarios and exceptions (6) |
| Design documentation and notation | 7 | No documented design models (0) | Unreadable or mostly incorrect diagrams and explanations (1.4) | Models partly readable but significant notation/annotation gaps (2.8) | Core ERD, architecture and wireframes explained with minor faults (4.2) | Correct, readable, well-labelled diagrams with clear explanations (5.6) | Professional, self-explanatory, precise design rationale and mutually consistent diagrams (7) |
| Traceability and revision control | 2 | No links or change record (0) | Requirements/design unlinked; revisions undocumented (0.4) | Partial links and superficial revision entries (0.8) | Core requirements linked; revision record mostly usable (1.2) | Clear requirement-to-design mapping and maintained change history (1.6) | Complete, auditable cross-references and well-explained revisions (2) |
| Writing and referencing | 2 | No meaningful report (0) | Pervasive language problems; sources absent (0.4) | Frequent errors, inconsistent formatting or weak citations (0.8) | Readable and mostly consistent; a few citation/style errors (1.2) | Well-organised technical prose and correct source acknowledgement (1.6) | Polished, concise academic writing; precise figures, citations and references (2) |

**The SRS includes:**
1. System Overview — purpose, scope and description of the proposed system
2. Functional Requirements — functions the system must perform
3. Non-Functional Requirements — performance, security, usability and reliability
4. Actors — users who interact with the system
5. Use Case Diagram — visual representation of actor–system interactions
6. Use Case Descriptions — how users interact with the system, including normal and alternative flows

### Cognitive Rubric — Part II (Development, Testing, Evaluation and Individual Oral Defence)

| Criterion | Max | L0 Non-existent | L1 Very Weak | L2 Weak | L3 Fair | L4 Good | L5 Excellent |
|---|---|---|---|---|---|---|---|
| Implementation and correctness | 14 | No individual implementation evidence (0) | Only isolated or non-working features attributable to student (2.8) | A few features work; many essential requirements unmet (5.6) | Core assigned functions operate with noticeable defects or omissions (8.4) | Most assigned requirements implemented correctly with minor issues (11.2) | Complete, robust, demonstrably student-owned functions including edge cases (14) |
| Integration and software quality | 7 | No integration/quality evidence (0) | Subsystem not integrated; serious data/control failures (1.4) | Limited integration; frequent errors or unsafe handling (2.8) | Main integrations work; reasonable validation and error handling (4.2) | Reliable database/module integration; sound usability and controls (5.6) | Seamless integration with justified quality, resilience and secure practices (7) |
| Testing and defect handling | 8 | No individual tests or results (0) | Token tests without expected/actual evidence (1.6) | Narrow happy-path tests; defects poorly recorded (3.2) | Core positive/negative cases documented; some retest gaps (4.8) | Systematic traceable tests with results, fixes and retesting (6.4) | Comprehensive risk-based test evidence, boundary cases and verified resolutions (8) |
| Engineering decisions and changes | 4 | Cannot identify own design/process decisions (0) | Minimal explanation; changes unmanaged (0.8) | Basic rationale but weak links to requirements/versioning (1.6) | Reasonable design/process explanation and partial change tracking (2.4) | Sound rationale for implementation, quality and controlled revisions (3.2) | Insightful, evidence-based engineering trade-offs and rigorous change accountability (4) |
| Individual demonstration and defence | 7 | No demonstration/defence (0) | Cannot run or explain assigned work (1.4) | Partial demo; major gaps in technical answers (2.8) | Core demo succeeds; adequately explains main functionality (4.2) | Clear working demo and confident, accurate responses about code/tests (5.6) | Fluent live demo, troubleshooting and precise defence of design, code and tests, weekly progress monitoring (7) |

---

## Useful Links

**Use case diagrams**
- https://www.uml-diagrams.org/use-case-diagrams.html
- https://www.uml-diagrams.org/use-case-diagrams-examples.html
- https://www.lucidchart.com/pages/uml-use-case-diagram
- https://www.smartdraw.com/use-case-diagram/
- https://online.visual-paradigm.com/tutorials/use-case-diagram-tutorial/
- Video: https://www.youtube.com/watch?v=zid-MVo7M-E

**Activity diagrams**
- https://www.uml-diagrams.org/activity-diagrams-examples.html
- https://www.lucidchart.com/pages/uml-activity-diagram
- https://www.lucidchart.com/pages/swimlane-diagram
- https://www.smartdraw.com/activity-diagram/examples/
- https://www.visual-paradigm.com/guide/uml-unified-modeling-language/what-is-activity-diagram/
- Video: https://www.youtube.com/watch?v=yAihwmczqsk

**ER diagrams**
- https://www.smartdraw.com/entity-relationship-diagram/
- https://www.smartdraw.com/entity-relationship-diagram/examples/
- https://creately.com/blog/diagrams/er-diagrams-tutorial/
- http://www.cs.uregina.ca/Links/class-info/215/erd/
- Videos: https://www.youtube.com/watch?v=QpdhBUYk7Kk · https://www.youtube.com/watch?v=-CuY5ADwn24 · https://www.youtube.com/watch?v=c0_9Y8QAstg · https://www.youtube.com/watch?v=-fQ-bRllhXc

**Class diagrams**
- https://www.lucidchart.com/pages/uml-class-diagram
- https://www.tutorialspoint.com/uml/uml_component_diagram.htm
- https://www.smartdraw.com/class-diagram/
- https://www.ibm.com/developerworks/rational/library/content/RationalEdge/sep04/bell/index.html
- https://www.visual-paradigm.com/guide/uml-unified-modeling-language/what-is-class-diagram/
- Videos: https://www.youtube.com/watch?v=UI6lqHOVHic · https://www.youtube.com/watch?v=xiUFTLIU-lw · https://www.youtube.com/watch?v=ZyST6OFtb7k

**State transition diagrams**
- http://www.cs.unc.edu/~stotts/145/CRC/state.html
- https://www.stickyminds.com/article/state-transition-diagrams
- https://www.smartdraw.com/state-diagram/
- https://www.lucidchart.com/pages/uml-state-machine-diagram
- Videos: https://www.youtube.com/watch?v=PF9QcYWIsVE · https://www.youtube.com/watch?v=OsmWASXE2IM

**Sequence diagrams**
- https://www.lucidchart.com/pages/uml-sequence-diagram
- https://www.smartdraw.com/sequence-diagram/
- https://www.visual-paradigm.com/guide/uml-unified-modeling-language/what-is-sequence-diagram/
- https://www.ibm.com/developerworks/rational/library/3101.html
- Videos: https://www.youtube.com/watch?v=XIQKt5Bs7II · https://www.youtube.com/watch?v=cxG-qWthxt4 · https://www.youtube.com/watch?v=18_kVlQMavE
