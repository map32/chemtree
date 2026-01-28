import { clsx } from "clsx"

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={clsx("animate-pulse rounded-md bg-navy-800/50", className)}
      {...props}
    />
  )
}

export function PostSkeleton() {
  return (
    <div className="bg-navy-900 border border-navy-800 p-6 rounded-lg h-full">
      {/* Category Tag & Date */}
      <div className="flex items-center gap-4 mb-4">
        <Skeleton className="h-6 w-20 rounded" />
        <Skeleton className="h-4 w-24 rounded" />
      </div>
      
      {/* Title */}
      <Skeleton className="h-8 w-3/4 mb-4 rounded" />
      
      {/* Excerpt Lines */}
      <div className="space-y-2 mb-6">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>
      
      {/* "Read Entry" Button */}
      <Skeleton className="h-4 w-24" />
    </div>
  )
}