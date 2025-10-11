import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

function PostCardSkeleton() {
  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        {/* Title skeleton */}
        <Skeleton className="h-6 w-3/4 mb-3" />

        {/* Author info and metadata skeleton */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-12" /> {/* Badge */}
            <Skeleton className="h-4 w-20" /> {/* Author name */}
          </div>
          <div className="flex items-center gap-3">
            <Skeleton className="h-3 w-8" /> {/* Reading time */}
            <Skeleton className="h-3 w-16" /> {/* Date */}
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Content preview skeleton */}
        <div className="space-y-2 mb-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>

        {/* Read more link skeleton */}
        <Skeleton className="h-4 w-20" />
      </CardContent>
    </Card>
  );
}

export default function Loading() {
  return (
    <div>
      {/* Header section skeleton */}
      <div className="mb-12">
        <div className="text-center space-y-4">
          <Skeleton className="h-12 w-80 mx-auto" /> {/* Main title */}
          <Skeleton className="h-6 w-96 mx-auto" /> {/* Subtitle */}
          <Skeleton className="h-4 w-64 mx-auto" /> {/* Description */}
        </div>
      </div>

      {/* Posts grid skeleton */}
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <PostCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}