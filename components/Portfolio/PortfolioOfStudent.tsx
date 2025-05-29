"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Button, Flex, Spinner } from "@radix-ui/themes";
import { StudentPortfolio } from "@/components/Portfolio/StudentPortfolio";
import { AchievementFormModal } from "@/components/Portfolio/AchievementFormModal";
import { useEffect, useState } from "react";
import { useUserStore } from "@/store/userStore";
import { usePortfolioStore } from "@/store/portfolioStore";
import { User } from "@/interface";
import { Portfolio } from "./Portfolio";

interface Props {
  user: User;
  innerWidth: number;
}

export default function PortfolioOfStudentPage({ user, innerWidth }: Props) {
    const { portfolio, fetchPortfolio } = usePortfolioStore();
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
      fetchPortfolio(user.id);
    }, [user]);


  return (
    <Flex direction="column">
      <Flex direction="row" gap="2">
        <Button onClick={() => setIsCreateModalOpen(true)}>
          Добавить достижение
        </Button>
      </Flex>
      <Portfolio
        userId={user.id}
        innerWidth={innerWidth}
      />
      <AchievementFormModal
        isOpen={isCreateModalOpen}
        onClose={setIsCreateModalOpen}
        studentId={user.id}
      />
    </Flex>
  );
}
