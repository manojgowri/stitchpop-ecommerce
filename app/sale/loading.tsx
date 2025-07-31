export default function Loading() {
  return (
    <div className="min-h-screen">
      <div className="animate-pulse">
        {/* Hero Section Skeleton */}
        <div className="bg-gray-300 h-96"></div>

        {/* Featured Deals Section Skeleton */}
        <div className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="h-8 bg-gray-300 rounded w-64 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-300 rounded w-48 mx-auto mb-12"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-gray-300 h-80 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>

        {/* All Sale Products Section Skeleton */}
        <div className="py-16">
          <div className="container mx-auto px-4">
            <div className="h-8 bg-gray-300 rounded w-64 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-300 rounded w-48 mx-auto mb-12"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="bg-gray-300 h-80 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
