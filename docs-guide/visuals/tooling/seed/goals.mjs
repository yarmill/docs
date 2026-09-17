// Demo data for AFC Richmond — Goals. The prose version (and the reasoning
// behind the state spread) is docs-guide/visuals/demo-data/goals-afc-richmond.md.
// Categories/subcategories are the instance's real codelist.
export const SEED = {
  'Tartt Jamie': [
    { title: 'Turn into the team’s playmaker', season: '2026', state: 'On track', priority: 'High',
      supervisor: 'Lasso Ted', category: ['Performance', 'Result'],
      description: 'Stop being the guy who scores and start being the guy who makes it happen for everyone else.',
      keyResults: [
        { name: 'League assists', start: '3', current: '6', target: '10', date: '2027-05-10', state: 'On track' },
        { name: 'Key passes per 90', start: '1.4', current: '2.1', target: '3.0', date: '2027-05-10', state: 'On track' },
        { name: 'Track-backs per 90', start: '2', current: '3', target: '6', date: '2026-12-20', state: 'Off track' },
      ] },
    { title: 'Add strength without losing sharpness', season: '2026', state: 'Off track', priority: 'Medium',
      supervisor: 'Lasso Ted', category: ['Fitness', 'Strength'],
      description: 'Heavier in the gym, same over ten metres.',
      keyResults: [
        { name: 'Back squat', start: '110 kg', current: '125 kg', target: '140 kg', date: '2027-02-28', state: 'On track' },
        { name: '10 m sprint', start: '1.72 s', current: '1.71 s', target: '1.68 s', date: '2027-02-28', state: 'Off track' },
        { name: 'Gym sessions per week', start: '0', current: '0', target: '3', date: '2026-11-30', state: 'Not started' },
      ] },
    { title: 'Finish the season fit', season: '2025', state: 'Completed', priority: 'High',
      supervisor: 'Lasso Ted', category: ['Health', 'Health condition'],
      description: 'Available for selection every week — no soft-tissue setbacks.',
      keyResults: [
        { name: 'League appearances', start: '0', current: '34', target: '30', date: '2026-05-24', state: 'Completed' },
        { name: 'Days lost to injury', start: '41', current: '6', target: 'under 10', date: '2026-05-24', state: 'Completed' },
      ],
      comments: ['Six days lost all season. The Monday gym work is doing exactly what we hoped.'],
      evaluation: 'Thirty-four games, and not one of them because he got lucky with his body. Proud of this one.' },
    { title: 'Win back a starting place', season: '2024', state: 'Completed', priority: 'High',
      supervisor: 'Lasso Ted', category: ['Performance', 'Result'],
      description: 'Back in the first eleven, on merit.',
      keyResults: [
        { name: 'League starts', start: '4', current: '21', target: '15', date: '2025-05-25', state: 'Completed' },
      ] },
  ],
  'Obisanya Sam': [
    { title: 'Grow into a leader on the pitch', season: '2026', state: 'Completed', priority: 'Medium',
      supervisor: 'Lasso Ted', category: ['Personal', 'Communication'],
      description: 'Be the voice the back four listens to when it gets loud.',
      keyResults: [
        { name: 'Captain the side', start: '0', current: '3', target: '2', date: '2026-08-31', state: 'Completed' },
        { name: 'Lead the pre-match huddle', start: '0', current: '6', target: '5', date: '2026-08-31', state: 'Completed' },
      ] },
  ],
  'Kent Roy': [
    { title: 'Last the full ninety again', season: '2026', state: 'Canceled', priority: 'Medium',
      supervisor: 'Lasso Ted', category: ['Fitness', 'Endurance'],
      description: 'Build back to a full match without the knee complaining.',
      keyResults: [
        { name: 'Minutes per appearance', start: '62', current: '78', target: '90', date: '2027-05-10', state: 'Canceled' },
        { name: 'Full matches played', start: '1', current: '4', target: '10', date: '2027-05-10', state: 'Canceled' },
      ] },
  ],
  'McAdoo Isaac': [
    { title: 'Cut out the cards', season: '2026', state: 'Failed', priority: 'High',
      supervisor: 'Lasso Ted', category: ['Personal', 'Psyche'],
      description: 'Win the ball without winning a booking.',
      keyResults: [
        { name: 'Yellow cards', start: '9', current: '11', target: 'under 5', date: '2027-05-10', state: 'Failed' },
        { name: 'Bookings for dissent', start: '4', current: '5', target: '0', date: '2027-05-10', state: 'Failed' },
      ] },
  ],
  // Deliberately incomplete: no supervisor, no category, one key result — this is
  // the goal the Verification shot needs, so a later pass must not tidy it up.
  'Rojas Dani': [
    { title: 'Stay dangerous in the air', season: '2026', state: 'Not started',
      keyResults: [
        { name: 'Headed goals', start: '1', current: '1', target: '5', date: '2027-05-10', state: 'Not started' },
      ] },
  ],
  'Lasso Ted': [
    { title: 'Sit down with every player, every week', season: '2026', state: 'On track', priority: 'High',
      supervisor: 'Lasso Ted', category: ['Personal', 'Communication'],
      description: 'Eleven conversations a week. Not about football, necessarily.',
      keyResults: [
        { name: 'One-to-ones held this week', start: '0', current: '8', target: '11', date: '2027-05-10', state: 'On track' },
      ] },
  ],
  // 'Bumbercatch Moe' intentionally has no goals — the empty row in the group overview.
};
