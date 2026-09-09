import type { TeamMember } from '../state/types'

export const TEAM: TeamMember[] = [
  { name: 'Esmee de Vries', email: 'e.devries@bergrode.nl', role: 'owner', langs: ['nl'] },
  { name: 'Vincent Bakker', email: 'v.bakker@bergrode.nl', role: 'member', langs: ['nl', 'en'] },
  { name: 'Marloes Jansen', email: 'm.jansen@bergrode.nl', role: 'member', langs: ['nl'] },
  { name: 'Emre Yılmaz', email: 'e.yilmaz@bergrode.nl', role: 'member', langs: ['tr'] },
  { name: 'Layla Haddad', email: 'l.haddad@bergrode.nl', role: 'member', langs: ['ar'] },
]

/** De twee accounts waartussen het prototype kan wisselen. */
export const USERS = {
  esmee: { key: 'esmee' as const, name: 'Esmee de Vries', role: 'Beheerder', langs: null },
  emre: { key: 'emre' as const, name: 'Emre Yılmaz', role: 'Collega Turks', langs: ['tr'] as const },
}
