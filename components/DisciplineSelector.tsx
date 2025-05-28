import React, { useEffect } from "react";
import { useGroupStore } from "@/store/groupStore";
import { Select, Skeleton } from "@radix-ui/themes";
import { useDisciplineStore } from "@/store/disciplineStore";
import { Discipline } from "@/interface";

interface GroupSelectorProps {
  setSelectedDiscipline: (id: number | null) => void;
  selectedDiscipline: number | null;
  disciplines: Discipline[];
  loading: boolean;
}

const DisciplineSelector: React.FC<GroupSelectorProps> = ({
  setSelectedDiscipline,
  selectedDiscipline,
  disciplines,
  loading
}) => {
  const [value, setValue] = React.useState<string>("");

  useEffect(() => {
    if (selectedDiscipline !== null) {
      setValue(String(selectedDiscipline));
    }
  }, [selectedDiscipline]);

  const handleChange = (val: string) => {
    setValue(val);
    setSelectedDiscipline(val ? Number(val) : null);
  };

  return (
    <Skeleton loading={loading}>
      <Select.Root value={value} onValueChange={handleChange}>
        <Select.Trigger placeholder="Выберите дисциплину" />
        <Select.Content position="popper">
          {disciplines.map((discipline) => (
            <Select.Item key={discipline.id} value={String(discipline.id)}>
              {discipline.name}
            </Select.Item>
          ))}
        </Select.Content>
      </Select.Root>
    </Skeleton>
  );
};

export default DisciplineSelector;
