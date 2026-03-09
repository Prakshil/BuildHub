'use client';
import Link from 'next/link';
import Image from 'next/image';
import { colors } from '@/const';
import { signIn } from 'next-auth/react';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LandingPage() {
    const [tab, setTab] = useState<'signin' | 'signup'>('signin');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    // Sign-in fields
    const [signInEmail, setSignInEmail] = useState('');
    const [signInPassword, setSignInPassword] = useState('');

    // Sign-up fields
    const [signUpName, setSignUpName] = useState('');
    const [signUpEmail, setSignUpEmail] = useState('');
    const [signUpPassword, setSignUpPassword] = useState('');
    const [signUpConfirm, setSignUpConfirm] = useState('');
    const [signUpDepartment, setSignUpDepartment] = useState('');

    const { status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === 'authenticated') {
            router.push('/dashboard');
        }
    }, [status, router]);

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!signInEmail.endsWith('@adaniuni.ac.in')) {
            setError('Only @adaniuni.ac.in email addresses are allowed.');
            return;
        }
        setIsLoading(true);
        const result = await signIn('credentials', {
            email: signInEmail,
            password: signInPassword,
            redirect: false,
        });
        setIsLoading(false);
        if (result?.error) {
            setError('Invalid email or password.');
        } else {
            router.push('/dashboard');
        }
    };

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!signUpEmail.endsWith('@adaniuni.ac.in')) {
            setError('Only @adaniuni.ac.in email addresses are allowed.');
            return;
        }
        if (signUpPassword !== signUpConfirm) {
            setError('Passwords do not match.');
            return;
        }
        if (signUpPassword.length < 8) {
            setError('Password must be at least 8 characters.');
            return;
        }
        setIsLoading(true);
        try {
            const res = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: signUpName, email: signUpEmail, password: signUpPassword, department: signUpDepartment }),
            });
            const data = await res.json();
            if (!res.ok) {
                setError(data.error || 'Registration failed.');
                setIsLoading(false);
                return;
            }
            // Auto sign-in after successful registration
            const result = await signIn('credentials', {
                email: signUpEmail,
                password: signUpPassword,
                redirect: false,
            });
            setIsLoading(false);
            if (result?.error) {
                setError('Registered but failed to sign in. Please sign in manually.');
                setTab('signin');
            } else {
                router.push('/dashboard');
            }
        } catch {
            setError('Something went wrong. Please try again.');
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col md:flex-row min-h-screen">
            {/* Left Section - Dark Background */}
            <div className="w-full md:w-1/2 p-4 md:p-8 flex flex-col" style={{ backgroundColor: colors.dark }}>
                <div className="mb-4 md:mb-8 flex items-center justify-center md:justify-start">
                    <Image src="/Logo.svg" alt="BuildMate Logo" width={145} height={145} className="mr-2" />
                </div>
                <div className="flex-grow"></div>
                <div className="mt-4 md:mt-auto text-center md:text-left">
                    <p className="text-white text-base md:text-l leading-relaxed">
                        Learn, collaborate, and grow with real-world projects, mentor support, and a community that
                        helps you turn learning into impact.
                    </p>
                </div>
            </div>

            {/* Right Section */}
            <div className="w-full md:w-1/2 bg-white p-4 md:p-8 flex items-center justify-center">
                <div className="w-full max-w-md">
                    <div className="text-center mb-6">
                        <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-1">Welcome to BuildMate</h1>
                        <p className="text-gray-500 text-sm">Use your @adaniuni.ac.in email to continue</p>
                    </div>

                    {/* Tab switcher */}
                    <div className="flex border border-gray-200 rounded-lg mb-6 overflow-hidden">
                        <button
                            className={`flex-1 py-2 text-sm font-medium transition-colors ${tab === 'signin' ? 'bg-gray-900 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                            onClick={() => { setTab('signin'); setError(''); }}
                        >
                            Sign In
                        </button>
                        <button
                            className={`flex-1 py-2 text-sm font-medium transition-colors ${tab === 'signup' ? 'bg-gray-900 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                            onClick={() => { setTab('signup'); setError(''); }}
                        >
                            Sign Up
                        </button>
                    </div>

                    {error && (
                        <p className="text-red-600 text-sm mb-4 text-center">{error}</p>
                    )}

                    {tab === 'signin' ? (
                        <form onSubmit={handleSignIn} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    required
                                    value={signInEmail}
                                    onChange={e => setSignInEmail(e.target.value)}
                                    placeholder="you@adaniuni.ac.in"
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                <input
                                    type="password"
                                    required
                                    value={signInPassword}
                                    onChange={e => setSignInPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-gray-900 text-white rounded-md py-2 text-sm font-medium hover:bg-gray-700 disabled:opacity-50 transition-colors"
                            >
                                {isLoading ? 'Signing in...' : 'Sign In'}
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleSignUp} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                <input
                                    type="text"
                                    required
                                    value={signUpName}
                                    onChange={e => setSignUpName(e.target.value)}
                                    placeholder="Your full name"
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    required
                                    value={signUpEmail}
                                    onChange={e => setSignUpEmail(e.target.value)}
                                    placeholder="you@adaniuni.ac.in"
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                                <select
                                    required
                                    value={signUpDepartment}
                                    onChange={e => setSignUpDepartment(e.target.value)}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
                                >
                                    <option value="">Select Department</option>
                                    <option value="Computer Science">Computer Science</option>
                                    <option value="Information Technology">Information Technology</option>
                                    <option value="Electronics">Electronics</option>
                                    <option value="Mechanical">Mechanical</option>
                                    <option value="Civil">Civil</option>
                                    <option value="Electrical">Electrical</option>
                                    <option value="Business Administration">Business Administration</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                <input
                                    type="password"
                                    required
                                    value={signUpPassword}
                                    onChange={e => setSignUpPassword(e.target.value)}
                                    placeholder="At least 8 characters"
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                                <input
                                    type="password"
                                    required
                                    value={signUpConfirm}
                                    onChange={e => setSignUpConfirm(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-gray-900 text-white rounded-md py-2 text-sm font-medium hover:bg-gray-700 disabled:opacity-50 transition-colors"
                            >
                                {isLoading ? 'Creating account...' : 'Create Account'}
                            </button>
                        </form>
                    )}

                    <div className="mt-6 text-center text-sm text-gray-500">
                        By continuing, you agree to our{' '}
                        <Link href="/terms" className="text-blue-600 hover:underline">Terms of Service</Link>
                        {' '}and{' '}
                        <Link href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>.
                    </div>
                </div>
            </div>
        </div>
    );
}

