import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon: LucideIcon;
  trend?: number;
  color?: 'primary' | 'success' | 'warning' | 'danger';
}

const colorConfig = {
  primary: {
    bg: 'bg-primary-50',
    iconBg: 'bg-primary-100',
    iconColor: 'text-primary-600',
    value: 'text-primary-600',
  },
  success: {
    bg: 'bg-success-50',
    iconBg: 'bg-success-100',
    iconColor: 'text-success-600',
    value: 'text-success-600',
  },
  warning: {
    bg: 'bg-warning-50',
    iconBg: 'bg-warning-100',
    iconColor: 'text-warning-600',
    value: 'text-warning-600',
  },
  danger: {
    bg: 'bg-danger-50',
    iconBg: 'bg-danger-100',
    iconColor: 'text-danger-600',
    value: 'text-danger-600',
  },
};

export default function StatCard({ title, value, unit, icon: Icon, trend, color = 'primary' }: StatCardProps) {
  const config = colorConfig[color];
  const trendPositive = trend !== undefined && trend >= 0;

  return (
    <div className={`card p-5 ${config.bg} border-none hover:shadow-md transition-all duration-300 hover:-translate-y-1`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-neutral-500 font-medium">{title}</p>
          <div className="flex items-baseline gap-1 mt-2">
            <span className={`text-3xl font-bold ${config.value} font-mono`}>
              {value}
            </span>
            {unit && <span className="text-sm text-neutral-500">{unit}</span>}
          </div>
          {trend !== undefined && (
            <div className={`flex items-center gap-1 mt-2 text-sm ${trendPositive ? 'text-success-600' : 'text-danger-600'}`}>
              {trendPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
              <span>{Math.abs(trend)}% 较昨日</span>
            </div>
          )}
        </div>
        <div className={`w-12 h-12 ${config.iconBg} rounded-xl flex items-center justify-center`}>
          <Icon size={24} className={config.iconColor} />
        </div>
      </div>
    </div>
  );
}
