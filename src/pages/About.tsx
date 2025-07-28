import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { BookOpen, Users, Trophy, Target } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import { Footer } from '@/components/Footer';
import { Link } from 'react-router-dom';

const About = () => {
  const features = [
    {
      icon: <BookOpen className="h-8 w-8 text-blue-500" />,
      title: "Curated Content",
      description: "High-quality notes, lectures, and resources vetted by our community of students and educators."
    },
    {
      icon: <Users className="h-8 w-8 text-green-500" />,
      title: "Community Driven",
      description: "Built by students, for students. Share your knowledge and learn from peers across universities."
    },
    {
      icon: <Trophy className="h-8 w-8 text-yellow-500" />,
      title: "Quality Recognition",
      description: "Recognition system to highlight top contributors and most valuable resources in the community."
    },
    {
      icon: <Target className="h-8 w-8 text-purple-500" />,
      title: "Focused Learning",
      description: "Organized by courses, subjects, and universities to help you find exactly what you need."
    }
  ];

  const { data: stats, isLoading } = useQuery({
    queryKey: ['community_stats'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_community_stats').single();

      if (error) {
        console.error('Error fetching community stats:', error);
        throw new Error('Failed to fetch community stats');
      }
      return data;
    },
  });

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">About Acadlyst</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Acadlyst is a collaborative platform where students share and discover academic resources. 
            From study notes to video lectures, from placement preparation to study groups - we bring 
            together everything you need for academic success.
          </p>
        </div>

        {/* Mission */}
        <div className="bg-white rounded-lg p-8 shadow-sm mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Our Mission</h2>
          <p className="text-lg text-gray-600 text-center max-w-4xl mx-auto leading-relaxed">
            To democratize access to quality educational resources by creating a platform where students 
            can easily share, discover, and collaborate on academic content. We believe that knowledge 
            shared is knowledge multiplied.
          </p>
        </div>

        {/* Features */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">What Makes Us Different</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="p-6">
                <CardContent className="p-0">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                      <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Statistics */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-lg p-8 text-white mb-12">
          <h2 className="text-3xl font-bold mb-8 text-center">Our Community</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, index) => (
                <div key={index}>
                  <Skeleton className="h-10 w-24 mx-auto mb-2 bg-blue-400" />
                  <Skeleton className="h-6 w-32 mx-auto bg-blue-400" />
                </div>
              ))
            ) : stats ? (
              <>
                <div>
                  <div className="text-4xl font-bold mb-2">{(stats.resources_count || 0).toLocaleString()}+</div>
                  <div className="text-blue-100">Resources Shared</div>
                </div>
                <div>
                  <div className="text-4xl font-bold mb-2">{(stats.students_count || 0).toLocaleString()}+</div>
                  <div className="text-blue-100">Students Helped</div>
                </div>
                <div>
                  <div className="text-4xl font-bold mb-2">{(stats.universities_count || 0).toLocaleString()}+</div>
                  <div className="text-blue-100">Universities</div>
                </div>
                <div>
                  <div className="text-4xl font-bold mb-2">{(stats.groups_count || 0).toLocaleString()}+</div>
                  <div className="text-blue-100">Study Groups</div>
                </div>
              </>
            ) : (
               <p className="col-span-4">Could not load community stats.</p>
            )}
          </div>
        </div>

        {/* How it Works */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Discover</h3>
              <p className="text-gray-600">Browse through curated academic resources shared by students from top universities.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Learn</h3>
              <p className="text-gray-600">Access high-quality notes, video lectures, and preparation materials for your courses.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Connect</h3>
              <p className="text-gray-600">Join study groups and connect with like-minded students for collaborative learning.</p>
            </div>
          </div>
        </div>
        
        {/* Support Us CTA */}
        <div className="text-center mt-16 border-t pt-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Want to help?</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Want to help us keep education accessible for everyone? Learn how you can contribute on our{' '}
            <Link to="/support-us" className="text-blue-600 hover:underline font-semibold">
              Support Us page
            </Link>.
          </p>
        </div>

      </div>
      <Footer />
    </>
  );
};

export default About;
