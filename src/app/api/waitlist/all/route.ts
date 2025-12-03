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
    return NextResponse.json(waitlistData);
  } catch (error) {
    console.error('Error fetching all users:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
