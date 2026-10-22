import { NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth';

export async function GET() {
  const session = getServerSession();

  if (!session) {
    return NextResponse.json(
      { authenticated: false, role: null, username: null },
      { status: 200 }
    );
  }

  return NextResponse.json(
    {
      authenticated: true,
      role: session.role,
      username: session.username,
      exp: session.exp,
    },
    {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    }
  );
}
