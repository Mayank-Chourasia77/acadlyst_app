
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { GraduationCap, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

type CourseStat = {
  course_name: string;
  resource_count: number;
  popular_subjects: string[];
};

const fetchCourseStats = async (): Promise<CourseStat[]> => {
  const { data, error } = await supabase.rpc('get_course_stats');

  if (error) {
    console.error('Error fetching course stats:', error);
    throw new Error('Failed to fetch course statistics');
  }

  return data || [];
};

export const BrowseByCourse = () => {
  const { data: courses, isLoading, isError } = useQuery<CourseStat[]>({
    queryKey: ['course_stats'],
    queryFn: fetchCourseStats,
  });

  return (
    <section>
      <div className="flex items-center mb-8">
        <GraduationCap className="h-6 w-6 text-blue-500 mr-2" />
        <h2 className="text-3xl font-bold text-gray-900">Browse by Course</h2>
      </div>
      
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <Skeleton className="h-6 w-1/2 mb-2" />
                <Skeleton className="h-4 w-3/4 mb-6" />
                <div className="space-y-2 mb-6">
                  <Skeleton className="h-4 w-1/3" />
                  <div className="flex flex-wrap gap-1">
                    <Skeleton className="h-5 w-16" />
                    <Skeleton className="h-5 w-20" />
                    <Skeleton className="h-5 w-24" />
                  </div>
                </div>
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {isError && (
        <Card>
          <CardContent className="p-6 text-center text-red-500">
            <p>Failed to load course data.</p>
            <p className="text-sm text-gray-500">Please try refreshing the page.</p>
          </CardContent>
        </Card>
      )}

      {!isLoading && !isError && courses && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Card key={course.course_name} className="hover:shadow-lg transition-shadow flex flex-col">
              <CardContent className="p-6 flex-grow flex flex-col">
                <div className="flex-grow">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{course.course_name}</h3>
                  <p className="text-blue-600 font-semibold text-sm mb-4">
                    {course.resource_count} resources available
                  </p>
                  
                  {course.popular_subjects.length > 0 && (
                    <div className="mb-6">
                      <p className="text-sm text-gray-500 mb-2">Popular subjects:</p>
                      <div className="flex flex-wrap gap-1">
                        {course.popular_subjects.map((subject) => (
                          <span key={subject} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                            {subject}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <Button asChild className="w-full mt-auto" variant="outline">
                  <Link to={`/notes?course=${encodeURIComponent(course.course_name)}`}>
                    Browse {course.course_name}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
};
