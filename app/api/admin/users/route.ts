import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { prisma } from '@/lib/prisma';

// GET: Fetch all users (admin only)
export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
    });

    if (!user || user.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const users = await prisma.user.findMany({
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            department: true,
            accountCreatedAt: true,
            rating: true,
        },
        orderBy: { accountCreatedAt: 'desc' },
    });

    return NextResponse.json(users);
}
