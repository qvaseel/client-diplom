"use client";

import { useForm } from "react-hook-form";
import {
  Dialog,
  TextField,
  Flex,
  Button,
  Link,
  Card,
  Text,
} from "@radix-ui/themes";
import * as Label from "@radix-ui/react-label";
import { useState, useEffect } from "react";
import { Upload } from "lucide-react";
import { useHomeworkStore } from "@/store/homeworkStore";
import { Homework, HomeworkSubmission, Lesson } from "@/interface";
import { useHomeworkSubmissionStore } from "@/store/homeworkSubmission";

interface Props {
  isOpen: boolean;
  onClose: (val: boolean) => void;
  homework: Homework | null;
  homeworkSubmissionId: number | null;
  lesson: Lesson | null;
}

export const ShowHomeworkModal = ({
  isOpen,
  onClose,
  homework,
  homeworkSubmissionId,
}: Props) => {
  const { register, handleSubmit, setValue, reset } = useForm();
  const [fileName, setFileName] = useState<string | null>(null);
  const [isDeadlinePassed, setIsDeadlinePassed] = useState(false);
  const { updateHomework, fetchOneHomeworkSubmission, homeworkSubmission } =
    useHomeworkSubmissionStore();

  useEffect(() => {
    if (isOpen && homeworkSubmissionId) {
      fetchOneHomeworkSubmission(homeworkSubmissionId);
    }
  }, [isOpen, homeworkSubmissionId]);

  useEffect(() => {
    register("file");
    setFileName(homeworkSubmission?.fileUrl?.split("/").pop() || null);
  }, [homeworkSubmission, register]);

  useEffect(() => {
    if (homework?.dueDate) {
      const due = new Date(homework.dueDate);
      setIsDeadlinePassed(new Date() > due);
    }
  }, [homework]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setValue("file", file);
    }
  };

  const onSubmit = async (data: any) => {
    if (isDeadlinePassed) {
      alert("Внимание: дедлайн уже прошёл. Задание может быть не принято.");
    }

    const formData = new FormData();

    if (data.file instanceof File) {
      formData.append("file", data.file);
    }

    if (!homeworkSubmission?.id) {
      console.error("Нет ID для домашнего задания");
      return;
    }

    await updateHomework(homeworkSubmission.id, formData);

    reset();
    setFileName(null);
    onClose(false);
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Content>
        <Dialog.Title>Отправить домашнее задание</Dialog.Title>
        <Card>
          Задание
          <Flex direction="column" gap="1">
            <Text>Название: {homework?.title}</Text>
            <Text>Описание: {homework?.description}</Text>
            <Flex gap="2" align="center">
              <Text>
                Дедлайн:{" "}
                {homework?.dueDate
                  ? new Date(homework.dueDate).toLocaleDateString("ru-RU", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })
                  : "не указан"}
              </Text>
              {isDeadlinePassed && (
                <Text color="red" weight="bold">
                  ⏰ Просрочено
                </Text>
              )}
            </Flex>
            {homework?.fileUrl && (
              <Text>
              <Link
                href={`${process.env.NEXT_PUBLIC_API_URL}${homework?.fileUrl}`}
                target="_blank"
              >
                Открыть файл с ДЗ
              </Link>
            </Text>
            )}
          </Flex>
        </Card>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {homeworkSubmission?.grade?.grade ? (
            <Flex direction="column" gap="2" p={"4"}>
              <Text weight="bold">Домашнее задание принято</Text>
              <Text>
                Оценка: {homeworkSubmission?.grade?.grade || "не выставлена"}
              </Text>
              <Text>
                Комментарий: {homeworkSubmission?.grade?.comment || "-"}
              </Text>
              <div>
                {homeworkSubmission?.fileUrl && (
                  <Link
                    href={`${process.env.NEXT_PUBLIC_API_URL}${homeworkSubmission?.fileUrl}`}
                    target="_blank"
                  >
                    Открыть ваш файл
                  </Link>
                )}
              </div>
            </Flex>
          ) : (
(
            <Flex direction="column" gap="2" p="4">
              <Text weight="bold">Прикрепите файл с домашним заданием</Text>

              <div>
                {homeworkSubmission?.fileUrl && (
                  <Link
                    href={`${process.env.NEXT_PUBLIC_API_URL}${homeworkSubmission?.fileUrl}`}
                    target="_blank"
                  >
                    Открыть ваш файл
                  </Link>
                )}
              </div>

              <div className="space-y-2">
                <Label.Root
                  htmlFor="fileUpload"
                  className="text-sm font-medium"
                >
                  Заменить файл (необязательно)
                </Label.Root>
                <label
                  htmlFor="fileUpload"
                  className="flex items-center justify-center gap-2 rounded border border-dashed border-gray-400 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                >
                  <Upload size={16} />
                  Выбрать файл
                </label>
                <input
                  id="fileUpload"
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                />

                {fileName && (
                  <p className="text-sm text-gray-600">
                    📎 Текущий файл:{" "}
                    <span className="font-medium">{fileName}</span>
                  </p>
                )}
              </div>
            </Flex>
          )
          )}

          <Flex justify="between">
            {!homeworkSubmission?.grade?.grade && (
              <Button type="submit">Сохранить</Button>
            )}
            <Dialog.Close>
              <Button variant="soft" type="button">
                Отмена
              </Button>
            </Dialog.Close>
          </Flex>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  );
};
