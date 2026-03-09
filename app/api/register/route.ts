import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
    const { name, email, password, department } = await req.json();

    if (!name || !email || !password || !department) {
        return NextResponse.json({ error: 'Name, email, password and department are required.' }, { status: 400 });
    }

    if (!email.endsWith('@adaniuni.ac.in')) {
        return NextResponse.json({ error: 'Only @adaniuni.ac.in email addresses are allowed.' }, { status: 403 });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
        return NextResponse.json({ error: 'An account with this email already exists.' }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
            department,
            role: 'USER',
        },
    });

    return NextResponse.json({ success: true, userId: user.id }, { status: 201 });
}
