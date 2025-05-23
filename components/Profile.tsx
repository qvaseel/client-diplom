import { User } from "@/interface";
import { Avatar, Flex, Heading, Link, Separator, Text } from "@radix-ui/themes";
import React from "react";

interface Props {
  profileUser: User;
  innerWidth: number;
}

const letterOfFallback = (profile: User) => {
  if (profile) {
    if (profile.role.id == 1) {
      return "Студент";
    } else if (profile.role.id == 2) {
      return "Преподаватель";
    } else {
      return "Админ";
    }
  }
};

const botUsername = "vebvuz_bot";

export const Profile: React.FC<Props> = ({ profileUser, innerWidth }) => {
  const avatarSize = innerWidth < 640 ? "6" : "9";
  const flexDir = innerWidth < 640 ? "column" : "row";

  return (
    <Flex as="div" display="flex" direction={flexDir} gap="5" p="2">
      <Avatar fallback={`${letterOfFallback(profileUser)}`} size={avatarSize} />
      <Flex as="div" display="flex" direction="column" gap="2">
        <Heading as="h3" size="4">
          Контактная информация
        </Heading>
        <Separator size="4" orientation="horizontal" />
        <Flex as="div" display="flex" direction="column">
          <Text size="1" weight="light" color="gray">
            Фамилия
          </Text>
          <Text>{profileUser.lastName}</Text>
        </Flex>
        <Flex as="div" display="flex" direction="column">
          <Text size="1" weight="light" color="gray">
            Имя
          </Text>
          <Text>{profileUser.firstName}</Text>
        </Flex>
        <Flex as="div" display="flex" direction="column">
          <Text size="1" weight="light" color="gray">
            Отчество
          </Text>
          <Text>{profileUser.patronymic}</Text>
        </Flex>
        <Flex as="div" display="flex" direction="column">
          <Text size="1" weight="light" color="gray">
            Почта
          </Text>
          <Link
            href={`https://t.me/${botUsername}?start=${encodeURIComponent(
              profileUser.email
            )}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {profileUser.email}
          </Link>
        </Flex>
        {profileUser.group && (
          <Flex as="div" display="flex" direction="column">
            <Text size="1" weight="light" color="gray">
              Группа
            </Text>
            <Text>
              {" "}
              {profileUser.group ? <p>{profileUser.group.name}</p> : <p></p>}
            </Text>
          </Flex>
        )}
      </Flex>
    </Flex>
  );
};
