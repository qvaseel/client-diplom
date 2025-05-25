import { useLessonStore } from "@/store/lessonStore";
import LessonCard from "./LessonCard";
import { useEffect } from "react";
import { formatDateLocal } from "@/utils/formatDateLocal";
import { useGradeStore } from "@/store/gradeStore";
import { useUserProfile } from "@/hooks/useUserProfile";

type Props = {
  date: string;
};

export default function DaySchedule({ date }: Props) {
  const formattedDate = formatDateLocal(new Date(date));
  const { diaryByDate, loadDiaryByDate } = useGradeStore();
  const { profileUser } = useUserProfile();
  const grades = diaryByDate[formattedDate] || [];

  useEffect(() => {
    if (profileUser?.id && !diaryByDate[formattedDate]) {
      loadDiaryByDate(formattedDate, profileUser.id);
    }
  }, [formattedDate, profileUser]);

  return (
    <div className="bg-white rounded-xl shadow p-4">
      <h2 className="text-lg font-semibold mb-2">
        {new Date(date).toLocaleDateString("ru-RU", {
          weekday: "long",
          day: "numeric",
          month: "long",
        })}
      </h2>
      {grades.length > 0 ? (
        <div className="space-y-2">
          {grades.map((grade) => (
            <LessonCard key={grade.id} grade={grade} />
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-500">Нет оценок за этот день</p>
      )}
    </div>
  );
}
