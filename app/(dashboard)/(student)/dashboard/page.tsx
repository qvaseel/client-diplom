"use client";

import { useUserProfile } from "@/hooks/useUserProfile";

export default function PageDashboard() {
  const { profileUser, loading } = useUserProfile();


  return (
      <div>
        <p>амамама</p>
      </div>
  );
}
