"'use client'"

import { Skeleton } from "@/components/ui/skeleton"

export function InstagramSkeletonComponent() {
  return (
    (<div className="max-w-lg mx-auto bg-transparent">
      {/* Header */}
      {/* <div className="flex space-x-4 p-4 overflow-x-auto">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex flex-col items-center space-y-1">
            <Skeleton className="h-16 w-16 rounded-full" />
            <Skeleton className="h-3 w-20" />
          </div>
        ))}
      </div> */}
      {/* Posts */}
      {[...Array(2)].map((_, i) => (
        <div key={i} className=" pb-4 mb-4">
          {/* Post header */}
          <div className="flex items-center space-x-2 py-2">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex flex-col gap-2">
              <Skeleton className="h-2 w-44 rounded-full" />
              <Skeleton className="h-2 w-24 rounded-full" />
            </div>
          </div>

          {/* Post image */}
          <Skeleton className="h-[80vh] w-full" />

          {/* Post actions */}
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4 py-2">
              <Skeleton className="h-6 w-6 rounded-lg" />
              <Skeleton className="h-6 w-6 rounded-lg" />
              <Skeleton className="h-6 w-6 rounded-lg" />
            </div>
            <Skeleton className="h-6 w-6 rounded-lg" />
          </div>

          {/* Likes */}
          <div className=" py-2">
            <Skeleton className="h-4 w-28" />
          </div>

          {/* Caption */}
          <div className="">
            <Skeleton className="h-4 w-3/4" />
          </div>

          {/* Comments */}
          <div className=" mt-2">
            <Skeleton className="h-4 w-full" />
          </div>
        </div>
      ))}
    </div>)
  );
}

export function ExploreSkeleton() {
  return (
    <div className='min-h-screen flex bg-background text-on-background w-full'>
      <main className="flex-1 md:ml-[72px] lg:ml-60 bg-transparent min-h-screen flex flex-col pt-8 lg:px-12 w-full">
        {/* Search & Filters Skeleton */}
        <div className="w-full max-w-3xl mx-auto mb-6 px-4 lg:px-0">
          <div className="relative mb-4">
            <div className="w-full h-[52px] bg-surface-container rounded-2xl animate-pulse" />
          </div>
          <div className="flex gap-2 overflow-x-hidden pb-2">
            {[...Array(6)].map((_, i) => (
              <div key={i} className={`h-9 rounded-full animate-pulse ${i === 0 ? 'w-16 bg-surface-container-high' : 'w-24 bg-surface-container'}`} />
            ))}
          </div>
        </div>

        {/* Grid Skeleton */}
        <div className="w-full grid grid-cols-3 gap-[4px] sm:gap-2 auto-rows-[120px] sm:auto-rows-[200px] md:auto-rows-[300px] px-1 lg:px-0 pb-12">
          {[...Array(12)].map((_, index) => {
            const normalizedIndex = index % 10;
            let gridClass = "col-span-1 row-span-1";
            if (normalizedIndex === 0) {
              gridClass = "col-span-2 row-span-2";
            } else if (normalizedIndex === 7) {
              gridClass = "col-span-2 row-span-2 col-start-2";
            }
            return (
              <div key={index} className={`w-full h-full rounded-md sm:rounded-xl bg-surface-container animate-pulse ${gridClass}`} />
            );
          })}
        </div>
      </main>
    </div>
  );
}

export function GenericSkeleton() {
  return (
    <div className='min-h-screen flex bg-background text-on-background w-full'>
      <main className="flex-1 md:ml-[72px] lg:ml-60 flex justify-center items-center w-full min-h-screen">
         <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      </main>
    </div>
  );
}

export function AppSkeleton() {
  return (
    <div className='min-h-screen flex bg-background text-on-background w-full'>
      <main className="flex-1 md:ml-[72px] lg:ml-60 w-full">
        <div className="max-w-screen-xl mt-14 md:mt-0 mx-auto py-2 md:px-6 lg:px-8 w-full">
          <div className="flex gap-0 w-full">
            <div className="flex-1 max-w-[630px]">
              {/* Stories Skeleton */}
              <div className="relative mt-1">
                <div className="w-11/12 whitespace-nowrap overflow-hidden">
                  <div className="flex space-x-4 p-1">
                    {[...Array(6)].map((_, index) => (
                      <div key={index} className="flex aspect-square flex-col items-center space-y-1">
                        <div className="w-16 h-16 rounded-full bg-neutral-200 dark:bg-neutral-800 animate-pulse border-2 border-background" />
                        <div className="h-3 w-12 bg-neutral-200 dark:bg-neutral-800 animate-pulse rounded mt-1" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <section className="mt-2 mx-auto sm:w-[80vw] md:w-[60vw] lg:w-[468px]">
                {/* Posts Skeleton */}
                <InstagramSkeletonComponent />
              </section>
            </div>
            
            {/* Suggested Users Skeleton */}
            <aside className="w-80 p-4 hidden lg:block mt-2 bg-transparent text-on-surface">
              <div className="flex items-center mb-6 justify-between">
                <div className="w-12 h-12 rounded-full bg-neutral-200 dark:bg-neutral-800 animate-pulse" />
                <div className="ml-2 flex-grow flex flex-col gap-2">
                  <div className="h-4 w-24 bg-neutral-200 dark:bg-neutral-800 animate-pulse rounded" />
                  <div className="h-3 w-32 bg-neutral-200 dark:bg-neutral-800 animate-pulse rounded" />
                </div>
              </div>
              <div className="mb-4">
                <div className="flex justify-between mb-4">
                  <div className="h-4 w-28 bg-neutral-200 dark:bg-neutral-800 animate-pulse rounded" />
                  <div className="h-4 w-12 bg-neutral-200 dark:bg-neutral-800 animate-pulse rounded" />
                </div>
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-4 mb-4">
                    <div className="w-8 h-8 rounded-full bg-neutral-200 dark:bg-neutral-800 animate-pulse" />
                    <div className="flex-grow flex flex-col gap-2">
                      <div className="h-3 w-20 bg-neutral-200 dark:bg-neutral-800 animate-pulse rounded" />
                      <div className="h-2 w-28 bg-neutral-200 dark:bg-neutral-800 animate-pulse rounded" />
                    </div>
                  </div>
                ))}
              </div>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}