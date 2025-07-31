export default function Loading() {
  return (
    <div className="min-h-screen">
      <div className="animate-pulse">
        {/* Header Skeleton */}
        <div className="bg-gray-300 h-32"></div>

        {/* Filter and Products Section Skeleton */}
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Skeleton */}
            <div className="space-y-6">
              <div className="h-6 bg-gray-300 rounded w-24"></div>
              <div className="space-y-2">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-4 bg-gray-300 rounded w-32"></div>
                ))}
              </div>
            </div>

            {/* Products Grid Skeleton */}
            <div className="lg:col-span-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(9)].map((_, i) => (
                  <div key={i} className="bg-gray-300 h-80 rounded-lg"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
