
import React, { useState } from 'react';
import { useAdmin } from '@/hooks/useAdmin';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CreateGroupForm } from '@/components/CreateGroupForm';
import { UserManagement } from '@/components/UserManagement';
import { AdminAnalytics } from './../components/AdminAnalytics';
import { AdminContentManagement } from './../components/AdminContentManagement';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import type { Tables } from '@/integrations/supabase/types';

type Group = Tables<'groups'>;

const ManageGroups = () => {
    const { toast } = useToast();
    const queryClient = useQueryClient();

    const { data: groups, isLoading, error } = useQuery<Group[]>({
        queryKey: ['all-groups-admin'],
        queryFn: async () => {
            const { data, error } = await supabase.from('groups').select('*').order('name');
            if (error) throw error;
            return data || [];
        }
    });

    const deleteGroupMutation = useMutation({
        mutationFn: async (groupId: string) => {
            const { error } = await supabase.from('groups').delete().eq('id', groupId);
            if (error) throw error;
        },
        onSuccess: () => {
            toast({ title: 'Group deleted successfully' });
            queryClient.invalidateQueries({ queryKey: ['all-groups-admin'] });
            queryClient.invalidateQueries({ queryKey: ['groups'] });
        },
        onError: (error: any) => {
            toast({
                title: 'Error deleting group',
                description: error.message,
                variant: 'destructive',
            });
        }
    });

    if (isLoading) {
        return <div className="mt-6 text-center">Loading groups...</div>;
    }

    if (error) {
        return <div className="mt-6 text-center text-red-500">Failed to load groups.</div>;
    }

    return (
        <div className="space-y-4 mt-6 pt-6 border-t">
            <h3 className="text-xl font-semibold">Existing Groups</h3>
            {groups && groups.length > 0 ? (
                <ul className="space-y-2">
                    {groups.map(group => (
                        <li key={group.id} className="flex items-center justify-between p-3 border rounded-md bg-background gap-4">
                            <div className="flex-grow">
                                <p className="font-medium">{group.name}</p>
                                {group.description && <p className="text-sm text-muted-foreground truncate">{group.description}</p>}
                            </div>
                            <Button
                                variant="destructive"
                                size="icon"
                                onClick={() => {
                                    if(window.confirm(`Are you sure you want to delete the group "${group.name}"? This action cannot be undone.`)) {
                                        deleteGroupMutation.mutate(group.id)
                                    }
                                }}
                                disabled={deleteGroupMutation.isPending && deleteGroupMutation.variables === group.id}
                                aria-label={`Delete ${group.name}`}
                                className="shrink-0"
                            >
                                {deleteGroupMutation.isPending && deleteGroupMutation.variables === group.id ? (
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div> 
                                ) : (
                                    <Trash2 className="h-4 w-4" />
                                )}
                            </Button>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-muted-foreground">No groups have been created yet.</p>
            )}
        </div>
    );
};

const AdminDashboard = () => {
  const { isAdmin, isLoading } = useAdmin();
  const [activeView, setActiveView] = useState('analytics');

  if (isLoading) {
    return <div className="p-8">Checking admin status...</div>;
  }

  if (!isAdmin) {
    return (
      <div className="container mx-auto py-8 text-center">
        <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
        <p className="text-muted-foreground mt-2">
          You do not have permission to view this page.
        </p>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeView) {
      case 'analytics':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Platform Analytics</CardTitle>
              <CardDescription>An overview of key metrics across the platform.</CardDescription>
            </CardHeader>
            <CardContent>
              <AdminAnalytics />
            </CardContent>
          </Card>
        );
      case 'users':
        return (
            <Card>
                <CardHeader>
                    <CardTitle>User Overview</CardTitle>
                    <CardDescription>View all registered users and their stats. Admin promotion must be done via the database.</CardDescription>
                </CardHeader>
                <CardContent>
                    <UserManagement />
                </CardContent>
            </Card>
        );
      case 'content':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Content Management</CardTitle>
              <CardDescription>View, manage, and moderate all user-generated content.</CardDescription>
            </CardHeader>
            <CardContent>
              <AdminContentManagement />
            </CardContent>
          </Card>
        );
      case 'groups':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Manage Groups</CardTitle>
              <CardDescription>Create new groups for universities and courses, or delete existing ones.</CardDescription>
            </CardHeader>
            <CardContent>
              <CreateGroupForm />
              <ManageGroups />
            </CardContent>
          </Card>
        );
      case 'moderation':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Content Moderation</CardTitle>
              <CardDescription>Review content that has been flagged by users.</CardDescription>
            </CardHeader>
            <CardContent>
              <AdminContentManagement filter="flagged" />
            </CardContent>
          </Card>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <div className="w-[200px]">
          <Select value={activeView} onValueChange={setActiveView}>
            <SelectTrigger>
              <SelectValue placeholder="Select a section" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="analytics">Analytics</SelectItem>
              <SelectItem value="users">Users</SelectItem>
              <SelectItem value="content">Content</SelectItem>
              <SelectItem value="groups">Groups</SelectItem>
              <SelectItem value="moderation">Moderation</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="mt-4">{renderContent()}</div>
    </div>
  );
};

export default AdminDashboard;
