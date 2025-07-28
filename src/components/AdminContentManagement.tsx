
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Trash2, Edit as EditIcon, Eye, EyeOff } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { EditUploadForm } from './EditUploadForm';

type UploadType = 'note' | 'lecture' | 'placement';

type Upload = {
  id: string;
  title: string;
  description?: string | null;
  type: UploadType;
  votes: number;
  flags: number;
  is_hidden: boolean;
  created_at: string;
  users: {
    name: string | null;
  } | null;
  company_name?: string | null;
  company_role?: string | null;
  difficulty?: 'Easy' | 'Medium' | 'Hard' | null;
};

const fetchUploads = async (filter?: 'flagged', type: UploadType | 'all' = 'all'): Promise<Upload[]> => {
    let query = supabase
        .from('uploads')
        .select(`
            id, title, description, type, votes, flags, is_hidden, created_at,
            company_name, company_role, difficulty,
            users ( name )
        `);

    if (filter === 'flagged') {
        query = query.gt('flags', 0).order('flags', { ascending: false });
    } else {
        query = query.order('created_at', { ascending: false });
    }

    if (type && type !== 'all') {
        query = query.eq('type', type);
    }
    
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data as Upload[];
};

export const AdminContentManagement = ({ filter }: { filter?: 'flagged' }) => {
    const queryClient = useQueryClient();
    const { toast } = useToast();
    const queryKey = filter === 'flagged' ? 'admin-flagged-uploads' : 'admin-uploads';
    const [typeFilter, setTypeFilter] = useState<UploadType | 'all'>('all');
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [selectedUpload, setSelectedUpload] = useState<Upload | null>(null);

    const { data: uploads, isLoading, isError, error } = useQuery({
        queryKey: [queryKey, typeFilter],
        queryFn: () => fetchUploads(filter, typeFilter),
    });

    const deleteMutation = useMutation({
        mutationFn: async (uploadId: string) => {
            const { error } = await supabase.from('uploads').delete().eq('id', uploadId);
            if (error) throw error;
        },
        onSuccess: () => {
            toast({ title: "Success", description: "Content deleted." });
            queryClient.invalidateQueries({ queryKey: ['admin-uploads'] });
            queryClient.invalidateQueries({ queryKey: ['admin-flagged-uploads'] });
            queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
        },
        onError: (err: Error) => {
            toast({ title: "Error", description: err.message, variant: "destructive" });
        }
    });

    const toggleVisibilityMutation = useMutation({
        mutationFn: async ({ uploadId, is_hidden }: { uploadId: string, is_hidden: boolean }) => {
            const { error } = await supabase.from('uploads').update({ is_hidden: !is_hidden }).eq('id', uploadId);
            if (error) throw error;
        },
        onSuccess: () => {
            toast({ title: "Success", description: "Content visibility updated." });
            queryClient.invalidateQueries({ queryKey: ['admin-uploads'] });
            queryClient.invalidateQueries({ queryKey: ['admin-flagged-uploads'] });
        },
        onError: (err: Error) => {
            toast({ title: "Error", description: err.message, variant: "destructive" });
        }
    });

    const handleTypeChange = (value: string) => {
        setTypeFilter(value as UploadType | 'all');
    };

    const handleEditClick = (upload: Upload) => {
        setSelectedUpload(upload);
        setIsEditDialogOpen(true);
    };

    if (isLoading) return <div>Loading content...</div>;
    if (isError) return <div>Error: {error?.message}</div>;

    return (
        <div>
            {!filter && (
                <div className="flex justify-end mb-4">
                    <Select value={typeFilter} onValueChange={handleTypeChange}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Filter by type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Types</SelectItem>
                            <SelectItem value="note">Notes</SelectItem>
                            <SelectItem value="lecture">Lectures</SelectItem>
                            <SelectItem value="placement">Placements</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            )}
            <div className="rounded-lg border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>User</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Votes</TableHead>
                            <TableHead>Flags</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {uploads?.map(upload => (
                            <TableRow key={upload.id}>
                                <TableCell className="font-medium max-w-xs truncate">{upload.title}</TableCell>
                                <TableCell><Badge variant="outline">{upload.type}</Badge></TableCell>
                                <TableCell>{upload.users?.name ?? 'N/A'}</TableCell>
                                <TableCell>
                                    {upload.is_hidden ? (
                                        <Badge variant="destructive">Hidden</Badge>
                                    ) : (
                                        <Badge variant="default" className="bg-green-600">Visible</Badge>
                                    )}
                                </TableCell>
                                <TableCell>{upload.votes}</TableCell>
                                <TableCell>{upload.flags}</TableCell>
                                <TableCell className="text-right space-x-2">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        title={upload.is_hidden ? 'Make Visible' : 'Hide Content'}
                                        onClick={() => toggleVisibilityMutation.mutate({ uploadId: upload.id, is_hidden: upload.is_hidden })}
                                    >
                                        {upload.is_hidden ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        title="Edit"
                                        onClick={() => handleEditClick(upload)}
                                    >
                                        <EditIcon className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        title="Delete"
                                        onClick={() => deleteMutation.mutate(upload.id)}
                                    >
                                        <Trash2 className="h-4 w-4 text-red-500" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            {selectedUpload && (
                <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>Edit Upload</DialogTitle>
                        </DialogHeader>
                        <EditUploadForm 
                            upload={selectedUpload} 
                            onClose={() => {
                                setIsEditDialogOpen(false);
                                setSelectedUpload(null);
                            }} 
                        />
                    </DialogContent>
                </Dialog>
            )}
        </div>
    )
};
