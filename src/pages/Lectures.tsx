
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ExternalLink, Play, Filter, Search, Calendar, User, ShieldAlert, AtSign, Clapperboard } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { VotingButtons } from '@/components/VotingButtons';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '@/components/AuthProvider';
import { useAdmin } from '@/hooks/useAdmin';
import { ClickableUsername } from '@/components/ClickableUsername';

interface Upload {
  id: string;
  title: string;
  description?: string;
  type: 'note' | 'lecture' | 'placement';
  external_link: string;
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
  creator_name?: string | null;
  platform?: string | null;
}

const Lectures = () => {
  const [searchParams] = useSearchParams();
  const [course, setCourse] = useState(searchParams.get('course') || 'all');
  const [subject, setSubject] = useState('all');
  const [university, setUniversity] = useState(searchParams.get('university') || 'all');
  const [sortBy, setSortBy] = useState('votes');
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  const { user } = useAuth();
  const { isAdmin } = useAdmin();

  const { data: lectures, isLoading } = useQuery({
    queryKey: ['lectures', course, subject, university, sortBy, searchTerm, user?.id, isAdmin],
    queryFn: async () => {
      let query = supabase
        .from('uploads')
        .select(`
          id,
          title,
          description,
          type,
          external_link,
          course,
          subject,
          university,
          votes,
          created_at,
          user_id,
          is_hidden,
          creator_name,
          platform,
          users (
            name,
            username
          )
        `)
        .eq('type', 'lecture');

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
    queryKey: ['lectures-filter-options'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('uploads')
        .select('course, subject, university')
        .eq('type', 'lecture')
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

  const getVideoThumbnail = (url: string) => {
    // Extract YouTube video ID and generate thumbnail
    const videoId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
    if (videoId) {
      return `https://img.youtube.com/vi/${videoId[1]}/maxresdefault.jpg`;
    }
    return '/placeholder.svg';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Video Lectures</h1>
        <p className="text-lg text-gray-600">Curated educational videos from YouTube and other platforms</p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg p-6 shadow-sm mb-8 space-y-6">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search lectures by title or description..."
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

      {/* Lectures Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="animate-pulse">
              <div className="h-48 bg-gray-200 rounded-t-lg"></div>
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
      ) : lectures && lectures.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lectures.map((lecture) => (
            <Card key={lecture.id} className={`hover:shadow-lg transition-shadow ${lecture.is_hidden ? 'border-yellow-500 border-2 bg-yellow-50' : ''}`}>
              <div className="relative">
                <img 
                  src={getVideoThumbnail(lecture.external_link)} 
                  alt={lecture.title}
                  className="w-full h-48 object-cover rounded-t-lg"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/placeholder.svg';
                  }}
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 rounded-t-lg flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <Play className="h-12 w-12 text-white" />
                </div>
              </div>
              
              <CardHeader>
                {lecture.is_hidden && (
                  <div className="flex items-center space-x-2 text-yellow-700 mb-2 p-2 bg-yellow-100 rounded-md">
                    <ShieldAlert className="h-5 w-5" />
                    <span className="font-semibold text-sm">Content Disabled - Pending Review</span>
                  </div>
                )}
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="secondary">Video</Badge>
                </div>
                <CardTitle className="text-lg leading-tight line-clamp-2">
                  {lecture.title}
                </CardTitle>
                <div className="h-10 mt-2">
                  {lecture.description ? (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {lecture.description}
                    </p>
                  ) : (
                    <div className="h-full"></div>
                  )}
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <User className="h-4 w-4" />
                      <ClickableUsername
                        username={lecture.users?.username}
                        displayName={lecture.users?.name || 'Anonymous'}
                        userId={lecture.user_id}
                      />
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(lecture.created_at)}</span>
                    </div>
                  </div>

                  <div className="text-sm text-gray-600 space-y-1 h-12 flex flex-col justify-center">
                    <div className="flex items-center space-x-2">
                      <AtSign className="h-4 w-4 text-gray-500" />
                      <span>{lecture.creator_name || '---'}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clapperboard className="h-4 w-4 text-gray-500" />
                      <span>{lecture.platform || '---'}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>{lecture.course} • {lecture.subject}</span>
                    <span>{lecture.university}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <VotingButtons 
                      uploadId={lecture.id} 
                      initialVotes={lecture.votes} 
                    />
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => window.open(lecture.external_link, '_blank')}
                    >
                      <ExternalLink className="h-4 w-4 mr-1" />
                      Watch
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">No lectures found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};

export default Lectures;
