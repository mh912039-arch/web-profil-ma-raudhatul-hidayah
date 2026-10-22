import { NextResponse } from 'next/server';

const SECURITY_TXT_CONTENT = `Contact: mailto:admin@raudhatulhidayah.sch.id
Contact: https://wa.me/628176614723
Expires: 2027-12-31T23:59:59.000Z
Preferred-Languages: id, en
Canonical: https://web-profil-ma-raudhatul-hidayah.vercel.app/.well-known/security.txt
Policy: https://web-profil-ma-raudhatul-hidayah.vercel.app/kontak
Hiring: https://web-profil-ma-raudhatul-hidayah.vercel.app/profil
Acknowledgments: https://web-profil-ma-raudhatul-hidayah.vercel.app/
`;

export async function GET() {
  return new NextResponse(SECURITY_TXT_CONTENT, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
    },
  });
}
