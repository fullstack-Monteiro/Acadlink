export default function SkeletonPost() {
  return (
    <div className="bg-white dark:bg-[#1e1e1e] rounded-2xl border border-neutral-100 dark:border-[#2a2a2a] p-4 animate-pulse">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-neutral-200 dark:bg-[#2a2a2a]" />
        <div className="flex-1 space-y-1.5">
          <div className="h-3.5 bg-neutral-200 dark:bg-[#2a2a2a] rounded-full w-32" />
          <div className="h-3 bg-neutral-200 dark:bg-[#2a2a2a] rounded-full w-24" />
        </div>
      </div>
      <div className="space-y-2 mb-3">
        <div className="h-3 bg-neutral-200 dark:bg-[#2a2a2a] rounded-full w-full" />
        <div className="h-3 bg-neutral-200 dark:bg-[#2a2a2a] rounded-full w-5/6" />
        <div className="h-3 bg-neutral-200 dark:bg-[#2a2a2a] rounded-full w-4/6" />
      </div>
      <div className="flex gap-2 pt-2 border-t border-neutral-100 dark:border-[#2a2a2a]">
        <div className="h-8 bg-neutral-200 dark:bg-[#2a2a2a] rounded-lg w-16" />
        <div className="h-8 bg-neutral-200 dark:bg-[#2a2a2a] rounded-lg w-16" />
        <div className="h-8 bg-neutral-200 dark:bg-[#2a2a2a] rounded-lg w-16" />
      </div>
    </div>
  )
}
