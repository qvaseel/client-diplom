"use client";

import { useForm } from "react-hook-form";
import { Dialog, TextField, Flex, Button, Link } from "@radix-ui/themes";
import * as Label from "@radix-ui/react-label";
import { useState, useEffect } from "react";
import { Upload } from "lucide-react";
import { useHomeworkStore } from "@/store/homeworkStore";
import { Homework, Lesson } from "@/interface";

interface Props {
  isOpen: boolean;
  onClose: (val: boolean) => void;
  homework: Homework | null;
  lesson: Lesson | null;
}

export const TaskHomeworkModal = ({
  isOpen,
  onClose,
  homework,
  lesson,
}: Props) => {
  const { register, handleSubmit, setValue, reset } = useForm();
  const [fileName, setFileName] = useState<string | null>(null);
  const { updateHomework } = useHomeworkStore();

  useEffect(() => {
    register("file");
    setValue("title", homework?.title);
    setValue("description", homework?.description || "");
    setValue("dueDate", homework?.dueDate || "");
    setValue("lessonId", lesson?.id || "");
    setFileName(homework?.fileUrl?.split("/").pop() || null);
  }, [register, setValue, homework]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setValue("file", file);
    }
  };

const onSubmit = async (data: any) => {
  const formData = new FormData();

  // Прямое получение значений, если useForm не даёт ожидаемые
  formData.append("title", data.title || homework?.title || "");
  formData.append("description", data.description || homework?.description || "");
  formData.append("dueDate", data.dueDate || homework?.dueDate || "");
  formData.append("lessonId", lesson?.id?.toString() || "");

  if (data.file instanceof File) {
    formData.append("file", data.file);
  }

  console.log("✔ PATCH payload", formData);

  try {
    await updateHomework(homework?.id || 1, formData);
    reset();
    setFileName(null);
    onClose(false);
  } catch (err) {
    console.error("Ошибка при обновлении:", err);
  }
};

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Content>
        <Dialog.Title>Редактировать домашнее задание</Dialog.Title>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <TextField.Root
            {...register("title")}
            placeholder="Название"
            size="3"
            required
          />
          <TextField.Root
            {...register("description")}
            placeholder="Описание"
            size="3"
          />
          <TextField.Root
            {...register("dueDate")}
            type="date"
            placeholder="Дедлайн"
            size="3"
          />

          <div>
            <Link
              href={`https://server-diplom.onrender.com${homework?.fileUrl}`}
              target="_blank"
            >
              Открыть
            </Link>
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
