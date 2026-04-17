import { CaretDownIcon, CaretUpIcon } from "@phosphor-icons/react";

export default function ProfitBadge({ profit }: { profit: number }) {
  return (
    <span className={`flex items-center gap-1 w-fit p-1 text-xs rounded-sm font-semibold ${profit > 0
      ? 'bg-emerald-100 text-emerald-500 dark:bg-emerald-500/20 dark:text-emerald-400'
      : 'bg-red-100 text-red-500 dark:bg-red-500/20 dark:text-red-400'}`}
    >
      {profit > 0 ? <CaretUpIcon size={15} weight="fill" /> : <CaretDownIcon weight="fill" />}
      {profit} %
    </span>
  )
}
