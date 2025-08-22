import React from 'react';

const SkeletonLoader = () => {
  return (
    <div className="animate-pulse">
      {/* Image Skeleton */}
      <div className="h-[340px] w-full bg-gray-300 rounded-xl"></div>
      
      <div className="flex justify-between items-center mt-5">
        <div className="flex flex-col gap-3 w-2/3">
          {/* Title Skeleton */}
          <div className="h-8 bg-gray-300 rounded-md w-3/4"></div>
          {/* Tags Skeleton */}
          <div className="flex gap-3 mt-2">
            <div className="h-8 w-24 bg-gray-300 rounded-full"></div>
            <div className="h-8 w-28 bg-gray-300 rounded-full"></div>
            <div className="h-8 w-32 bg-gray-300 rounded-full"></div>
          </div>
        </div>
        {/* Share Button Skeleton */}
        <div className="h-12 w-12 bg-gray-300 rounded-full"></div>
      </div>

      {/* Hotel Section Skeleton */}
      <div className="mt-8">
        <div className="h-7 bg-gray-300 rounded-md w-1/3 mb-4"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex flex-col gap-2">
              <div className="h-40 bg-gray-300 rounded-xl"></div>
              <div className="h-5 bg-gray-300 rounded-md w-5/6"></div>
              <div className="h-4 bg-gray-300 rounded-md w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Itinerary Section Skeleton */}
      <div className="mt-8">
        <div className="h-7 bg-gray-300 rounded-md w-1/4 mb-4"></div>
        <div className="space-y-6">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="p-4 border border-gray-200 rounded-xl">
              <div className="h-6 bg-gray-300 rounded-md w-1/2 mb-4"></div>
              <div className="grid md:grid-cols-2 gap-5">
                {[...Array(2)].map((_, j) => (
                  <div key={j} className="flex gap-4">
                    <div className="h-24 w-24 bg-gray-300 rounded-lg"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-5 bg-gray-300 rounded-md"></div>
                      <div className="h-4 bg-gray-300 rounded-md w-5/6"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SkeletonLoader;
