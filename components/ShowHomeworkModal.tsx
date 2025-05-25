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
  homeworkSubmission: HomeworkSubmission | null;
  lesson: Lesson | null;
}

export const ShowHomeworkModal = ({
  isOpen,
  onClose,
  homework,
  homeworkSubmission,
  lesson,
}: Props) => {
  const { register, handleSubmit, setValue, reset } = useForm();
  const [fileName, setFileName] = useState<string | null>(null);
  const { updateHomework } = useHomeworkSubmissionStore();

  useEffect(() => {
    register("file");
    setFileName(homeworkSubmission?.fileUrl?.split("/").pop() || null);
  }, [register, setValue, homeworkSubmission]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setValue("file", file);
    }
  };

  const onSubmit = async (data: any) => {
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
console.log(homework)
  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Content>
        <Dialog.Title>Отправить домашнее задание</Dialog.Title>
        <Card>
          Задание
          <Flex direction="column" gap="1">
            <Text>Название: {homework?.title}</Text>
            <Text>Описание: {homework?.description}</Text>
            <Text>Дедлайн: {homework?.dueDate}</Text>
            <Text>
              Файл:{" "}
              <Link
                href={`${process.env.NEXT_PUBLIC_API_URL}${homework?.fileUrl}`}
                target="_blank"
              >
                Открыть
              </Link>
            </Text>
          </Flex>
        </Card>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Text>Прикрепите файл с домашним заданием</Text>
          <div>
            {homeworkSubmission?.fileUrl && (<Link
              href={`${process.env.NEXT_PUBLIC_API_URL}${homeworkSubmission?.fileUrl}`}
              target="_blank"
            >
              Открыть
            </Link>)}
          </div>

          <div className="space-y-2">
            <Label.Root htmlFor="fileUpload" className="text-sm font-medium">
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
                📎 Текущий файл: <span className="font-medium">{fileName}</span>
              </p>
            )}
          </div>

          <Flex justify="between">
            <Button type="submit">Сохранить</Button>
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
