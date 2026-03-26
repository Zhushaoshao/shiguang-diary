const LoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center py-12" role="status" aria-label="加载中">
      <div className="relative w-14 h-14">
        <div className="absolute inset-0 border-4 border-neutral-border rounded-full"></div>
        <div className="absolute inset-0 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    </div>
  );
};

export default LoadingSpinner;

