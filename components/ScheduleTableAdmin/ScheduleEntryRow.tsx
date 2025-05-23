import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useScheduleStore } from "@/store/scheduleStore";
import { useDisciplineStore } from "@/store/disciplineStore";
import { useUserStore } from "@/store/userStore";
import { Schedule, CreateScheduleDto } from "@/interface";
import { Box, Button, Card, Flex, Select, TextField } from "@radix-ui/themes";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";

interface Props {
  entry: Schedule;
  selectedGroup: number | null;
}

const ScheduleEntryRow: React.FC<Props> = ({ entry, selectedGroup }) => {
  const { updateSchedule, deleteSchedule, fetchScheduleForGroup } =
    useScheduleStore();
  const { disciplines, fetchDisciplines } = useDisciplineStore();
  const { users, fetchTeachers } = useUserStore();
  const [editing, setEditing] = useState(false);

  const { register, control, handleSubmit, reset } =
    useForm<Partial<CreateScheduleDto>>();

  useEffect(() => {
    fetchDisciplines();
    fetchTeachers();
  }, []);

  const handleDelete = async () => {
    await deleteSchedule(entry.id);
    if (selectedGroup) await fetchScheduleForGroup(selectedGroup);
  };

  const handleEdit = () => {
    reset({
      disciplineId: entry.discipline.id,
      room: entry.room,
      teacherId: entry.teacher?.id,
      orderNumber: entry.orderNumber,
    });
    setEditing(true);
  };

  const onSubmit = async (data: Partial<CreateScheduleDto>) => {
    if (!selectedGroup) return;

    await updateSchedule(entry.id, {
      ...data,
      groupId: selectedGroup,
      dayOfWeek: entry.dayOfWeek,
    });
    if (selectedGroup) await fetchScheduleForGroup(selectedGroup);
    setEditing(false);
  };

  if (editing) {
    return (
      <Card className="bg-sky-100">
        <form
          onSubmit={handleSubmit(onSubmit)}
        >
          <Flex display='flex' direction='column' gap='2'>
            <TextField.Root
              {...register("orderNumber", { valueAsNumber: true })}
              type="number"
              placeholder="Порядковый номер"
              size="1"
            />

            <Controller
              name="disciplineId"
              control={control}
              render={({ field }) => (
                <Select.Root
                  value={field.value ? String(field.value) : ""}
                  onValueChange={(value) => field.onChange(Number(value))}
                  size="1"
                >
                  <Select.Trigger placeholder="Выберите дисциплину" />

                  <Select.Content position="popper">
                    {disciplines.map((d) => (
                      <Select.Item key={d.id} value={String(d.id)}>
                        {d.name}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Root>
              )}
            />

            <Controller
              name="teacherId"
              control={control}
              render={({ field }) => (
                <Select.Root
                  value={field.value ? String(field.value) : ""}
                  onValueChange={(value) => field.onChange(Number(value))}
                  size="1"
                >
                  <Select.Trigger placeholder="Выберите преподавателя" />

                  <Select.Content position="popper">
                    {users.map((t) => (
                      <Select.Item key={t.id} value={String(t.id)}>
                        {`${t.lastName} ${t.firstName[0]}. ${t.patronymic[0]}.`}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Root>
              )}
            />

            <TextField.Root
              {...register("room")}
              placeholder="Аудитория"
              size="1"
            />

            <div className="flex justify-between gap-2">
              <Button type="submit" color="green">
                Сохранить
              </Button>
              <Button
                type="button"
                color="gray"
                onClick={() => setEditing(false)}
              >
                Отмена
              </Button>
            </div>
          </Flex>
        </form>
      </Card>
    );
  }

  return (
    <Box>
      <Card>
        <Flex display="flex" direction="row" justify="between" align="center">
          <div>
            <div>
              <strong>#{entry.orderNumber}</strong> — {entry.discipline.name}
            </div>
            <div className="text-sm text-gray-600">
              Преподаватель:{" "}
              {`${entry.teacher.lastName} ${entry.teacher.firstName[0]}. ${entry.teacher.patronymic[0]}.` ||
                "—"}
              , Аудитория: {entry.room}
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleEdit}>
              <PencilIcon className="h-5 w-5" />
            </Button>
            <Button onClick={handleDelete}>
              <TrashIcon className="h-5 w-5" />
            </Button>
          </div>
        </Flex>
      </Card>
    </Box>
  );
};

export default ScheduleEntryRow;

{
  /* <Controller
          name="disciplineId"
          control={control}
          render={({ field }) => (
            <select {...field} className="border p-1 mb-1 w-full">
              <option value="">Выберите дисциплину</option>
              {disciplines.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          )}
        /> */
}

{
  /* <Controller
          name="teacherId"
          control={control}
          render={({ field }) => (
            <select {...field} className="border p-1 mb-1 w-full">
              <option value="">Выберите преподавателя</option>
              {users.map((t) => (
                <option
                  key={t.id}
                  value={t.id}
                >{`${t.lastName} ${t.firstName[0]}. ${t.patronymic[0]}.`}</option>
              ))}
            </select>
          )}
        /> */
}
