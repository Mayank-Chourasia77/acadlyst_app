import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthProvider';
import { Loader2, Upload, ExternalLink, FileText } from 'lucide-react';

const uploadSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
  description: z.string().max(1000, 'Description must be less than 1000 characters').optional(),
  type: z.enum(['note', 'lecture', 'placement'], {
    required_error: 'Please select a resource type',
  }),
  external_link: z.string().optional(),
  file: z.any().optional(),
  course: z.string().min(1, 'Course is required'),
  other_course: z.string().optional(),
  subject: z.string().min(1, 'Subject is required'),
  university: z.string().optional(),
  other_university: z.string().optional(),
  creator_name: z.string().optional(),
  platform: z.string().optional(),
}).refine((data) => {
  if (data.university === 'OTHER') {
    return data.other_university && data.other_university.trim().length > 0;
  }
  return true;
}, {
  message: 'Other University Name is required',
  path: ['other_university'],
}).refine((data) => {
  if (data.course === 'OTHER') {
    return data.other_course && data.other_course.trim().length > 0;
  }
  return true;
}, {
  message: 'Other Course Name is required',
  path: ['other_course'],
}).refine((data) => {
  // For notes, either external_link or file is required
  if (data.type === 'note') {
    const hasExternalLink = data.external_link && data.external_link.trim().length > 0;
    const hasFile = data.file && data.file[0];
    if (!hasExternalLink && !hasFile) {
      return false;
    }
    return true;
  }
  // For other types, external_link is required
  return data.external_link && data.external_link.trim().length > 0;
}, {
  message: 'For notes, either provide an external link or upload a file. For other types, external link is required.',
  path: ['external_link'],
}).refine((data) => {
  // Additional validation: for notes, external_link validation should only apply if no file is uploaded
  if (data.type === 'note') {
    const hasFile = data.file && data.file[0];
    if (hasFile) return true; // If file is uploaded, external_link validation passes
    return data.external_link && data.external_link.trim().length > 0;
  }
  return true;
}, {
  message: 'External link is required when no file is uploaded.',
  path: ['external_link'],
});

type UploadFormData = z.infer<typeof uploadSchema>;

