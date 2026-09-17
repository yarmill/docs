// The demo cast — docs-guide/visuals/demo-cast.md is the prose version.
//
// Writes are allowed ONLY inside this group. Every helper that navigates to a
// person goes through ID, so a name outside AFC Richmond fails loudly instead
// of silently touching someone else's data.
export const GROUP = 14;
export const ID = {
  'Lasso Ted': 1072,      // coach — the primary login, the only supervisor
  'Welton Rebecca': 1073, // admin
  'Tartt Jamie': 1074,    // athlete — the lead athlete, the athlete login
  'Kent Roy': 1075,       // athlete
  'Bumbercatch Moe': 1076,
  'McAdoo Isaac': 1077,
  'Obisanya Sam': 1078,
  'Rojas Dani': 1079,
};
export function idOf(name) {
  if (!(name in ID)) throw new Error(`"${name}" is not in AFC Richmond — writes are scoped to that group only.`);
  return ID[name];
}
