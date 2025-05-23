"use client";

import { Portfolio } from "@/components/Portfolio/Portfolio";
import { Profile } from "@/components/Profile";
import StudentGradesPage from "@/components/StudentGradesPages";
import { useInnerWidth } from "@/hooks/useInnerWidth";
import { useUserProfile } from "@/hooks/useUserProfile";
import { Box, Spinner, Tabs } from "@radix-ui/themes";

export default function ProfilePage() {
  const { profileUser, loading } = useUserProfile();
  const { windowWidth } = useInnerWidth();

  const tabsSize = windowWidth < 640 ? "1" : "2";

  return (
    <div>
      <Tabs.Root defaultValue="account">
        <Tabs.List size={tabsSize}>
          <Tabs.Trigger value="account">Ваш профиль</Tabs.Trigger>
          <Tabs.Trigger value="grades">Оценки</Tabs.Trigger>
          <Tabs.Trigger value="portfolio">Портфолио</Tabs.Trigger>
        </Tabs.List>

        <Box pt="3">
          <Tabs.Content value="account">
            <Spinner loading={loading}>
              {profileUser && (
                <Profile profileUser={profileUser} innerWidth={windowWidth} />
              )}
            </Spinner>
          </Tabs.Content>

          <Tabs.Content value="grades">
            <StudentGradesPage innerWidth={windowWidth} />
          </Tabs.Content>

          <Tabs.Content value="portfolio">
            {profileUser && (
              <Spinner loading={loading}>
                <Portfolio innerWidth={windowWidth} userId={profileUser?.id} />
              </Spinner>
            )}
          </Tabs.Content>
        </Box>
      </Tabs.Root>
    </div>
  );
}
