'use client';
import React, { useEffect, useState } from "react";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileStats } from "@/components/profile/ProfileStats";
import { RecentActivity } from "@/components/profile/RecentActivity";
import { ProfileBadges } from "@/components/profile/ProfileBadges";
import { CompletedProjects } from "@/components/profile/CompletedProjects";
import { UserDetails } from "@/components/profile/UserDetails";
import { CVSection } from "@/components/profile/CVSection";
import { useSession } from "next-auth/react";
import { Loader } from "@/components/profile/Loader";

export default function ProfilePage({ params }: { params: Promise<{ userId: string }> }) {
    const [userId, setUserId] = useState<string | null>(null);
    const [userCv, setUserCv] = useState<string | null>(null);
    const [isOwnProfile, setIsOwnProfile] = useState(false);
    const { data: session } = useSession();

    useEffect(() => {
        const fetchParams = async () => {
            const resolvedParams = await params;
            setUserId(resolvedParams.userId);

            // Fetch user data to get CV
            try {
                const response = await fetch(`/api/forProfile/byUserId/${resolvedParams.userId}`);
                const data = await response.json();
                setUserCv(data.cv || null);

                // Check if viewing own profile
                if (session?.user?.email) {
                    const ownResponse = await fetch(`/api/forProfile/byEmail/${session.user.email}`);
                    const ownData = await ownResponse.json();
                    setIsOwnProfile(ownData.id === resolvedParams.userId);
                }
            } catch (err) {
                console.error('Error fetching user data:', err);
            }
        };

        fetchParams();
    }, [params, session]);

    const handleCVUpdate = (newCvUrl: string) => {
        setUserCv(newCvUrl);
    };

    if (!userId) {
        return (
            <div className='flex items-center justify-center h-40'>
                <Loader center text='Loading profile...' />
            </div>
        );
    }
  
    return (
      <>
        <div className='container mx-auto py-8 px-4 md:px-8 lg:max-w-320'>
          <div className='grid lg:grid-cols-3 gap-6'>
            <div className='lg:col-span-2'>
              <ProfileHeader id={userId} />
              <ProfileStats id={userId} />
              <CompletedProjects id={userId} />
              <RecentActivity id={userId} />
            </div>
            <div>
              <UserDetails id={userId} />
              <ProfileBadges id={userId} />
              <CVSection id={userId} cvUrl={userCv} isOwnProfile={isOwnProfile} onCVUpdate={handleCVUpdate} />
            </div>
          </div>
        </div>
      </>
    );
}
