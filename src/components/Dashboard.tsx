
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Upload, BookOpen, Trophy, TrendingUp, Users, Star } from 'lucide-react';

export const Dashboard = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to Acadlyst</h1>
        <p className="text-lg text-gray-600">Discover, share, and learn from India's largest educational resource platform</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Resources</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12,453</div>
            <p className="text-xs text-muted-foreground">
              +20.1% from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8,324</div>
            <p className="text-xs text-muted-foreground">
              +180.1% from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Universities</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">247</div>
            <p className="text-xs text-muted-foreground">
              +19% from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Contributors</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">
              Active this month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Get started by contributing to the community</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button className="h-20 flex flex-col items-center justify-center space-y-2">
              <Upload className="h-6 w-6" />
              <span>Upload Notes</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
              <BookOpen className="h-6 w-6" />
              <span>Browse Resources</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
              <Trophy className="h-6 w-6" />
              <span>View Leaderboard</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity & Trending */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Uploads</CardTitle>
            <CardDescription>Latest resources shared by the community</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((item) => (
                <div key={item} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium">Data Structures & Algorithms Notes</h4>
                    <p className="text-sm text-gray-600">Computer Science • IIT Delhi</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant="secondary">Notes</Badge>
                      <span className="text-xs text-gray-500">2 hours ago</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1 text-sm">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span>4.8</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Trending Topics</CardTitle>
            <CardDescription>Most searched and discussed subjects</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { topic: 'Machine Learning', count: '1.2k resources', trending: true },
                { topic: 'Data Science', count: '890 resources', trending: true },
                { topic: 'Web Development', count: '756 resources', trending: false },
                { topic: 'Competitive Programming', count: '643 resources', trending: true },
                { topic: 'System Design', count: '521 resources', trending: false },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{item.topic}</h4>
                    <p className="text-sm text-gray-600">{item.count}</p>
                  </div>
                  {item.trending && (
                    <Badge variant="default" className="bg-green-100 text-green-800">
                      Trending
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
