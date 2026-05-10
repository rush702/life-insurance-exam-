import { motion } from 'framer-motion'

type Status = 'default' | 'selected' | 'correct' | 'wrong' | 'reveal'

interface Props {
  index: number
  text: string
  status: Status
  disabled: boolean
  onClick: () => void
}

const LABELS = ['A', 'B', 'C', 'D']

const statusStyles: Record<Status, string> = {
  default:  'bg-brand-card border-white/10 hover:border-violet-500/60 hover:bg-white/5',
  selected: 'bg-violet-600/20 border-violet-500',
  correct:  'bg-emerald-500/20 border-emerald-500 text-emerald-300',
  wrong:    'bg-rose-500/20 border-rose-500 text-rose-300',
  reveal:   'bg-emerald-500/10 border-emerald-500/50 text-emerald-400',
}

const labelStyles: Record<Status, string> = {
  default:  'bg-white/10 text-slate-300',
  selected: 'bg-violet-500 text-white',
  correct:  'bg-emerald-500 text-white',
  wrong:    'bg-rose-500 text-white',
  reveal:   'bg-emerald-500/50 text-emerald-300',
}

export function AnswerOption({ index, text, status, disabled, onClick }: Props) {
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-200 ${statusStyles[status]} ${disabled ? 'cursor-default' : 'cursor-pointer active:scale-[0.98]'}`}
      animate={status === 'wrong' ? { x: [-8, 8, -6, 6, 0] } : {}}
      transition={{ duration: 0.4 }}
      whileHover={!disabled ? { scale: 1.01 } : {}}
    >
      <span className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${labelStyles[status]}`}>
        {status === 'correct' ? '✓' : status === 'wrong' ? '✗' : LABELS[index]}
      </span>
      <span className="text-sm font-medium leading-snug">{text}</span>
      {status === 'reveal' && (
        <span className="ml-auto text-emerald-400 text-xs font-semibold">Correct</span>
      )}
    </motion.button>
  )
}
