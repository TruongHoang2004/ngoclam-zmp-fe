import * as React from 'react';
import { FilterX } from 'lucide-react';
import { cn } from '@/lib/utils'; // Assuming you have this utility function

interface EmptyStateProps {
    title?: string;
    description?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
    title = 'No data found!',
    description = 'Please check your filters and try again.',
}) => {
    return (
        <div className={cn(
            'flex flex-col items-center justify-center text-center mt-30 opacity-70',
            // Dynamic colors are handled by Tailwind CSS dark mode and utility classes
            'text-slate-700 dark:text-slate-400'
        )}>
            <FilterX size={60} className="mb-4" />
            <h3 className="text-xl font-semibold">{title}</h3>
            <p className="text-sm">{description}</p>
        </div>
    );
};

export default EmptyState;