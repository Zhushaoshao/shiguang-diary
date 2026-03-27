interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  inline?: boolean;
}

const LoadingSpinner = ({ size = 'lg', inline = false }: LoadingSpinnerProps) => {
  const sizeMap = {
    sm: {
      wrapper: 'w-4 h-4',
      border: 'border-2',
      padding: 'py-0',
    },
    md: {
      wrapper: 'w-8 h-8',
      border: 'border-3',
      padding: 'py-4',
    },
    lg: {
      wrapper: 'w-14 h-14',
      border: 'border-4',
      padding: 'py-12',
    },
  } as const;

  const current = sizeMap[size];

  return (
    <div
      className={`flex justify-center items-center ${inline ? '' : current.padding}`}
      role="status"
      aria-label="加载中"
    >
      <div className={`relative ${current.wrapper}`}>
        <div className={`absolute inset-0 ${current.border} border-neutral-border rounded-full`} />
        <div className={`absolute inset-0 ${current.border} border-primary-500 border-t-transparent rounded-full animate-spin`} />
      </div>
    </div>
  );
};

export default LoadingSpinner;

