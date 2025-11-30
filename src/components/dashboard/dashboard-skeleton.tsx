export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div className="h-8 w-32 bg-gray-200 rounded animate-pulse" />
        <div className="h-8 w-20 bg-gray-200 rounded animate-pulse" />
      </div>

      {/* Public URL card skeleton */}
      <div className="border rounded-lg p-6 space-y-4">
        <div className="space-y-2">
          <div className="h-6 w-28 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-96 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg border">
          <div className="h-4 w-80 bg-gray-200 rounded animate-pulse" />
          <div className="flex gap-2">
            <div className="h-8 w-20 bg-gray-200 rounded animate-pulse" />
            <div className="h-8 w-16 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
      </div>

      {/* Stats card skeleton */}
      <div className="border rounded-lg p-6 space-y-4">
        <div className="h-6 w-48 bg-gray-200 rounded animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-gray-50 rounded-lg p-4 text-center space-y-3">
              <div className="h-6 w-6 bg-gray-200 rounded mx-auto animate-pulse" />
              <div className="h-8 w-8 bg-gray-200 rounded mx-auto animate-pulse" />
              <div className="h-4 w-20 bg-gray-200 rounded mx-auto animate-pulse" />
              <div className="h-3 w-24 bg-gray-200 rounded mx-auto animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
