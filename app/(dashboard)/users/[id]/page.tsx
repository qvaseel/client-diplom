"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Box, Button, Flex, Spinner, Tabs } from "@radix-ui/themes";
import { StudentPortfolio } from "@/components/Portfolio/StudentPortfolio";
import { AchievementFormModal } from "@/components/Portfolio/AchievementFormModal";
import { useEffect, useState } from "react";
import { useUserStore } from "@/store/userStore";
import { useUserProfile } from "@/hooks/useUserProfile";
import { Profile } from "@/components/Profile";
import { useInnerWidth } from "@/hooks/useInnerWidth";

export default function UserPage() {
  const { id } = useParams();
  const router = useRouter();
  const studentId = Number(id);
  const { fetchUser, user, loading } = useUserStore();
  const { windowWidth } = useInnerWidth();

  useEffect(() => {
    fetchUser(studentId);
  }, [fetchUser]);

  if (!user) return <Spinner loading={loading} />;

  return (
    <div className="container mx-auto p-6">
      <Flex direction="column">
        <Flex direction="row" gap="2">
          <Button onClick={() => router.back()}>Вернуться назад</Button>
        </Flex>
        <div>
          <Tabs.Root defaultValue="account">
            <Tabs.List>
              <Tabs.Trigger value="account">Профиль</Tabs.Trigger>
            </Tabs.List>

            <Box pt="3">
              <Tabs.Content value="account">
                <Spinner loading={loading}>
                  {user && <Profile profileUser={user} innerWidth={windowWidth} />}
                </Spinner>
              </Tabs.Content>
            </Box>
          </Tabs.Root>
        </div>
      </Flex>
    </div>
  );
}
