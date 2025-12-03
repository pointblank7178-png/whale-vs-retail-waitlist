'use client'
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Loader2, Users, TrendingUp, TrendingDown } from 'lucide-react';
import { toast } from 'sonner';
import { sdk } from "@farcaster/miniapp-sdk";
import { useAddMiniApp } from "@/hooks/useAddMiniApp";
import { useQuickAuth } from "@/hooks/useQuickAuth";
import { useIsInFarcaster } from "@/hooks/useIsInFarcaster";

interface WaitlistUser {
  fid: number;
  username: string;
  displayName: string;
  pfpUrl: string;
  timestamp: string;
}

interface WaitlistStats {
  totalUsers: number;
  recentUsers: WaitlistUser[];
}

export default function WaitlistPage(): JSX.Element {
    const { addMiniApp } = useAddMiniApp();
    const isInFarcaster = useIsInFarcaster()
    useQuickAuth(isInFarcaster)
    useEffect(() => {
      const tryAddMiniApp = async () => {
        try {
          await addMiniApp()
        } catch (error) {
          console.error('Failed to add mini app:', error)
        }

      }

    

      tryAddMiniApp()
    }, [addMiniApp])
    useEffect(() => {
      const initializeFarcaster = async () => {
        try {
          await new Promise(resolve => setTimeout(resolve, 100))
          
          if (document.readyState !== 'complete') {
            await new Promise<void>(resolve => {
              if (document.readyState === 'complete') {
                resolve()
              } else {
                window.addEventListener('load', () => resolve(), { once: true })
              }

            })
          }

    

          await sdk.actions.ready()
          console.log('Farcaster SDK initialized successfully - app fully loaded')
        } catch (error) {
          console.error('Failed to initialize Farcaster SDK:', error)
          
          setTimeout(async () => {
            try {
              await sdk.actions.ready()
              console.log('Farcaster SDK initialized on retry')
            } catch (retryError) {
              console.error('Farcaster SDK retry failed:', retryError)
            }

          }, 1000)
        }

      }

    

      initializeFarcaster()
    }, [])
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isJoined, setIsJoined] = useState<boolean>(false);
  const [stats, setStats] = useState<WaitlistStats>({ totalUsers: 0, recentUsers: [] });

  useEffect(() => {
    loadStats();
    checkIfJoined();
  }, []);

  const loadStats = async (): Promise<void> => {
    try {
      const response = await fetch('/api/waitlist/stats');
      if (response.ok) {
        const data: WaitlistStats = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const checkIfJoined = (): void => {
    const joined = localStorage.getItem('waitlist_joined');
    if (joined) {
      setIsJoined(true);
    }
  };

  const handleJoinWaitlist = async (): Promise<void> => {
    setIsLoading(true);
    try {
      // Get user data from Farcaster context
      const sdk = (window as unknown as { sdk?: { context?: { user?: { fid: number; username: string } } } }).sdk;
      
      if (!sdk?.context?.user) {
        toast.error('Please open this app in Farcaster to join the waitlist');
        setIsLoading(false);
        return;
      }

      const user = sdk.context.user;
      
      // Fetch user details from Neynar API
      const neynarResponse = await fetch('/api/neynar/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fid: user.fid })
      });

      if (!neynarResponse.ok) {
        throw new Error('Failed to fetch user data');
      }

      const userData = await neynarResponse.json();

      // Join waitlist
      const joinResponse = await fetch('/api/waitlist/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fid: userData.fid,
          username: userData.username,
          displayName: userData.displayName,
          pfpUrl: userData.pfpUrl
        })
      });

      if (!joinResponse.ok) {
        const error = await joinResponse.json();
        throw new Error(error.error || 'Failed to join waitlist');
      }

      setIsJoined(true);
      localStorage.setItem('waitlist_joined', 'true');
      toast.success('Successfully joined the waitlist! 🎉');
      await loadStats();
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Failed to join waitlist');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 pt-16 relative overflow-hidden">
      {/* Animated Trading Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-96 h-96 bg-blue-500 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-green-500 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-cyan-500 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Trading Chart Lines Background */}
      <div className="absolute inset-0 opacity-5">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-cyan-400"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-4 mb-4 animate-fade-in">
            <span className="text-6xl drop-shadow-[0_0_15px_rgba(59,130,246,0.5)] animate-bounce">🐋</span>
            <div className="relative">
              <h1 className="text-6xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-green-400 bg-clip-text text-transparent animate-gradient">
                VS
              </h1>
              <div className="absolute inset-0 blur-xl bg-gradient-to-r from-cyan-400 via-blue-500 to-green-400 opacity-30 animate-pulse"></div>
            </div>
            <span className="text-6xl drop-shadow-[0_0_15px_rgba(34,197,94,0.5)] animate-bounce delay-100">💰</span>
          </div>
          <h2 className="text-5xl font-bold text-white mb-3 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
            Whale vs Retail
          </h2>
          <p className="text-lg text-cyan-100 max-w-2xl mx-auto">
            Join the ultimate trading simulation game. Will you trade like a whale or play it like retail?
          </p>
          
          {/* Market Ticker Effect */}
          <div className="mt-4 flex items-center justify-center gap-4 text-xs">
            <div className="flex items-center gap-1 text-green-400">
              <TrendingUp className="h-4 w-4" />
              <span>Whales: +24.5%</span>
            </div>
            <div className="w-px h-4 bg-cyan-400/30"></div>
            <div className="flex items-center gap-1 text-red-400">
              <TrendingDown className="h-4 w-4" />
              <span>Retail: -12.3%</span>
            </div>
          </div>
        </div>

        {/* Main Card */}
        <Card className="mb-8 shadow-2xl bg-slate-900/80 border-cyan-500/20 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-2xl text-white">Join the Waitlist</CardTitle>
            <CardDescription className="text-cyan-200">
              Be among the first to experience the thrill of whale vs retail trading
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {!isJoined ? (
                <Button
                  onClick={handleJoinWaitlist}
                  disabled={isLoading}
                  size="lg"
                  className="w-full text-lg h-14 bg-gradient-to-r from-cyan-600 via-blue-600 to-green-600 hover:from-cyan-500 hover:via-blue-500 hover:to-green-500 text-white font-semibold shadow-[0_0_20px_rgba(34,211,238,0.4)] hover:shadow-[0_0_30px_rgba(34,211,238,0.6)] transition-all duration-300"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Joining...
                    </>
                  ) : (
                    '🚀 Join Waitlist with Farcaster'
                  )}
                </Button>
              ) : (
                <div className="text-center p-6 bg-gradient-to-r from-green-900/50 to-emerald-900/50 rounded-lg border-2 border-green-500/50 shadow-[0_0_20px_rgba(34,197,94,0.3)]">
                  <p className="text-xl font-semibold text-green-300 mb-2">You&apos;re on the list! 🎉</p>
                  <p className="text-green-100">We&apos;ll notify you when the game launches</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Stats Card */}
        <Card className="shadow-2xl bg-slate-900/80 border-cyan-500/20 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Users className="h-5 w-5 text-cyan-400" />
              Waitlist Stats
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Total Users */}
              <div className="text-center p-6 bg-gradient-to-r from-cyan-900/30 to-blue-900/30 rounded-lg border border-cyan-500/30 shadow-[0_0_15px_rgba(34,211,238,0.2)]">
                <p className="text-cyan-300 text-sm mb-2 uppercase tracking-wider">Total Players Registered</p>
                <p className="text-5xl font-bold bg-gradient-to-r from-cyan-400 to-green-400 bg-clip-text text-transparent">
                  {stats.totalUsers}
                </p>
              </div>

              {/* Recent Users */}
              {stats.recentUsers.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-cyan-300 uppercase tracking-wide">Latest Players</h3>
                  <div className="space-y-3">
                    {stats.recentUsers.map((user: WaitlistUser) => (
                      <div
                        key={user.fid}
                        className="flex items-center gap-3 p-4 bg-slate-800/50 rounded-lg border border-cyan-500/20 hover:border-cyan-500/50 hover:bg-slate-800/70 transition-all duration-300 hover:shadow-[0_0_15px_rgba(34,211,238,0.2)]"
                      >
                        <Avatar className="h-12 w-12 ring-2 ring-cyan-500/50">
                          <AvatarImage src={user.pfpUrl} alt={user.username} />
                          <AvatarFallback className="bg-slate-700 text-cyan-300">
                            {user.username.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-semibold text-white">{user.displayName}</p>
                          <p className="text-sm text-cyan-300">@{user.username}</p>
                        </div>
                        <Badge 
                          variant="secondary" 
                          className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                        >
                          FID: {user.fid}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {stats.recentUsers.length === 0 && stats.totalUsers === 0 && (
                <div className="text-center py-8">
                  <p className="text-lg mb-2 text-cyan-200">Be the first to join!</p>
                  <p className="text-sm text-cyan-400">Start the trading revolution</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-cyan-400">
          <p className="text-sm">
            Built on Farcaster • <a href="/admin" className="underline hover:text-cyan-300 transition-colors">Admin</a>
          </p>
        </div>
      </div>

      <style jsx global>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        .delay-100 {
          animation-delay: 0.1s;
        }
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
