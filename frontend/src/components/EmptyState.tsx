import { FileText } from 'lucide-react';

interface EmptyStateProps {
  message?: string;
  description?: string;
}

const EmptyState = ({
  message = '暂无日记',
  description = '开始记录你的生活点滴吧'
}: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4">
      <div className="w-24 h-24 bg-accent-yellow rounded-xl flex items-center justify-center mb-6 shadow-neu">
        <FileText size={48} strokeWidth={1.5} className="text-primary-500" />
      </div>
      <h3 className="text-xl font-semibold text-neutral-text mb-2">{message}</h3>
      <p className="text-neutral-secondary text-center max-w-md text-sm">{description}</p>
    </div>
  );
};

export default EmptyState;

