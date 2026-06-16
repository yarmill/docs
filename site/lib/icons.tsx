import { createElement, type ReactNode } from 'react';
import {
  BookOpen,
  BriefcaseMedical,
  Calendar,
  CalendarDays,
  Clipboard,
  ClipboardList,
  FileText,
  Gauge,
  GraduationCap,
  HeartPulse,
  IdCard,
  type LucideIcon,
  Paperclip,
  PersonStanding,
  Plug,
  Settings,
  Sparkles,
  SquarePen,
  Target,
  Timer,
  Trophy,
  UserCheck,
  LineChart,
} from 'lucide-react';

/**
 * Font Awesome → lucide map.
 *
 * Frontmatter (`icon:`) and `<Card icon="…">` in `content/` use Font Awesome
 * names (the docs source authored against Mintlify). Fumadocs has no FA library,
 * so without a resolver the raw string leaks into the page tree and renders next
 * to the label (the "bullseyeGoals" bug). This maps every FA name actually used
 * in `content/` to the closest lucide glyph; anything unknown falls back to
 * `FileText` so a page link always gets a sensible icon instead of stray text.
 *
 * Keys grepped from `content/`:
 *   frontmatter `icon:` — book-open, briefcase-medical, bullseye, calendar,
 *     calendar-week, chart-line, clipboard, gauge-high, graduation-cap,
 *     heart-pulse, id-card, paperclip, pen-to-square, plug, stopwatch, trophy,
 *     user-check, wand-magic-sparkles
 *   `<Card icon="…">` adds — clipboard-list, gear, person-running
 */
const ICONS: Record<string, LucideIcon> = {
  'book-open': BookOpen,
  'briefcase-medical': BriefcaseMedical,
  bullseye: Target,
  calendar: Calendar,
  'calendar-week': CalendarDays,
  'chart-line': LineChart,
  clipboard: Clipboard,
  'clipboard-list': ClipboardList,
  gear: Settings,
  'gauge-high': Gauge,
  'graduation-cap': GraduationCap,
  'heart-pulse': HeartPulse,
  'id-card': IdCard,
  paperclip: Paperclip,
  'pen-to-square': SquarePen,
  'person-running': PersonStanding,
  plug: Plug,
  stopwatch: Timer,
  trophy: Trophy,
  'user-check': UserCheck,
  'wand-magic-sparkles': Sparkles,
};

const DEFAULT_ICON: LucideIcon = FileText;

/**
 * Render a Font Awesome icon name as a lucide node. Used by the sidebar
 * `NavTree` (frontmatter `icon:`) and the MDX `<Card icon="…">`, keeping a
 * single source of truth for icon mapping across sidebar and content.
 *
 * A missing/empty `name` renders nothing; an unknown-but-present `name` falls
 * back to the `FileText` glyph so a link always gets a sensible icon instead of
 * stray text.
 */
export function Icon({
  name,
  className,
}: {
  name?: string;
  className?: string;
}): ReactNode {
  if (!name) return null;
  const Component = ICONS[name] ?? DEFAULT_ICON;
  return createElement(Component, { className });
}
