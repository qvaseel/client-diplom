import React, { useState } from "react";
import { Schedule } from "@/interface";
import ScheduleEntryRow from "./ScheduleEntryRow";
import ScheduleEntryForm from "./ScheduleEntryForm";
import { PlusIcon } from "@heroicons/react/24/outline";
import { Box, Button, Card, Flex, Heading } from "@radix-ui/themes";

interface Props {
  dayOfWeek: number;
  dayName: string;
  schedule: Schedule[];
  selectedGroup: number | null;
}

const ScheduleDayColumn: React.FC<Props> = ({
  dayOfWeek,
  dayName,
  schedule,
  selectedGroup,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  return (
    <Box height="full">
      <Card className="h-full flex flex-col">
        <Flex
          as="div"
          display="flex"
          direction="column"
          gap="4"
          justify="between"
          className="flex-1 h-full"
        >
          <Flex as="div" display="flex" direction="column" gap="2">
            <Heading size="3" as="h3">
              {dayName}
            </Heading>
            {schedule
              .sort((a, b) => a.orderNumber - b.orderNumber)
              .map((entry) => (
                <ScheduleEntryRow
                  key={entry.id}
                  entry={entry}
                  selectedGroup={selectedGroup}
                />
              ))}

            {isAdding && selectedGroup !== null && (
              <ScheduleEntryForm
                dayOfWeek={dayOfWeek}
                selectedGroup={selectedGroup}
              />
            )}
          </Flex>

          <Button
            onClick={() => setIsAdding((prev) => !prev)}
            variant={`${isAdding ? "soft" : "outline"}`}
          >
            {isAdding ? "Отменить" : <PlusIcon className="w-6 h-6" />}
          </Button>
        </Flex>
      </Card>
    </Box>
  );
};

export default ScheduleDayColumn;
