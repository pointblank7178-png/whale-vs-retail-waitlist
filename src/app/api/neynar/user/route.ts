import { NextRequest, NextResponse } from 'next/server';

const NEYNAR_API_KEY = '8CC2E89C-C6C1-4935-A3B3-FB986687A3B7';

interface NeynarUser {
  fid: number;
  username: string;
  display_name: string;
  pfp_url: string;
}

interface UserResponse {
  fid: number;
  username: string;
  displayName: string;
  pfpUrl: string;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { fid } = body;

    if (!fid) {
      return NextResponse.json(
        { error: 'FID is required' },
        { status: 400 }
      );
    }

    // Fetch user data from Neynar API
    const response = await fetch(`https://api.neynar.com/v2/farcaster/user/bulk?fids=${fid}`, {
      method: 'GET',
      headers: {
        'accept': 'application/json',
        'api_key': NEYNAR_API_KEY
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user from Neynar');
    }

    const data = await response.json();
    
    if (!data.users || data.users.length === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const user: NeynarUser = data.users[0];
    
    const userResponse: UserResponse = {
      fid: user.fid,
      username: user.username,
      displayName: user.display_name,
      pfpUrl: user.pfp_url
    };

    return NextResponse.json(userResponse);
  } catch (error) {
    console.error('Error fetching Neynar user:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user data' },
      { status: 500 }
    );
  }
}