export const UploadForm = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<UploadFormData>({
    resolver: zodResolver(uploadSchema),
    defaultValues: {
      title: '',
      description: '',
      type: undefined,
      external_link: '',
      course: '',
      other_course: '',
      subject: '',
      university: '',
      other_university: '',
      creator_name: '',
      platform: '',
    },
  });

  const watchedUniversity = form.watch('university');
  const watchedCourse = form.watch('course');
  const watchedType = form.watch('type');

  const onSubmit = async (data: UploadFormData) => {
    if (!user) {
      toast({
        title: 'Authentication Error',
        description: 'You must be logged in to upload resources.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      let filePath = null;
      let externalLink = data.external_link || null;

      // Handle file upload for notes
      if (data.type === 'note' && data.file && data.file[0]) {
        const file = data.file[0];
        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}/${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('notes')
          .upload(fileName, file);

        if (uploadError) throw uploadError;
        
        filePath = fileName;
        externalLink = null; // Clear external link when file is uploaded
      }

      const { error } = await supabase
        .from('uploads')
        .insert({
          user_id: user.id,
          title: data.title,
          description: data.description || null,
          type: data.type,
          external_link: externalLink,
          file_path: filePath,
          course: data.course === 'OTHER' && data.other_course ? data.other_course.toUpperCase() : data.course,
          subject: data.subject,
          university: data.university === 'OTHER' && data.other_university ? data.other_university.toUpperCase() : (data.university || null),
          creator_name: data.creator_name || null,
          platform: data.platform || null,
        });

      if (error) throw error;

      toast({
        title: 'Success!',
        description: 'Your resource has been uploaded successfully.',
      });

      form.reset();
    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        title: 'Upload Failed',
        description: error.message || 'Failed to upload resource. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Upload className="h-5 w-5" />
          <span>Upload New Resource</span>
        </CardTitle>
        <CardDescription>
          Share your educational content with the community. All submissions are reviewed before being published.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title *</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Complete Data Structures Notes" {...field} />
                  </FormControl>
                  <FormDescription>
                    Give your resource a clear, descriptive title
                  </FormDescription>
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
                    <Textarea 
                      placeholder="Describe what's included in this resource, topics covered, etc."
                      className="resize-none"
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Optional: Provide additional details about your resource
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Resource Type *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select resource type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="note">Notes</SelectItem>
                      <SelectItem value="lecture">Lecture/Video</SelectItem>
                      <SelectItem value="placement">Placement Resource</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Choose the type that best describes your resource
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {watchedType === 'note' ? (
              <div className="space-y-4">
                <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-md">
                  For notes, you can either provide an external link OR upload a file from your device.
                </div>
                
                <FormField
                  control={form.control}
                  name="external_link"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center space-x-2">
                        <ExternalLink className="h-4 w-4" />
                        <span>External Link (Optional for notes)</span>
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="https://drive.google.com/... or https://youtube.com/..."
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Link to your notes (Google Drive, Notion, etc.)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex items-center space-x-4">
                  <div className="h-px bg-gray-300 flex-1"></div>
                  <span className="text-sm text-gray-500">OR</span>
                  <div className="h-px bg-gray-300 flex-1"></div>
                </div>

                <FormField
                  control={form.control}
                  name="file"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center space-x-2">
                        <FileText className="h-4 w-4" />
                        <span>Upload File (Optional for notes)</span>
                      </FormLabel>
                      <FormControl>
                        <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:border-muted-foreground/50 transition-colors">
                          <div className="flex flex-col items-center space-y-4">
                            <Input 
                              type="file"
                              accept=".pdf,.doc,.docx,.txt,.md"
                              onChange={(e) => field.onChange(e.target.files)}
                              className="w-full h-12 file:mr-3 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 file:cursor-pointer cursor-pointer border border-input bg-background text-left px-3 py-2"
                            />
                            <p className="text-sm text-muted-foreground">
                              Choose a file or drag and drop here
                            </p>
                            <p className="text-xs text-muted-foreground/70">
                              PDF, DOC, DOCX, TXT, MD (Max 10MB)
                            </p>
                          </div>
                        </div>
                      </FormControl>
                      <FormDescription>
                        Upload your notes directly (PDF, DOC, DOCX, TXT, MD - Max 10MB)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            ) : (
              <FormField
                control={form.control}
                name="external_link"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center space-x-2">
                      <ExternalLink className="h-4 w-4" />
                      <span>Resource Link *</span>
                    </FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="https://drive.google.com/... or https://youtube.com/..."
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Link to your resource (Google Drive, YouTube, GitHub, etc.)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {watchedType === 'lecture' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="creator_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Creator Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Neso Academy" {...field} />
                      </FormControl>
                      <FormDescription>
                        Optional: Name of the content creator.
                      </FormDescription>
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
                        <Input placeholder="e.g., YouTube" {...field} />
                      </FormControl>
                      <FormDescription>
                        Optional: Platform where the content is hosted.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="course"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Course *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select course" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="B.TECH">B.TECH</SelectItem>
                        <SelectItem value="M.TECH">M.TECH</SelectItem>
                        <SelectItem value="MBA">MBA</SelectItem>
                        <SelectItem value="BCA">BCA</SelectItem>
                        <SelectItem value="MCA">MCA</SelectItem>
                        <SelectItem value="JEE">JEE</SelectItem>
                        <SelectItem value="NEET">NEET</SelectItem>
                        <SelectItem value="OTHER">OTHER</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subject *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Data Structures" {...field} />
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
                    <FormLabel>University</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select university" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="IIT">IIT</SelectItem>
                        <SelectItem value="NIT">NIT</SelectItem>
                        <SelectItem value="IIIT">IIIT</SelectItem>
                        <SelectItem value="VIT">VIT</SelectItem>
                        <SelectItem value="DU">DU</SelectItem>
                        <SelectItem value="MU">MU</SelectItem>
                        <SelectItem value="SPPU">SPPU</SelectItem>
                        <SelectItem value="IGNOU">IGNOU</SelectItem>
                        <SelectItem value="CCSU">CCSU</SelectItem>
                        <SelectItem value="BRAOU">BRAOU</SelectItem>
                        <SelectItem value="NTA (JEE/NEET)">NTA (JEE/NEET)</SelectItem>
                        <SelectItem value="OTHER">OTHER</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {watchedCourse === 'OTHER' && (
              <FormField
                control={form.control}
                name="other_course"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Other Course Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter course name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {watchedUniversity === 'OTHER' && (
              <FormField
                control={form.control}
                name="other_university"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Other University Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter university name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Resource
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
