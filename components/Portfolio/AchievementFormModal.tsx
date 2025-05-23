"use client";

import { useForm } from "react-hook-form";
import {
  Dialog,
  TextField,
  Flex,
  Button,
} from "@radix-ui/themes";
import * as Label from "@radix-ui/react-label";
import { useState, useEffect } from "react";
import { Upload } from "lucide-react";
import { usePortfolioStore } from "@/store/portfolioStore";

interface Props {
  studentId: number;
  isOpen: boolean;
  onClose: (val: boolean) => void;
}

export const AchievementFormModal = ({ studentId, isOpen, onClose }: Props) => {
  const { register, handleSubmit, reset, setValue } = useForm();
  const [fileName, setFileName] = useState<string | null>(null);
  const { createAchievement } = usePortfolioStore();

  useEffect(() => {
    // регистрируем file вручную
    register("file");
  }, [register]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setValue("file", file); // напрямую, не массив!
    }
  };

  const onSubmit = async (data: any) => {
    const formData = new FormData();

    for (const key in data) {
      if (key !== "file") {
        formData.append(key, data[key]);
      }
    }

    formData.append("file", data.file);

    await createAchievement(studentId, formData);
    reset();
    setFileName(null);
    onClose(false); // Закрыть модалку
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Content>
        <Dialog.Title>Новое достижение</Dialog.Title>
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
              required
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
