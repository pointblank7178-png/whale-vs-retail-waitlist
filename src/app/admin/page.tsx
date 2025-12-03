'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Lock, Users, Calendar, TrendingUp, Activity } from 'lucide-react';
import { toast } from 'sonner';

interface WaitlistUser {
  fid: number;
  username: string;
  displayName: string;
  pfpUrl: string;
  timestamp: string;
}

export default function AdminPage(): JSX.Element {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [password, setPassword] = useState<string>('');
  const [users, setUsers] = useState<WaitlistUser[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const auth = sessionStorage.getItem('admin_auth');
    if (auth === 'true') {
      setIsAuthenticated(true);
      loadUsers();
    }
  }, []);

  const handleLogin = (e: React.FormEvent): void => {
    e.preventDefault();
    if (password === 'Smedley@532') {
      setIsAuthenticated(true);
      sessionStorage.setItem('admin_auth', 'true');
      toast.success('Login successful');
      loadUsers();
    } else {
      toast.error('Invalid password');
    }
  };

  const loadUsers = async (): Promise<void> => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/waitlist/all');
      if (response.ok) {
        const data: WaitlistUser[] = await response.json();
        setUsers(data);
      } else {
        toast.error('Failed to load users');
      }
    } catch (error) {
      console.error('Error loading users:', error);
      toast.error('Error loading users');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = (): void => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('admin_auth');
    setUsers([]);
    toast.success('Logged out');
  };

  const formatDate = (timestamp: string): string => {
    return new Date(timestamp).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-96 h-96 bg-blue-500 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-500 rounded-full blur-3xl animate-pulse"></div>
        </div>

        <Card className="w-full max-w-md shadow-2xl bg-slate-900/90 border-cyan-500/20 backdrop-blur-xl relative z-10">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-20 h-20 bg-gradient-to-br from-cyan-600 via-blue-600 to-green-600 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(34,211,238,0.5)] animate-pulse">
              <Lock className="h-10 w-10 text-white" />
            </div>
            <CardTitle className="text-3xl text-white font-bold">Admin Access</CardTitle>
            <CardDescription className="text-cyan-300">Enter password to view waitlist dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password" className="text-cyan-300">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  className="bg-slate-800/50 border-cyan-500/30 text-white placeholder:text-slate-500 focus:border-cyan-500"
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-cyan-600 via-blue-600 to-green-600 hover:from-cyan-500 hover:via-blue-500 hover:to-green-500 text-white font-semibold shadow-[0_0_20px_rgba(34,211,238,0.4)] hover:shadow-[0_0_30px_rgba(34,211,238,0.6)] transition-all duration-300"
              >
                🔓 Unlock Dashboard
              </Button>
              <div className="text-center">
                <a href="/" className="text-sm text-cyan-400 hover:text-cyan-300 hover:underline transition-colors">
                  ← Back to Waitlist
                </a>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 pt-16 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-96 h-96 bg-blue-500 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-green-500 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-cyan-500 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Grid Background */}
      <div className="absolute inset-0 opacity-5">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="admin-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-cyan-400"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#admin-grid)" />
        </svg>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-7xl relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">🐋</span>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-green-400 bg-clip-text text-transparent">
                Admin Dashboard
              </h1>
              <span className="text-3xl">💰</span>
            </div>
            <p className="text-cyan-300">Whale vs Retail Waitlist Management</p>
          </div>
          <Button 
            onClick={handleLogout} 
            variant="outline"
            className="border-cyan-500/50 text-cyan-300 hover:bg-cyan-500/10 hover:text-cyan-200 hover:border-cyan-400"
          >
            Logout
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-slate-900/80 border-cyan-500/20 backdrop-blur-xl shadow-[0_0_20px_rgba(34,211,238,0.1)] hover:shadow-[0_0_30px_rgba(34,211,238,0.2)] transition-all">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-cyan-300 uppercase tracking-wide">Total Users</CardTitle>
              <Users className="h-5 w-5 text-cyan-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                {users.length}
              </div>
              <p className="text-xs text-cyan-400/70">registered players</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/80 border-green-500/20 backdrop-blur-xl shadow-[0_0_20px_rgba(34,197,94,0.1)] hover:shadow-[0_0_30px_rgba(34,197,94,0.2)] transition-all">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-300 uppercase tracking-wide">Latest Join</CardTitle>
              <Calendar className="h-5 w-5 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-sm font-bold text-green-300">
                {users.length > 0 ? formatDate(users[0].timestamp) : 'N/A'}
              </div>
              <p className="text-xs text-green-400/70">most recent signup</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/80 border-purple-500/20 backdrop-blur-xl shadow-[0_0_20px_rgba(168,85,247,0.1)] hover:shadow-[0_0_30px_rgba(168,85,247,0.2)] transition-all">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-300 uppercase tracking-wide">Activity</CardTitle>
              <Activity className="h-5 w-5 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-2xl font-bold">
                <span className="text-3xl">🐋</span>
                <TrendingUp className="h-5 w-5 text-green-400" />
                <span className="text-3xl">💰</span>
              </div>
              <p className="text-xs text-purple-400/70">{users.length} ready to trade</p>
            </CardContent>
          </Card>
        </div>

        {/* Users Table */}
        <Card className="bg-slate-900/80 border-cyan-500/20 backdrop-blur-xl shadow-2xl">
          <CardHeader>
            <CardTitle className="text-white text-xl">All Waitlist Entries</CardTitle>
            <CardDescription className="text-cyan-300">Complete list of registered users</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-12">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-cyan-400 border-r-transparent"></div>
                <p className="mt-4 text-cyan-300">Loading traders...</p>
              </div>
            ) : users.length === 0 ? (
              <div className="text-center py-12">
                <Users className="h-16 w-16 text-cyan-400/50 mx-auto mb-4" />
                <p className="text-cyan-300 text-lg">No users yet</p>
                <p className="text-cyan-400/70 text-sm">Waiting for the first whale or retail trader...</p>
              </div>
            ) : (
              <div className="rounded-lg border border-cyan-500/20 overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="border-cyan-500/20 hover:bg-slate-800/50">
                      <TableHead className="text-cyan-300 font-semibold">User</TableHead>
                      <TableHead className="text-cyan-300 font-semibold">Username</TableHead>
                      <TableHead className="text-cyan-300 font-semibold">FID</TableHead>
                      <TableHead className="text-cyan-300 font-semibold">Joined</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user: WaitlistUser) => (
                      <TableRow 
                        key={user.fid} 
                        className="border-cyan-500/10 hover:bg-slate-800/50 transition-colors"
                      >
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10 ring-2 ring-cyan-500/50">
                              <AvatarImage src={user.pfpUrl} alt={user.username} />
                              <AvatarFallback className="bg-slate-700 text-cyan-300">
                                {user.username.slice(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-medium text-white">{user.displayName}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-cyan-300">@{user.username}</TableCell>
                        <TableCell>
                          <Badge 
                            variant="secondary" 
                            className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                          >
                            {user.fid}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-cyan-200">{formatDate(user.timestamp)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-cyan-400/70">
          <p className="text-sm">
            🐋 Whale vs Retail Trading Simulator • Built on Farcaster 💰
          </p>
        </div>
      </div>

      <style jsx global>{`
        .delay-1000 {
          animation-delay: 1s;
        }
        .delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
}
