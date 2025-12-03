import { NextRequest, NextResponse } from 'next/server';

interface WaitlistEntry {
  fid: number;
  username: string;
  displayName: string;
  pfpUrl: string;
  timestamp: string;
}

let waitlistData: WaitlistEntry[] = [];

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { fid, username, displayName, pfpUrl } = body;

    if (!fid || !username || !displayName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = waitlistData.find((entry: WaitlistEntry) => entry.fid === fid);
    if (existingUser) {
      return NextResponse.json(
        { error: 'Already registered' },
        { status: 409 }
      );
    }

    // Add new entry
    const newEntry: WaitlistEntry = {
      fid,
      username,
      displayName,
      pfpUrl: pfpUrl || '',
      timestamp: new Date().toISOString()
    };

    waitlistData.unshift(newEntry);

    return NextResponse.json({ success: true, entry: newEntry }, { status: 201 });
  } catch (error) {
    console.error('Error joining waitlist:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
