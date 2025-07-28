import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, ExternalLink, User, Calendar, Filter, AtSign, Clapperboard } from 'lucide-react';
import { VotingButtons } from './VotingButtons';
import { ClickableUsername } from './ClickableUsername';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FileViewer } from './FileViewer';

interface Upload {
  id: string;
  title: string;
  description?: string;
  type: 'note' | 'lecture' | 'placement';
  external_link: string | null;
  file_path: string | null;
  course: string;
  subject: string;
  university: string;
  votes: number;
  created_at: string;
  user_id: string; // Add user_id to the interface
  users: {
    name: string;
    username: string;
  } | null;
  creator_name?: string | null;
  platform?: string | null;
}

export const TrendingSection = () => {
  const [typeFilter, setTypeFilter] = useState('all');
  const [courseFilter, setCourseFilter] = useState('all');
  const [universityFilter, setUniversityFilter] = useState('all');

  const { data: uploads, isLoading } = useQuery({
    queryKey: ['trending-uploads', typeFilter, courseFilter, universityFilter],
    queryFn: async () => {
      let query = supabase
        .from('uploads')
        .select(`
          id,
          title,
          description,
          type,
          external_link,
          file_path,
          course,
          subject,
          university,
          votes,
          created_at,
          creator_name,
          platform,
          user_id,
          users (
            name,
            username
          )
        `)
        .eq('is_hidden', false);

      if (typeFilter !== 'all') {
        query = query.eq('type', typeFilter as Upload['type']);
      }
      if (courseFilter !== 'all') {
        query = query.eq('course', courseFilter);
      }
      if (universityFilter !== 'all') {
        query = query.eq('university', universityFilter);
      }

      const { data, error } = await query
        .order('votes', { ascending: false })
        .limit(6);

      if (error) throw error;
      return data as Upload[];
    },
  });

  const { data: filterOptions } = useQuery({
    queryKey: ['filter-options'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('uploads')
        .select('course, university, type')
        .eq('is_hidden', false);

      if (error) throw error;

      const courses = [...new Set(data.map(item => item.course))];
      const universities = [...new Set(data.map(item => item.university))];
      const types = [...new Set(data.map(item => item.type))];

      return { courses, universities, types };
    },
  });

  if (isLoading) {
    return (
      <section>
        <div className="flex items-center mb-8">
          <TrendingUp className="h-6 w-6 text-orange-500 mr-2" />
          <h2 className="text-3xl font-bold text-gray-900">Trending This Week</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
                <div className="h-6 bg-gray-200 rounded"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-32"></div>
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    );
  }

  if (!uploads || uploads.length === 0) {
    return (
      <section>
        <div className="flex items-center mb-8">
          <TrendingUp className="h-6 w-6 text-orange-500 mr-2" />
          <h2 className="text-3xl font-bold text-gray-900">Trending This Week</h2>
        </div>
        <div className="text-center py-12">
          <p className="text-gray-500">No uploads found matching your filters.</p>
        </div>
      </section>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 14) return '1 week ago';
    return `${Math.floor(diffDays / 7)} weeks ago`;
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'note': return 'Notes';
      case 'lecture': return 'Lecture';
      case 'placement': return 'Placement';
      default: return type;
    }
  };

  return (
    <section>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <TrendingUp className="h-6 w-6 text-orange-500 mr-2" />
          <h2 className="text-3xl font-bold text-gray-900">Trending This Week</h2>
        </div>
      </div>

      {/* Enhanced Filters */}
      <div className="bg-white rounded-lg p-6 shadow-sm mb-8">
        <div className="flex items-center mb-4">
          <Filter className="h-5 w-5 text-gray-500 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger>
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {filterOptions?.types.map((type) => (
                <SelectItem key={type} value={type}>
                  {getTypeLabel(type)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={courseFilter} onValueChange={setCourseFilter}>
            <SelectTrigger>
              <SelectValue placeholder="All Courses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Courses</SelectItem>
              {filterOptions?.courses.map((course) => (
                <SelectItem key={course} value={course}>
                  {course}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={universityFilter} onValueChange={setUniversityFilter}>
            <SelectTrigger>
              <SelectValue placeholder="All Universities" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Universities</SelectItem>
              {filterOptions?.universities.map((university) => (
                <SelectItem key={university} value={university}>
                  {university}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button 
            variant="outline" 
            onClick={() => {
              setTypeFilter('all');
              setCourseFilter('all');
              setUniversityFilter('all');
            }}
          >
            Clear Filters
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {uploads?.map((upload) => (
          <Card key={upload.id} className="hover:shadow-lg transition-shadow h-full flex flex-col">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <Badge variant="secondary">{getTypeLabel(upload.type)}</Badge>
              </div>
              <CardTitle className="text-lg leading-tight line-clamp-2 mt-2">
                {upload.title}
              </CardTitle>
              <div className="h-10 mt-2">
                {upload.description ? (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {upload.description}
                  </p>
                ) : (
                  <div className="h-full"></div>
                )}
              </div>
            </CardHeader>
            
            <CardContent className="flex-1 flex flex-col justify-between space-y-4 pt-0">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <User className="h-4 w-4" />
                    <ClickableUsername
                      username={upload.users?.username || ''}
                      displayName={upload.users?.name || 'Anonymous'}
                      userId={upload.user_id}
                      className="text-sm"
                    />
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(upload.created_at)}</span>
                  </div>
                </div>

                {upload.type === 'lecture' && (
                  <div className="text-sm text-muted-foreground space-y-1 p-3 bg-muted/50 rounded-md">
                    <div className="flex items-center space-x-2">
                      <AtSign className="h-4 w-4" />
                      <span>{upload.creator_name || '---'}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clapperboard className="h-4 w-4" />
                      <span>{upload.platform || '---'}</span>
                    </div>
                  </div>
                )}
                
                <div className="text-sm text-muted-foreground p-2 bg-muted/30 rounded-md">
                  <div className="font-medium">{upload.course} • {upload.subject}</div>
                  {upload.university && (
                    <div className="text-xs mt-1">{upload.university}</div>
                  )}
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-2 border-t">
                <VotingButtons 
                  uploadId={upload.id} 
                  initialVotes={upload.votes} 
                />
                {upload.type === 'note' ? (
                  <FileViewer
                    filePath={upload.file_path || ''}
                    fileName={upload.title}
                    uploadTitle={upload.title}
                    externalLink={upload.external_link}
                  >
                    <Button 
                      variant="outline" 
                      size="sm"
                    >
                      <ExternalLink className="h-4 w-4 mr-1" />
                      View
                    </Button>
                  </FileViewer>
                ) : (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => window.open(upload.external_link || '', '_blank')}
                  >
                    <ExternalLink className="h-4 w-4 mr-1" />
                    View
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};
