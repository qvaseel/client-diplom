import React from "react";
import { useGroupStore } from "@/store/groupStore";
import { Select } from "@radix-ui/themes";

interface GroupSelectorProps {
  setSelectedGroup: (id: number | null) => void;
}

const GroupSelector: React.FC<GroupSelectorProps> = ({ setSelectedGroup }) => {
  const { groups } = useGroupStore();
  const [value, setValue] = React.useState<string>("");

  const handleChange = (val: string) => {
    setValue(val);
    setSelectedGroup(val ? Number(val) : null);
  };

  return (
    <div className="mb-4">
      <Select.Root value={value} onValueChange={handleChange}>
        <Select.Trigger placeholder="Выберите группу" />
        <Select.Content position="popper">
          {groups.map((group) => (
            <Select.Item key={group.id} value={String(group.id)}>
              {group.name}
            </Select.Item>
          ))}
        </Select.Content>
      </Select.Root>
    </div>
  );
};

export default GroupSelector;
