"use client";
import { useEffect, useState } from "react";
import { useUserStore } from "@/store/userStore";
import {
  Table,
  Flex,
  Select,
  Text,
  Button,
} from "@radix-ui/themes";
import { useGroupStore } from "@/store/groupStore";
import { User } from "@/interface";
import dayjs from "dayjs";
import { usePortfolioStore } from "@/store/portfolioStore";
import { useRouter } from "next/navigation";

const TeacherStudentsPage: React.FC = () => {
  const router = useRouter();

  const { users, fetchStudents, deleteUser } = useUserStore();
  const { createPortfolio } = usePortfolioStore();
  const { groups, fetchGroups } = useGroupStore();

  const [selectedGroupId, setSelectedGroupId] = useState<string>("all");

  useEffect(() => {
    fetchStudents();
    fetchGroups();
  }, []);

  const filteredUsers =
  (selectedGroupId === "all"
    ? users
    : users.filter((user) => user.group?.id.toString() === selectedGroupId)
  ).sort((a, b) => a.lastName.localeCompare(b.lastName));

  const handleCreatePortfolio = async (id: number) => {
    await createPortfolio(id);
    router.push(`/teacher-students/${id}`)
  };

  const isPortfolio = (user: User) => {
    if (user.portfolio) {
      return <Button onClick={()  => router.push(`/teacher-students/${user.id}`)}>Перейти</Button>;
    } else {
      return <Button onClick={() => handleCreatePortfolio(user.id)}>Создать</Button>;
    }
  };

  return (
    <Flex gap="4" direction="column">
      <Flex justify="between" align="center">
        <Flex gap="2" align="center">
          <Text weight="bold">Фильтр по группам:</Text>
          <Select.Root
            value={selectedGroupId}
            onValueChange={setSelectedGroupId}
          >
            <Select.Trigger placeholder="Выберите группу" />
            <Select.Content position="popper">
              <Select.Item value="all">Все группы</Select.Item>
              {groups.map((group) => (
                <Select.Item key={group.id} value={group.id.toString()}>
                  {group.name}
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Root>
        </Flex>
      </Flex>

      <Table.Root>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>ФИО</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Дата рождения</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Группа</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Email</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Портфолио</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {filteredUsers.map((user, index) => (
            <Table.Row key={index}>
              <Table.Cell>
                {`${user.lastName ?? ""} ${user.firstName?.[0] ?? ""}. ${
                  user.patronymic?.[0] ?? ""
                }.`}
              </Table.Cell>
              <Table.Cell>
                {dayjs(user.dateOfBirth).format("DD.MM.YYYY")}
              </Table.Cell>
              <Table.Cell>{user.group?.name}</Table.Cell>
              <Table.Cell>{user.email}</Table.Cell>
              <Table.Cell>{isPortfolio(user)}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Flex>
  );
};

export default TeacherStudentsPage;
