
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from '@/components/ui/textarea';

type Upload = {
    id: string;
    title: string;
    description?: string | null;
    type: 'note' | 'lecture' | 'placement';
    company_name?: string | null;
    company_role?: string | null;
    difficulty?: 'Easy' | 'Medium' | 'Hard' | null;
    creator_name?: string | null;
    platform?: string | null;
};

const formSchema = z.object({
  title: z.string().min(1, 'Title is required.'),
  description: z.string().optional(),
  company_name: z.string().optional(),
  company_role: z.string().optional(),
  difficulty: z.enum(['Easy', 'Medium', 'Hard']).nullable().optional(),
  creator_name: z.string().optional(),
  platform: z.string().optional(),
});

type EditUploadFormProps = {
  upload: Upload;
  onClose: () => void;
};

export const EditUploadForm = ({ upload, onClose }: EditUploadFormProps) => {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: upload.title,
            description: upload.description ?? '',
            company_name: upload.company_name ?? '',
            company_role: upload.company_role ?? '',
            difficulty: upload.difficulty ?? null,
            creator_name: upload.creator_name ?? '',
            platform: upload.platform ?? '',
        },
    });

    const updateMutation = useMutation({
        mutationFn: async (values: z.infer<typeof formSchema>) => {
            const updatePayload: { [key: string]: any } = {
                title: values.title,
                description: values.description || null,
            };

            if (upload.type === 'placement') {
                updatePayload.company_name = values.company_name || null;
                updatePayload.company_role = values.company_role || null;
                updatePayload.difficulty = values.difficulty || null;
            }

            if (upload.type === 'lecture') {
                updatePayload.creator_name = values.creator_name || null;
                updatePayload.platform = values.platform || null;
            }

            const { error } = await supabase
                .from('uploads')
                .update(updatePayload)
                .eq('id', upload.id);

            if (error) throw error;
        },
        onSuccess: () => {
            toast({ title: 'Success', description: 'Upload updated successfully.' });
            queryClient.invalidateQueries({ queryKey: ['admin-uploads'] });
            queryClient.invalidateQueries({ queryKey: ['admin-flagged-uploads'] });
            onClose();
        },
        onError: (err: Error) => {
            toast({ title: 'Error', description: err.message, variant: 'destructive' });
        },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        updateMutation.mutate(values);
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Textarea {...field} value={field.value ?? ''} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {upload.type === 'placement' && (
                    <>
                        <FormField
                            control={form.control}
                            name="company_name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Company Name</FormLabel>
                                    <FormControl>
                                        <Input {...field} value={field.value ?? ''} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="company_role"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Role</FormLabel>
                                    <FormControl>
                                        <Input {...field} value={field.value ?? ''} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="difficulty"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Difficulty</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value ?? undefined}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select difficulty" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="Easy">Easy</SelectItem>
                                            <SelectItem value="Medium">Medium</SelectItem>
                                            <SelectItem value="Hard">Hard</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </>
                )}

                {upload.type === 'lecture' && (
                    <>
                        <FormField
                            control={form.control}
                            name="creator_name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Creator Name</FormLabel>
                                    <FormControl>
                                        <Input {...field} value={field.value ?? ''} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="platform"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Platform</FormLabel>
                                    <FormControl>
                                        <Input {...field} value={field.value ?? ''} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </>
                )}

                <div className="flex justify-end space-x-2 pt-4">
                    <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
                    <Button type="submit" disabled={updateMutation.isPending}>
                        {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
                    </Button>
                </div>
            </form>
        </Form>
    );
};
