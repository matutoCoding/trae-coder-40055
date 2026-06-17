import type { ProcessStatus } from '@/types';
import { statusTextMap } from '@/utils/mock';
import { CheckCircle2, XCircle, Clock, Loader2, CircleCheck } from 'lucide-react';

interface StatusTagProps {
  status: ProcessStatus;
  showIcon?: boolean;
  size?: 'small' | 'default';
}

const statusConfig: Record<ProcessStatus, {
  className: string;
  icon: typeof Clock;
}> = {
  pending: {
    className: 'status-pending',
    icon: Clock,
  },
  processing: {
    className: 'status-processing',
    icon: Loader2,
  },
  completed: {
    className: 'status-completed',
    icon: CheckCircle2,
  },
  qualified: {
    className: 'status-qualified',
    icon: CircleCheck,
  },
  unqualified: {
    className: 'status-unqualified',
    icon: XCircle,
  },
};

export default function StatusTag({ status, showIcon = true, size = 'default' }: StatusTagProps) {
  const config = statusConfig[status];
  const Icon = config.icon;
  const text = statusTextMap[status];
  const isProcessing = status === 'processing';
  const sizeClasses = size === 'small' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-0.5 text-xs';

  return (
    <span className={`status-badge ${config.className} ${sizeClasses} gap-1`}>
      {showIcon && <Icon size={size === 'small' ? 12 : 14} className={isProcessing ? 'animate-spin' : ''} />}
      {text}
    </span>
  );
}
