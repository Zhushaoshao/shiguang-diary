const HomeSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="card-paper p-0 overflow-hidden pointer-events-none"
          aria-hidden="true"
        >
          <div className="h-52 bg-neutral-border/40 animate-pulse" />
          <div className="p-5 space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div className="h-6 w-24 rounded-md bg-neutral-border/50 animate-pulse" />
              <div className="h-5 w-16 rounded-full bg-primary-100/70 animate-pulse" />
            </div>
            <div className="space-y-3">
              <div className="h-7 w-4/5 rounded-md bg-neutral-border/50 animate-pulse" />
              <div className="h-4 w-full rounded-md bg-neutral-border/40 animate-pulse" />
              <div className="h-4 w-11/12 rounded-md bg-neutral-border/40 animate-pulse" />
              <div className="h-4 w-3/4 rounded-md bg-neutral-border/40 animate-pulse" />
            </div>
            <div className="flex items-center justify-between pt-2">
              <div className="h-4 w-24 rounded-md bg-neutral-border/40 animate-pulse" />
              <div className="h-4 w-16 rounded-md bg-neutral-border/40 animate-pulse" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default HomeSkeleton;

