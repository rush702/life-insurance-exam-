import type { CategoryMeta } from '../types'

export const CATEGORIES: CategoryMeta[] = [
  {
    id: 'life-basics',
    label: 'Life Insurance Types',
    icon: '🛡️',
    gradient: 'from-violet-600 to-purple-900',
    description: 'Term, whole, universal, variable, endowment',
  },
  {
    id: 'policy-provisions',
    label: 'Policy Provisions',
    icon: '📋',
    gradient: 'from-blue-600 to-blue-900',
    description: 'Grace period, incontestability, suicide clause, free look',
  },
  {
    id: 'beneficiaries',
    label: 'Beneficiaries & Ownership',
    icon: '👨‍👩‍👧',
    gradient: 'from-teal-600 to-teal-900',
    description: 'Primary, contingent, irrevocable, assignment',
  },
  {
    id: 'annuities',
    label: 'Annuities',
    icon: '📈',
    gradient: 'from-green-600 to-green-900',
    description: 'Fixed, variable, immediate, deferred, tax treatment',
  },
  {
    id: 'riders',
    label: 'Riders & Options',
    icon: '🔧',
    gradient: 'from-orange-600 to-orange-900',
    description: 'Waiver of premium, AD&D, GIO, LTC riders',
  },
  {
    id: 'az-regulations',
    label: 'Arizona Regulations',
    icon: '🌵',
    gradient: 'from-red-600 to-red-900',
    description: 'AZ DOI, licensing, CE requirements, guaranty fund',
  },
  {
    id: 'group-insurance',
    label: 'Group Life Insurance',
    icon: '👥',
    gradient: 'from-indigo-600 to-indigo-900',
    description: 'Master policy, certificates, COBRA, conversion',
  },
  {
    id: 'disability-health',
    label: 'Disability & Health',
    icon: '🏥',
    gradient: 'from-pink-600 to-pink-900',
    description: 'DI insurance, elimination periods, Medicare',
  },
  {
    id: 'ethics-licensing',
    label: 'Ethics & Licensing',
    icon: '⚖️',
    gradient: 'from-amber-600 to-yellow-900',
    description: 'Unfair practices, contract law, agent duties',
  },
]
