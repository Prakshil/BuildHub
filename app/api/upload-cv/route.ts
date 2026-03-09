import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { prisma } from '@/lib/prisma';

// POST: Upload CV URL (user updates their own CV)
export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { cvUrl } = await req.json();

    if (!cvUrl) {
        return NextResponse.json({ error: 'CV URL is required' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
    });

    if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: { cv: cvUrl },
    });

    return NextResponse.json({ success: true, cvUrl: updatedUser.cv });
}
