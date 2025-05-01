export default function Loading() {
  return (
    <main className="relative w-full h-screen bg-gray-50">
      {/* Map Loading Skeleton */}
      <div className="absolute inset-0 bg-gray-200 animate-pulse">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-16 h-16 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
      </div>

      {/* Category Filter Loading Skeleton */}
      <div className="absolute bottom-4 right-4 p-4 bg-white rounded-lg shadow-lg">
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-24 h-4 bg-gray-200 rounded animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
