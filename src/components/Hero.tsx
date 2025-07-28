
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Hero = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [resourceType, setResourceType] = useState('notes');
  const [course, setCourse] = useState('all');
  const [otherCourse, setOtherCourse] = useState('');
  const [university, setUniversity] = useState('all');
  const [otherUniversity, setOtherUniversity] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (course !== 'OTHER') {
      setOtherCourse('');
    }
  }, [course]);

  useEffect(() => {
    if (university !== 'OTHER') {
      setOtherUniversity('');
    }
  }, [university]);

  const handleSearch = () => {
    const params = new URLSearchParams();

    if (searchQuery) {
      params.set('q', searchQuery);
    }

    const finalCourse = course === 'OTHER' ? otherCourse : course;
    if (finalCourse && finalCourse.trim() !== '' && finalCourse !== 'all') {
      params.set('course', finalCourse);
    }

    const finalUniversity = university === 'OTHER' ? otherUniversity : university;
    if (finalUniversity && finalUniversity.trim() !== '' && finalUniversity !== 'all') {
      params.set('university', finalUniversity);
    }

    navigate(`/${resourceType}?${params.toString()}`);
  };

  return (
    <div className="bg-gradient-to-br from-blue-600 to-purple-700 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">
            Academic Resources for Everyone
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Discover notes, lectures, placement resources, and study groups curated by students, for students.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg p-6 shadow-lg text-gray-900">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Search for notes, lectures, or resources..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-12 text-lg"
                  />
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 lg:w-auto">
                  <Select value={resourceType} onValueChange={setResourceType}>
                    <SelectTrigger className="h-12 w-full sm:w-40">
                      <SelectValue placeholder="Resource Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="notes">Notes</SelectItem>
                      <SelectItem value="lectures">Lectures</SelectItem>
                      <SelectItem value="placement">Placement</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={course} onValueChange={setCourse}>
                    <SelectTrigger className="h-12 w-full sm:w-40">
                      <SelectValue placeholder="Course" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Courses</SelectItem>
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

                  <Select value={university} onValueChange={setUniversity}>
                    <SelectTrigger className="h-12 w-full sm:w-40">
                      <SelectValue placeholder="University" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Universities</SelectItem>
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

                  <Button onClick={handleSearch} className="h-12 px-8 bg-blue-600 hover:bg-blue-700">
                    <Search className="h-5 w-5 mr-2" />
                    Search
                  </Button>
                </div>
              </div>

              {(course === 'OTHER' || university === 'OTHER') && (
                <div className="flex flex-col sm:flex-row gap-4">
                  {course === 'OTHER' && (
                    <div className="flex-1">
                      <Input
                        placeholder="Other Course Name"
                        value={otherCourse}
                        onChange={(e) => setOtherCourse(e.target.value.toUpperCase())}
                        className="h-12"
                      />
                    </div>
                  )}
                  {university === 'OTHER' && (
                    <div className="flex-1">
                      <Input
                        placeholder="Other University Name"
                        value={otherUniversity}
                        onChange={(e) => setOtherUniversity(e.target.value.toUpperCase())}
                        className="h-12"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
