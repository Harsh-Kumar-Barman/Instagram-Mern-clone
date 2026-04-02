"'use client'"

import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function InstagramProfileSkeletonComponent() {
  return (
    (<div className="profile min-h-screen flex-grow px-4 sm:px-8 lg:px-[72px] py-[60px] ml-0 lg:ml-[14.5%] bg-background text-on-surface">
      {/* Profile Header */}
      <div className="flex items-center p-4 border-b border-surface-container">
        <Skeleton className="h-20 w-20 rounded-full" />
        <div className="ml-4 flex-1">
          <Skeleton className="h-6 w-40 mb-2" />
          <div className="flex space-x-4">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
      </div>
      {/* Bio */}
      <div className="p-4 border-b border-surface-container">
        <Skeleton className="h-4 w-40 mb-2" />
        <Skeleton className="h-4 w-full mb-1" />
        <Skeleton className="h-4 w-2/3" />
      </div>
      {/* Story Highlights */}
      <div className="flex space-x-4 p-4 overflow-x-auto border-b border-surface-container">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex flex-col items-center space-y-1">
            <Skeleton className="h-16 w-16 rounded-full" />
            <Skeleton className="h-3 w-14" />
          </div>
        ))}
      </div>
      {/* Tabs */}
      <Tabs defaultValue="posts" className="w-full">
        <TabsList className="w-full justify-center bg-transparent border-t border-y-surface-container h-14 md:gap-20 gap-8">
          <TabsTrigger value="posts" className="flex items-center gap-2 py-4 border-t-2 border-transparent data-[state=active]:border-on-surface data-[state=active]:text-on-surface -mt-[1px] text-secondary hover:text-on-surface transition-all rounded-none bg-transparent shadow-none">
            <Skeleton className="h-5 w-5 bg-surface-container-high dark:bg-surface-container-highest" />
          </TabsTrigger>
          <TabsTrigger value="reels" className="flex items-center gap-2 py-4 border-t-2 border-transparent data-[state=active]:border-on-surface data-[state=active]:text-on-surface -mt-[1px] text-secondary hover:text-on-surface transition-all rounded-none bg-transparent shadow-none">
            <Skeleton className="h-5 w-5 bg-surface-container-high dark:bg-surface-container-highest" />
          </TabsTrigger>
          <TabsTrigger value="tagged" className="flex items-center gap-2 py-4 border-t-2 border-transparent data-[state=active]:border-on-surface data-[state=active]:text-on-surface -mt-[1px] text-secondary hover:text-on-surface transition-all rounded-none bg-transparent shadow-none">
            <Skeleton className="h-5 w-5 bg-surface-container-high dark:bg-surface-container-highest" />
          </TabsTrigger>
        </TabsList>
      </Tabs>
      {/* Posts Grid */}
      <div className="grid grid-cols-3 gap-1 p-1">
        {[...Array(9)].map((_, i) => (
          <Skeleton key={i} className="aspect-square w-full" />
        ))}
      </div>
    </div>)
  );
}