"use client";

import LoginForm from "@/components/LoginForm";
import { Heading } from "@radix-ui/themes";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-white">
      <div className="absolute inset-0">
        <div className="h-2/5 bg-blue-300"></div>
      </div>
      <div className="relative z-10 w-full px-4 sm:px-6">
        <LoginForm />
      </div>
    </div>
  );
}
