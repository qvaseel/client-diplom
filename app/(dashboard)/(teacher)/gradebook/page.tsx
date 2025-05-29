import { Suspense } from "react";
import TeacherJournalPage from "@/components/TeacherJournalPage";

export default function GradebookPage() {
  return (
    <Suspense fallback={<div>Загрузка...</div>}>
      <TeacherJournalPage />
    </Suspense>
  );
}
