import React from "react";
import { useGroupStore } from "@/store/groupStore";
import { Select, Skeleton } from "@radix-ui/themes";
import { useDisciplineStore } from "@/store/disciplineStore";
import { Discipline } from "@/interface";

interface GroupSelectorProps {
  setSelectedDiscipline: (id: number | null) => void;
  disciplines: Discipline[];
  loading: boolean;
}

const DisciplineSelector: React.FC<GroupSelectorProps> = ({
  setSelectedDiscipline,
  disciplines,
  loading
}) => {
  const [value, setValue] = React.useState<string>("");

  const handleChange = (val: string) => {
    setValue(val);
    setSelectedDiscipline(val ? Number(val) : null);
  };

  return (
    <Skeleton loading={loading}>
      <Select.Root value={value} onValueChange={handleChange}>
        <Select.Trigger placeholder="Выберите дисциплину" />
        <Select.Content position="popper">
          {disciplines.map((group) => (
            <Select.Item key={group.id} value={String(group.id)}>
              {group.name}
            </Select.Item>
          ))}
        </Select.Content>
      </Select.Root>
    </Skeleton>
  );
};

export default DisciplineSelector;
