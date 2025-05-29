"use client";

import { useForm } from "react-hook-form";
import {
  Dialog,
  TextField,
  Flex,
  Button,
  Text
} from "@radix-ui/themes";
import * as Label from "@radix-ui/react-label";
import { useState, useEffect } from "react";
import { Upload } from "lucide-react";
import { Lesson } from "@/interface";
import { useHomeworkStore } from "@/store/homeworkStore";

interface Props {
  lesson: Lesson | null;
  isOpen: boolean;
  onClose: (val: boolean) => void;
  onCreated?: () => void;
}

export const CreateHomeworkModal = ({ lesson, isOpen, onClose, onCreated }: Props) => {
  const { register, handleSubmit, reset, setValue } = useForm();
  const [fileName, setFileName] = useState<string | null>(null);
  const { createHomework } = useHomeworkStore();

  useEffect(() => {
    register("file");
  }, [register]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setValue("file", file);
    }
  };

const onSubmit = async (data: any) => {
  const formData = new FormData();

  for (const key in data) {
    if (key !== "file") {
      formData.append(key, data[key]);
    }
  }

  formData.append("lessonId", String(lesson?.id));

  if (data.file) {
    formData.append("file", data.file);
  }

  // 🔍 Лог FormData для отладки
  for (const pair of formData.entries()) {
    console.log(`${pair[0]}:`, pair[1]);
  }

  try {
    await createHomework(formData);
    reset();
    setFileName(null);
    onClose(false);
    onCreated?.();
  } catch (err) {
    console.error("Ошибка при создании ДЗ:", err);
  }
};


  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Content>
        <Dialog.Title>Домашнее задание</Dialog.Title>
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
           <Label.Root htmlFor="dueDate" className="text-sm font-medium">
              Дедлайн
            </Label.Root>
          <TextField.Root
            {...register("dueDate")}
            type="date"
            placeholder="Дедлайн"
            size="3"
          />

          <div className="space-y-2">
            <Label.Root htmlFor="fileUpload" className="text-sm font-medium">
              Загрузите файл
            </Label.Root>

            <label
              htmlFor="fileUpload"
              className="flex items-center justify-center gap-2 rounded border border-dashed border-gray-400 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
            >
              <Upload size={16} />
              Нажмите, чтобы выбрать файл
            </label>

            <input
              id="fileUpload"
              type="file"
              className="hidden"
              onChange={handleFileChange}
            />

            {fileName && (
              <p className="text-sm text-gray-600">
                📎 Прикреплённый файл:{" "}
                <span className="font-medium">{fileName}</span>
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
