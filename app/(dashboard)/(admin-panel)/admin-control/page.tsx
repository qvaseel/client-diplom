import { Suspense } from "react";
import AdminControlClient from "@/components/AdmonControlClient";

export default function AdminControlPage() {
  return (
    <Suspense fallback={<div>Загрузка...</div>}>
      <AdminControlClient />
    </Suspense>
  );
}
