export default function Loading() {
  return (
    <div className="min-h-screen">
      <div className="animate-pulse">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Image Gallery Skeleton */}
            <div className="space-y-4">
              <div className="bg-gray-300 h-96 rounded-lg"></div>
              <div className="grid grid-cols-4 gap-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="bg-gray-300 h-20 rounded"></div>
                ))}
              </div>
            </div>

            {/* Product Info Skeleton */}
            <div className="space-y-6">
              <div className="h-8 bg-gray-300 rounded w-3/4"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2"></div>
              <div className="h-6 bg-gray-300 rounded w-1/4"></div>
              <div className="space-y-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-4 bg-gray-300 rounded"></div>
                ))}
              </div>
              <div className="h-12 bg-gray-300 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
