import { NextResponse } from 'next/server';

const SECURITY_TXT_CONTENT = `Contact: mailto:admin@raudlatulhidayah.sch.id
Contact: https://wa.me/628176614723
Expires: 2027-12-31T23:59:59.000Z
Preferred-Languages: id, en
Canonical: https://www.masraudlatulhidayah.sch.id/.well-known/security.txt
Policy: https://www.masraudlatulhidayah.sch.id/kontak
Hiring: https://www.masraudlatulhidayah.sch.id/profil
Acknowledgments: https://www.masraudlatulhidayah.sch.id/
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
