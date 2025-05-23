"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Button, Flex, Spinner } from "@radix-ui/themes";
import { StudentPortfolio } from "@/components/Portfolio/StudentPortfolio";
import { AchievementFormModal } from "@/components/Portfolio/AchievementFormModal";
import { useEffect, useState } from "react";
import { useUserStore } from "@/store/userStore";

export default function PortfolioStudentPage() {
  const { id } = useParams();
  const router = useRouter();
  const studentId = Number(id);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { fetchUser, user, loading } = useUserStore();

  useEffect(() => {
    fetchUser(studentId);
  }, [fetchUser]);

  // const searchParams = useSearchParams();
  // const groupId = searchParams.get("groupId");
  // const disciplineId = searchParams.get("disciplineId");

  if (!user) return <Spinner loading={loading}/>;

  return (
    <Flex direction="column">
      <Flex direction="row" gap="2">
        <Button onClick={() => router.back()}>Вернуться назад</Button>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          Добавить достижение
        </Button>
      </Flex>
      <StudentPortfolio
        userId={studentId}
        firstName={user?.firstName}
        lastName={user?.lastName}
        patronymic={user?.patronymic}
      />
      <AchievementFormModal
        isOpen={isCreateModalOpen}
        onClose={setIsCreateModalOpen}
        studentId={studentId}
      />
    </Flex>
  );
}
