// Demo data for AFC Richmond — Medical module (Injuries & Illnesses).
// The prose version (and the reasoning behind the status spread) is
// docs-guide/visuals/demo-data/medical-afc-richmond.md.
//
// PROPOSAL — not yet seeded. Nothing here has been written to the live app.
//
// Reference date for every date below: **2026-09-20**. If the seed runs much
// later, shift the whole set so "recent", "overdue" and "closed months ago"
// still read correctly (see the prose plan).
//
// Field notes for the driver:
//
// - `limitation` is the exact UI label of the training limitation (Injury Status):
//   'Full training or competition' | 'Modified training or competition' |
//   'No training or competition'.
// - `diagnosis.query` is the string typed into the OSIICS search box;
//   `diagnosis.code` is the code expected in the result list. Every code below
//   was read out of the **OSIICS version 16 workbook** published on
//   johnorchard.com (the current release, 1 Nov 2025) — none is invented. What
//   is still unverified is which OSIICS version *Yarmill* ships: if the picker
//   is on an earlier version a code may be absent or carry a different label,
//   so the driver must treat a code it cannot find as skippable (log it, leave
//   the record without a diagnosis) rather than picking the nearest hit. A
//   wrong OSIICS code in a published screenshot is worse than no diagnosis.
//   Illness codes all begin with M; injury codes begin with the body region.
// - `circumstances` are `[category, value]` pairs over the categories
//   Activity · Injury mechanism · Location · Severity · Surface. These codelists
//   are **configured per instance** — every value below is a GUESS until seen in
//   the live picker. The driver must treat a missing category or value as
//   skippable (log it and carry on), not as a failure.
// - `closureDate` appears on closed records. It is an **extra key beyond the
//   agreed shape**: the Closure date may be auto-set to the day the record is
//   closed and may not be editable (TODO(verify) in the live app). If it is not
//   editable, ignore this field — the closed records will then all carry the
//   seeding date instead of their real closure dates, which costs the "closed
//   months ago" reading but nothing else.
// - `comments` are posted into Activity from whichever session is seeding
//   (the coach, Lasso Ted). Athlete-voice comments would need Jamie's login.
export const SEED = {
  // ── The lead athlete. Two open problems + four closed, so the Open/Closed
  // split reads as a real career log, and the ankle sprain is the hero shot.
  'Tartt Jamie': [
    {
      title: 'Right ankle sprain (lateral)',
      type: 'Injury',
      classification: 'New',
      treatment: 'Open',
      limitation: 'No training or competition',
      startDate: '2026-09-06',
      expectedReturn: '2026-10-04',
      diagnosis: { query: 'ankle sprain', code: 'AL1', side: 'Right' }, // AL1 Sprain lateral collateral ligament ankle — the one confirmed code
      circumstances: [['Activity', 'Match'], ['Injury mechanism', 'Contact'], ['Location', 'Home'], ['Severity', 'Moderate'], ['Surface', 'Natural grass']],
      staff: 'Club physiotherapist',
      note: 'Rolled the ankle landing after an aerial challenge in the second half; walked off unaided. Lateral ligament, no bony tenderness. Walking boot for the first week, then pool and bike. Return to running once he is pain-free on stairs.',
      comments: [
        'Forty-eight hours in the boot, swelling already down. Pool and bike from Wednesday.',
        'Pain-free on stairs today, started straight-line running on grass. Still on track for the 4th.',
      ],
    },
    {
      title: 'Left Achilles tendon soreness',
      type: 'Injury',
      classification: 'Recurring',
      treatment: 'Open',
      limitation: 'Full training or competition',
      startDate: '2026-09-14',
      expectedReturn: null, // leave empty — the overview needs one "–" in the expected-return column
      diagnosis: { query: 'Achilles tendinopathy', code: 'QTA', side: 'Left' }, // QTA Achilles tendinopathy
      circumstances: [['Activity', 'Training'], ['Injury mechanism', 'Overuse'], ['Severity', 'Mild']],
      staff: 'Club physiotherapist',
      note: 'Same left Achilles as last November. Stiff for the first ten minutes of a session, then settles. Training in full, eccentric loading three times a week, monitored.',
      comments: [],
    },
    {
      title: 'Influenza',
      type: 'Illness',
      classification: 'New',
      treatment: 'Closed',
      limitation: 'No training or competition',
      startDate: '2026-01-12',
      expectedReturn: '2026-01-20',
      closureDate: '2026-01-21',
      diagnosis: { query: 'influenza', code: 'MPII', side: 'Unknown' }, // MPII Influenza virus — an illness code (they all start M)
      circumstances: [], // illnesses: leave the circumstance picker empty
      staff: 'Club doctor',
      note: 'Fever and a productive cough. Isolated from the group, cleared by the club doctor before returning to running.',
      comments: [],
    },
    {
      title: 'Left Achilles tendon soreness',
      type: 'Injury',
      classification: 'New',
      treatment: 'Closed',
      limitation: 'Modified training or competition',
      startDate: '2025-11-03',
      expectedReturn: '2025-11-21',
      closureDate: '2025-11-24',
      diagnosis: { query: 'Achilles tendinopathy', code: null, side: 'Left' }, // TODO(verify): code from the live picker
      circumstances: [['Activity', 'Training'], ['Injury mechanism', 'Overuse']],
      staff: 'Club physiotherapist',
      note: 'Soreness after a block of three matches in eight days. Three weeks of modified running volume and calf loading.',
      comments: [],
    },
    {
      title: 'Left hamstring strain (grade 2)',
      type: 'Injury',
      classification: 'New',
      treatment: 'Closed',
      limitation: 'No training or competition',
      startDate: '2025-02-08',
      expectedReturn: '2025-03-15',
      closureDate: '2025-03-21',
      diagnosis: { query: 'hamstring', code: 'TM1', side: 'Left' }, // TM1 Hamstring strain/tear
      circumstances: [['Activity', 'Match'], ['Injury mechanism', 'Non-contact'], ['Severity', 'Severe']],
      staff: 'Club physiotherapist',
      note: 'Felt it sprinting in the 70th minute. Grade 2 strain of the left biceps femoris. Six weeks from injury to full training, back through a graded running programme.',
      comments: ['Forty-one days out in the end. This is the one the availability goal is measured against.'],
    },
    {
      title: 'Lower back stiffness',
      type: 'Injury',
      classification: 'New',
      treatment: 'Closed',
      limitation: 'Modified training or competition',
      startDate: '2024-09-18',
      expectedReturn: '2024-10-01',
      closureDate: '2024-10-02',
      diagnosis: { query: 'lumbar', code: 'LMT', side: 'Unknown' }, // LMT Lumbar soreness or muscle spasm
      circumstances: [['Activity', 'Training'], ['Injury mechanism', 'Non-contact']],
      staff: 'Club physiotherapist',
      note: 'Stiffness after a heavy landing in training. Two weeks of modified gym work and manual therapy, no neurological signs.',
      comments: [],
    },
  ],

  // ── The overdue row, and the recurring pattern: an open knee problem that
  // repeats a closed one from the previous season. Do NOT push the expected
  // return forward — the overdue rendering is the point.
  'Kent Roy': [
    {
      title: 'Right knee patellofemoral pain',
      type: 'Injury',
      classification: 'Recurring',
      treatment: 'Open',
      limitation: 'Modified training or competition',
      startDate: '2026-08-10',
      expectedReturn: '2026-08-30', // deliberately in the past → "21 days overdue" on 2026-09-20
      diagnosis: { query: 'patellofemoral', code: 'KCP', side: 'Right' }, // KCP Patellofemoral joint chondral pain
      circumstances: [['Activity', 'Training'], ['Injury mechanism', 'Overuse'], ['Severity', 'Mild']],
      staff: 'Club doctor',
      note: 'Anterior knee pain that builds through the week and is worst the morning after a full session. No swelling, no mechanical symptoms. Managed with load control plus quad and glute strength work.',
      comments: ['Missed the return date — trained through a heavy week and the pain came back. Reassessed with the club doctor; new target to be set after the break.'],
    },
    {
      title: 'Right knee cartilage irritation',
      type: 'Injury',
      classification: 'New',
      treatment: 'Closed',
      limitation: 'Modified training or competition',
      startDate: '2025-03-02',
      expectedReturn: '2025-04-14',
      closureDate: '2025-04-20',
      diagnosis: { query: 'knee cartilage', code: 'KC1', side: 'Right' }, // KC1 Knee articular cartilage damage — the earlier episode KCP recurs from
      circumstances: [['Activity', 'Match'], ['Injury mechanism', 'Contact']],
      staff: 'Consultant orthopaedic surgeon',
      note: 'Irritation on the medial femoral condyle after a heavy block. Six weeks of load management, no surgery.',
      comments: [],
    },
  ],

  // ── The open illness, so injury vs illness is visible side by side on the overview.
  'Obisanya Sam': [
    {
      title: 'Acute tonsillitis',
      type: 'Illness',
      classification: 'New',
      treatment: 'Open',
      limitation: 'No training or competition',
      startDate: '2026-09-18',
      expectedReturn: '2026-09-24',
      diagnosis: { query: 'tonsillitis', code: 'MPIT', side: 'Unknown' }, // MPIT Tonsillitis — an illness code
      circumstances: [],
      staff: 'Club doctor',
      note: 'Fever and a sore throat, seen by the club doctor and started on antibiotics. No training until 48 hours fever-free.',
      comments: [],
    },
  ],

  // ── The green pill with an open record: a managed problem that costs no training.
  'Rojas Dani': [
    {
      title: 'Right groin adductor tightness',
      type: 'Injury',
      classification: 'Recurring',
      treatment: 'Open',
      limitation: 'Full training or competition',
      startDate: '2026-09-11',
      expectedReturn: '2026-09-28',
      diagnosis: { query: 'groin', code: 'GP1', side: 'Right' }, // GP1 Chronic non specific / functional groin pain
      circumstances: [['Activity', 'Match'], ['Injury mechanism', 'Overuse']],
      staff: 'Club physiotherapist',
      note: 'Tightness that returns in weeks with two matches. Training in full with a modified gym programme and daily adductor work.',
      comments: [],
    },
  ],

  // ── History only: "No health problems" on the overview, but a Closed record
  // behind it — the empty overview row does not mean an empty file.
  'McAdoo Isaac': [
    {
      title: 'Left fifth metacarpal fracture',
      type: 'Injury',
      classification: 'New',
      treatment: 'Closed',
      limitation: 'No training or competition',
      startDate: '2026-02-14',
      expectedReturn: '2026-03-28',
      closureDate: '2026-04-02',
      diagnosis: { query: 'metacarpal', code: 'PFE', side: 'Left' }, // PFE Fifth metacarpal fracture
      circumstances: [['Activity', 'Match'], ['Injury mechanism', 'Contact'], ['Surface', 'Natural grass']],
      staff: 'Hand clinic — orthopaedics',
      note: 'Fracture of the fifth metacarpal blocking a shot. Managed conservatively, back in team training in a protective cast.',
      comments: [],
    },
  ],

  // 'Bumbercatch Moe' intentionally has no records at all — the empty athlete,
  // same as in the Goals seed. Do not give him one.
};
