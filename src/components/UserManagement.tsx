
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { User as UserIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

type UserProfile = {
    id: string;
    name: string | null;
    email: string | null;
    is_admin: boolean;
    total_uploads: number | null;
    total_votes: number | null;
    upi_link: string | null;
    user_badges: { count: number }[] | null;
};

const fetchUsers = async (): Promise<UserProfile[]> => {
  const { data, error } = await supabase
    .from('users')
    .select('id, name, email, is_admin, total_uploads, total_votes, upi_link, user_badges(count)')
    .order('created_at', { ascending: false });
    
  if (error) {
    throw new Error(error.message);
  }
  return data as UserProfile[];
};

export const UserManagement = () => {
  const { data: users, isLoading, isError, error } = useQuery({
    queryKey: ['admin-users'],
    queryFn: fetchUsers,
  });

  if (isLoading) {
    return <div>Loading users...</div>;
  }

  if (isError) {
    return <div>Error loading users: {error.message}</div>;
  }

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Uploads</TableHead>
            <TableHead>Votes</TableHead>
            <TableHead>Badges</TableHead>
            <TableHead className="text-right">UPI Link</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users?.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">{user.name || 'N/A'}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                {user.is_admin ? (
                  <Badge variant="default" className="bg-green-600 hover:bg-green-700">
                    <UserIcon className="mr-1 h-4 w-4" /> Admin
                  </Badge>
                ) : (
                  <Badge variant="secondary">
                    <UserIcon className="mr-1 h-4 w-4" /> User
                  </Badge>
                )}
              </TableCell>
              <TableCell>{user.total_uploads ?? 0}</TableCell>
              <TableCell>{user.total_votes ?? 0}</TableCell>
              <TableCell>{user.user_badges?.[0]?.count ?? 0}</TableCell>
              <TableCell className="text-right">
                {user.upi_link ? <a href={user.upi_link} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">View</a> : 'N/A'}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
