import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users as UsersIcon } from 'lucide-react';

const fetchStats = async () => {
    const { count: userCount, error: userError } = await supabase.from('users').select('*', { count: 'exact', head: true });
    const { count: noteCount, error: noteError } = await supabase.from('uploads').select('*', { count: 'exact', head: true }).eq('type', 'note');
    const { count: lectureCount, error: lectureError } = await supabase.from('uploads').select('*', { count: 'exact', head: true }).eq('type', 'lecture');
    const { count: placementCount, error: placementError } = await supabase.from('uploads').select('*', { count: 'exact', head: true }).eq('type', 'placement');
    const { count: groupCount, error: groupError } = await supabase.from('groups').select('*', { count: 'exact', head: true });
    
    const anyError = userError || noteError || lectureError || placementError || groupError;
    if (anyError) {
        console.error('Failed to fetch stats:', { userError, noteError, lectureError, placementError, groupError });
        throw new Error('Failed to fetch platform stats.');
    }

    return { userCount, noteCount, lectureCount, placementCount, groupCount };
};

const StatCard = ({ title, value, icon: Icon }: {title: string, value: number | null | undefined, icon?: React.ElementType}) => (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold">{value ?? '...'}</div>
        </CardContent>
    </Card>
);

export const AdminAnalytics = () => {
    const { data: stats, isLoading, isError, error } = useQuery({
        queryKey: ['admin-stats'],
        queryFn: fetchStats,
    });

    if (isLoading) return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            {[...Array(5)].map((_, i) => (
                <Card key={i}>
                    <CardHeader>
                        <div className="h-4 bg-gray-200 rounded w-20 mb-2 animate-pulse"></div>
                    </CardHeader>
                    <CardContent>
                        <div className="h-8 bg-gray-200 rounded w-12 animate-pulse"></div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );

    if (isError) return <div>Error loading stats: {error?.message}</div>

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            <StatCard title="Total Users" value={stats?.userCount} icon={UsersIcon} />
            <StatCard title="Total Notes" value={stats?.noteCount} />
            <StatCard title="Total Lectures" value={stats?.lectureCount} />
            <StatCard title="Total Placements" value={stats?.placementCount} />
            <StatCard title="Total Groups" value={stats?.groupCount} />
        </div>
    );
};
