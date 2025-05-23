import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import useAuthStore from "@/store/authStore";
import {
  Button,
  Link,
  Text,
  TextField,
  Flex,
  Badge,
  Callout,
} from "@radix-ui/themes";
import { redirect } from "next/navigation";
import { useUserProfile } from "@/hooks/useUserProfile";
import icon from "../public/icon.png";
import Image from "next/image";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

interface LoginFormInputs {
  email: string;
  password: string;
}

const LoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    defaultValues: {
      email: "student6@vuz.ru",
      password: "12345678",
    },
  });
  const { login } = useAuthStore();
  const [loginError, setLoginError] = useState(false);

  const onSubmit = async (data: LoginFormInputs) => {
    const success = await login(data.email, data.password);
    const { decodedUser } = useAuthStore.getState();
    if (success) {
      if (decodedUser?.roles) {
        if (decodedUser.roles[0] === "ADMIN") {
          redirect("/admin-schedule");
        } else if (decodedUser.roles[0] === "TEACHER") {
          redirect("/teacher-schedule");
        } else {
          redirect("/schedule");
        }
      }
      setLoginError(false);
    } else {
      setLoginError(true);
      setTimeout(() => {
        setLoginError(false);
      }, 5000);
    }
  };

  return (
    <div className="w-full max-w-md p-6 sm:p-10 flex flex-col items-center gap-10 mx-auto shadow-2xl rounded-lg bg-white">
      <div className="flex flex-col gap-4">
        <Text
          className="text-xl sm:text-3xl"
          weight="medium"
          align="center"
          highContrast
        >
          Вход в систему
        </Text>
      </div>

      {loginError && (
        <Callout.Root
          color="red"
          role="alert"
          className="fixed bottom-4 right-4 p-4 max-w-xs rounded-lg shadow-lg transition-all transform opacity-100"
          style={{
            opacity: loginError ? 1 : 0,
            transition: "opacity 0.5s ease-in-out",
            zIndex: 9999,
          }}
        >
          <Callout.Icon>
            <ExclamationTriangleIcon />
          </Callout.Icon>
          <Callout.Text>
            Не удалось войти. Проверьте почту и пароль.
          </Callout.Text>
        </Callout.Root>
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-6 w-full"
      >
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <TextField.Root
              size="3"
              variant="classic"
              type="email"
              {...register("email", { required: "Введите почту" })}
              placeholder="Почта"
            />
            {errors.email && (
              <span className="text-red-700 text-sm">
                {errors.email.message}
              </span>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <TextField.Root
              size="3"
              variant="classic"
              type="password"
              {...register("password", { required: "Введите пароль" })}
              placeholder="Пароль"
            />
            {errors.password && (
              <span className="text-red-700 text-sm">
                {errors.password.message}
              </span>
            )}
          </div>
        </div>
        <Button security="4" variant="solid" type="submit">
          Войти
        </Button>
      </form>
    </div>
  );
};

export default LoginForm;
