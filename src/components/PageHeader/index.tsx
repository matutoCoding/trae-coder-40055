import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  extra?: ReactNode;
}

export default function PageHeader({ title, description, icon: Icon, extra }: PageHeaderProps) {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {Icon && (
            <div className="w-10 h-10 bg-primary-100 text-primary-600 rounded-lg flex items-center justify-center">
              <Icon size={22} />
            </div>
          )}
          <div>
            <h1 className="text-xl font-bold text-neutral-700">{title}</h1>
            {description && (
              <p className="text-sm text-neutral-500 mt-0.5">{description}</p>
            )}
          </div>
        </div>
        {extra && <div>{extra}</div>}
      </div>
    </div>
  );
}
