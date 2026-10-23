import Skeleton, { SkeletonGroup } from './Skeleton'

export default function SkeletonPost() {
  return (
    <SkeletonGroup className="bg-white dark:bg-[#1e1e1e] rounded-2xl border border-neutral-100 dark:border-[#333333] p-4">
      {/* Author row */}
      <div className="flex items-center gap-3 mb-4">
        <Skeleton circle className="w-10 h-10 flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-3.5 w-32 rounded-full" />
          <Skeleton className="h-3 w-24 rounded-full" />
        </div>
        <Skeleton className="h-7 w-20 rounded-xl" />
      </div>

      {/* Content lines */}
      <div className="space-y-2 mb-4">
        <Skeleton className="h-3 w-full rounded-full" />
        <Skeleton className="h-3 w-5/6 rounded-full" />
        <Skeleton className="h-3 w-4/6 rounded-full" />
      </div>

      {/* Image placeholder */}
      <Skeleton className="h-44 w-full rounded-xl mb-4" />

      {/* Actions row */}
      <div className="flex gap-2 pt-3 border-t border-neutral-100 dark:border-[#333333]">
        <Skeleton className="h-8 w-16 rounded-xl" />
        <Skeleton className="h-8 w-16 rounded-xl" />
        <Skeleton className="h-8 w-16 rounded-xl" />
        <Skeleton className="h-8 w-8 rounded-xl ml-auto" />
      </div>
    </SkeletonGroup>
  )
}
