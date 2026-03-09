import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { prisma } from '@/lib/prisma';

// PUT: Update user role (admin only)
export async function PUT(req: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const admin = await prisma.user.findUnique({
        where: { email: session.user.email },
    });

    if (!admin || admin.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { userId, newRole } = await req.json();

    if (!userId || !newRole) {
        return NextResponse.json({ error: 'userId and newRole are required' }, { status: 400 });
    }

    if (!['USER', 'PROFESSOR', 'ADMIN'].includes(newRole)) {
        return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
    }

    // Prevent admin from demoting themselves
    if (userId === admin.id && newRole !== 'ADMIN') {
        return NextResponse.json({ error: 'Cannot change your own admin role' }, { status: 400 });
    }

    const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { role: newRole },
    });

    return NextResponse.json({ success: true, user: updatedUser });
}
