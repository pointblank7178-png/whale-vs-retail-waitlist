import { NextResponse } from 'next/server';

interface WaitlistEntry {
  fid: number;
  username: string;
  displayName: string;
  pfpUrl: string;
  timestamp: string;
}

let waitlistData: WaitlistEntry[] = [];

export async function GET(): Promise<NextResponse> {
  try {
    const totalUsers: number = waitlistData.length;
    const recentUsers: WaitlistEntry[] = waitlistData.slice(0, 5);

    return NextResponse.json({
      totalUsers,
      recentUsers
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
