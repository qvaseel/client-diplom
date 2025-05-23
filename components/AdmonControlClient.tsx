"use client";

import AdminDisciplinesPage from "@/components/DisciplinesControl/AdminDisciplinesControl";
import AdminGroupsPage from "@/components/GroupsControl/AdminGroupsControl";
import { AdminStudentsControl } from "@/components/StudentsControl/AdminStudentsControl";
import { AdminTeachersControl } from "@/components/TeachersControl/AdminTeachersControl";
import { Box, Tabs } from "@radix-ui/themes";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminControlClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const tabFromQuery = searchParams.get("tab") || "students";
  const [activeTab, setActiveTab] = useState(tabFromQuery);

  useEffect(() => {
    setActiveTab(tabFromQuery);
  }, [tabFromQuery]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    const params = new URLSearchParams(searchParams);
    params.set("tab", value);
    router.replace(`?${params.toString()}`);
  };

  return (
    <Tabs.Root value={activeTab} onValueChange={handleTabChange}>
      <Tabs.List>
        <Tabs.Trigger value="students">Студенты</Tabs.Trigger>
        <Tabs.Trigger value="teachers">Преподаватели</Tabs.Trigger>
        <Tabs.Trigger value="groups">Группы</Tabs.Trigger>
        <Tabs.Trigger value="disciplines">Дисциплины</Tabs.Trigger>
      </Tabs.List>

      <Box pt="3">
        <Tabs.Content value="students">
          <AdminStudentsControl />
        </Tabs.Content>

        <Tabs.Content value="teachers">
          <AdminTeachersControl />
        </Tabs.Content>

        <Tabs.Content value="groups">
          <AdminGroupsPage />
        </Tabs.Content>

        <Tabs.Content value="disciplines">
          <AdminDisciplinesPage />
        </Tabs.Content>
      </Box>
    </Tabs.Root>
  );
}
