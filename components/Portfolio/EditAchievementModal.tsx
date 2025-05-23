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
  isOpen: boolean;
  onClose: (val: boolean) => void;
  achievement: {
    id: number;
    title: string;
    description?: string;
    fileUrl: string;
  };
  userId: number;
}

export const EditAchievementModal = ({ isOpen, onClose, achievement, userId }: Props) => {
  const { register, handleSubmit, setValue, reset } = useForm();
  const [fileName, setFileName] = useState<string | null>(null);
  const { updateAchievement } = usePortfolioStore();

  useEffect(() => {
    register("file");
    setValue("title", achievement.title);
    setValue("description", achievement.description || "");
    setFileName(achievement.fileUrl.split("/").pop() || null);
  }, [register, setValue, achievement]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setValue("file", file);
    }
  };

  const onSubmit = async (data: any) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description || "");

    if (data.file instanceof File) {
      formData.append("file", data.file);
    }

    await updateAchievement(achievement.id, formData, userId);
    reset();
    setFileName(null);
    onClose(false);
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Content>
        <Dialog.Title>Редактировать достижение</Dialog.Title>
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
