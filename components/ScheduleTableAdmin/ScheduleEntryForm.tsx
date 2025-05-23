import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useDisciplineStore } from "@/store/disciplineStore";
import { useUserStore } from "@/store/userStore";
import { useScheduleStore } from "@/store/scheduleStore";
import { CreateScheduleDto } from "@/interface";
import { Button, Select, TextField } from "@radix-ui/themes";

interface Props {
  dayOfWeek: number;
  selectedGroup: number | null;
}

const ScheduleEntryForm: React.FC<Props> = ({ dayOfWeek, selectedGroup }) => {
  const { disciplines, fetchDisciplines } = useDisciplineStore();
  const { users, fetchTeachers } = useUserStore();
  const { createSchedule, fetchScheduleForGroup } = useScheduleStore();

  const { handleSubmit, register, control, reset } =
    useForm<Partial<CreateScheduleDto>>();

  useEffect(() => {
    fetchDisciplines();
    fetchTeachers();
  }, []);

  const onSubmit = async (data: Partial<CreateScheduleDto>) => {
    if (!selectedGroup) return;

    await createSchedule({
      ...data,
      groupId: selectedGroup,
      dayOfWeek,
    });

    await fetchScheduleForGroup(selectedGroup);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
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

      <TextField.Root
        {...register("orderNumber", { valueAsNumber: true })}
        type="number"
        placeholder="Порядковый номер пары"
        size="1"
      />

      <Button
        type="submit"
      >
        Добавить
      </Button>
    </form>
  );
};

export default ScheduleEntryForm;

{
  /* <Controller
name="disciplineId"
control={control}
render={({ field }) => (
  <select
    {...field}
    onChange={(e) => field.onChange(Number(e.target.value))}
    className="border p-1 mb-1 w-full"
    value={field.value ?? ""}
  >
    <option value="">Выберите дисциплину</option>
    {disciplines.map((d) => (
      <option key={d.id} value={d.id}>
        {d.name}
      </option>
    ))}
  </select>
)}
/>

<Controller
name="teacherId"
control={control}
render={({ field }) => (
  <select
    {...field}
    onChange={(e) => field.onChange(Number(e.target.value))}
    className="border p-1 mb-1 w-full"
    value={field.value ?? ""}
  >
    <option value="">Выберите преподавателя</option>
    {users.map((t) => (
      <option key={t.id} value={t.id}>
        {`${t.lastName} ${t.firstName[0]}. ${t.patronymic[0]}.`}
      </option>
    ))}
  </select>
)}
/> */
}
