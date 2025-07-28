
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';

const groupSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters long.'),
  description: z.string().optional(),
  university: z.string().optional(),
  telegram_link: z.string().url('Please enter a valid URL.').optional().or(z.literal('')),
  whatsapp_link: z.string().url('Please enter a valid URL.').optional().or(z.literal('')),
  is_official: z.boolean().default(false),
});

type GroupFormValues = z.infer<typeof groupSchema>;

export const CreateGroupForm = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);

  const form = useForm<GroupFormValues>({
    resolver: zodResolver(groupSchema),
    defaultValues: {
      name: '',
      description: '',
      university: '',
      telegram_link: '',
      whatsapp_link: '',
      is_official: false,
    },
  });

  const onSubmit = async (values: GroupFormValues) => {
    setLoading(true);
    try {
      const { error } = await supabase.from('groups').insert([
        {
          name: values.name,
          description: values.description || null,
          university: values.university || null,
          telegram_link: values.telegram_link || null,
          whatsapp_link: values.whatsapp_link || null,
          is_official: values.is_official,
        },
      ]);

      if (error) {
        throw error;
      }

      toast({
        title: 'Group Created!',
        description: `The group "${values.name}" has been created successfully.`,
      });
      form.reset();
      queryClient.invalidateQueries({ queryKey: ['groups'] });
    } catch (error: any) {
      toast({
        title: 'Error creating group',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Group Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., DSA Wizards" {...field} />
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
                <Textarea placeholder="A short description of the group" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="university"
          render={({ field }) => (
            <FormItem>
              <FormLabel>University (optional)</FormLabel>
              <FormControl>
                <Input placeholder="e.g., IIT Bombay" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="telegram_link"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Telegram Link (optional)</FormLabel>
              <FormControl>
                <Input placeholder="https://t.me/..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="whatsapp_link"
          render={({ field }) => (
            <FormItem>
              <FormLabel>WhatsApp Link (optional)</FormLabel>
              <FormControl>
                <Input placeholder="https://chat.whatsapp.com/..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="is_official"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Official Group</FormLabel>
                <FormDescription>
                  Mark this group as official.
                </FormDescription>
              </div>
            </FormItem>
          )}
        />
        <Button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create Group'}
        </Button>
      </form>
    </Form>
  );
};
