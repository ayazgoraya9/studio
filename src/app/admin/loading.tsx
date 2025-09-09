
export default function AdminLoading() {
  return (
    <div className="space-y-6 animate-pulse">
        <div>
            <div className="h-8 w-1/3 bg-muted rounded-md mb-2"></div>
            <div className="h-4 w-1/2 bg-muted rounded-md"></div>
        </div>
        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="border bg-card rounded-lg p-6">
                <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div className="h-4 bg-muted rounded w-2/4" />
                    <div className="h-4 w-4 bg-muted rounded" />
                </div>
                <div>
                    <div className="h-7 w-1/4 bg-muted rounded mb-2" />
                    <div className="h-3 w-3/4 bg-muted rounded" />
                </div>
              </div>
            ))}
        </div>
    </div>
  );
}
