import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ExternalLink, Filter, Search, Calendar, User, ShieldAlert } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { VotingButtons } from '@/components/VotingButtons';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '@/components/AuthProvider';
import { useAdmin } from '@/hooks/useAdmin';
import { ClickableUsername } from '@/components/ClickableUsername';
import { FileViewer } from '@/components/FileViewer';

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
  users: {
    name: string;
    username: string;
  } | null;
  user_id: string;
  is_hidden: boolean;
}

const Notes = () => {
  const [searchParams] = useSearchParams();
  const [course, setCourse] = useState(searchParams.get('course') || 'all');
  const [subject, setSubject] = useState('all');
  const [university, setUniversity] = useState(searchParams.get('university') || 'all');
  const [sortBy, setSortBy] = useState('votes');
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  const { user } = useAuth();
  const { isAdmin } = useAdmin();

  const { data: notes, isLoading } = useQuery({
    queryKey: ['notes', course, subject, university, sortBy, searchTerm, user?.id, isAdmin],
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
          user_id,
          is_hidden,
          users (
            name,
            username
          )
        `)
        .eq('type', 'note');

      if (!isAdmin) {
        if (user) {
          query = query.or(`is_hidden.eq.false,user_id.eq.${user.id}`);
        } else {
          query = query.eq('is_hidden', false);
        }
      }

      if (course !== 'all') query = query.eq('course', course);
      if (subject !== 'all') query = query.eq('subject', subject);
      if (university !== 'all') query = query.eq('university', university);
      if (searchTerm) {
        query = query.or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
      }

      const orderField = sortBy === 'latest' ? 'created_at' : 'votes';
      const { data, error } = await query.order(orderField, { ascending: false });

      if (error) throw error;
      return data as Upload[];
    },
  });

  const { data: filterOptions } = useQuery({
    queryKey: ['notes-filter-options'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('uploads')
        .select('course, subject, university')
        .eq('type', 'note')
        .eq('is_hidden', false);

      if (error) throw error;

      const courses = [...new Set(data.map(item => item.course))];
      const subjects = [...new Set(data.map(item => item.subject))];
      const universities = [...new Set(data.map(item => item.university))];

      return { courses, subjects, universities };
    },
  });

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Study Notes</h1>
        <p className="text-lg text-gray-600">Curated notes from students across universities</p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg p-6 shadow-sm mb-8 space-y-6">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search notes by title or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Filters */}
        <div>
          <div className="flex items-center mb-4">
            <Filter className="h-5 w-5 text-gray-500 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <Select value={course} onValueChange={setCourse}>
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

            <Select value={subject} onValueChange={setSubject}>
              <SelectTrigger>
                <SelectValue placeholder="All Subjects" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subjects</SelectItem>
                {filterOptions?.subjects.map((subject) => (
                  <SelectItem key={subject} value={subject}>
                    {subject}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={university} onValueChange={setUniversity}>
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

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="votes">Most Voted</SelectItem>
                <SelectItem value="latest">Latest</SelectItem>
              </SelectContent>
            </Select>

            <Button 
              variant="outline" 
              onClick={() => {
                setCourse('all');
                setSubject('all');
                setUniversity('all');
                setSearchTerm('');
                setSortBy('votes');
              }}
            >
              Clear All
            </Button>
          </div>
        </div>
      </div>

      {/* Notes Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
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
      ) : notes && notes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {notes.map((note) => (
            <Card key={note.id} className={`hover:shadow-lg transition-shadow h-full flex flex-col ${note.is_hidden ? 'border-yellow-500 border-2 bg-yellow-50' : ''}`}>
              <CardHeader className="pb-3">
                {note.is_hidden && (
                  <div className="flex items-center space-x-2 text-yellow-700 mb-2 p-2 bg-yellow-100 rounded-md">
                    <ShieldAlert className="h-5 w-5" />
                    <span className="font-semibold text-sm">Content Disabled - Pending Review</span>
                  </div>
                )}
                <div className="flex justify-between items-start">
                  <Badge variant="secondary">Notes</Badge>
                </div>
                <CardTitle className="text-lg leading-tight line-clamp-2 mt-2">
                  {note.title}
                </CardTitle>
                <div className="h-10 mt-2">
                  {note.description ? (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {note.description}
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
                        username={note.users?.username}
                        displayName={note.users?.name || 'Anonymous'}
                        userId={note.user_id}
                      />
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(note.created_at)}</span>
                    </div>
                  </div>
                  
                  <div className="text-sm text-muted-foreground p-2 bg-muted/30 rounded-md">
                    <div className="font-medium">{note.course} • {note.subject}</div>
                    <div className="text-xs mt-1">{note.university}</div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-2 border-t">
                  <VotingButtons 
                    uploadId={note.id} 
                    initialVotes={note.votes} 
                  />
                  <FileViewer
                    filePath={note.file_path || ''}
                    fileName={note.title}
                    uploadTitle={note.title}
                    externalLink={note.external_link}
                  >
                    <Button 
                      variant="outline" 
                      size="sm"
                    >
                      <ExternalLink className="h-4 w-4 mr-1" />
                      View
                    </Button>
                  </FileViewer>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">No notes found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};

export default Notes;
