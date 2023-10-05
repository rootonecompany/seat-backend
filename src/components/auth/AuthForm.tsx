"use client";
import Button from "../inputs/Button";
import Input from "../inputs/Input";
import React, { useCallback, useState } from "react";
import { SubmitHandler, FieldValues, useForm } from "react-hook-form";
import AuthSocialButton from "./AuthSocialButton";
import axios from "axios";
import toast from "react-hot-toast";
import { signIn } from "next-auth/react";

type Variant = "LOGIN" | "REGISTER";

const AuthForm = () => {
  const [variant, setVariant] = useState<Variant>("LOGIN");
  const [isLoading, setIsLoading] = useState(false);

  const toggleVariant = useCallback(() => {
    if (variant === "LOGIN") {
      setVariant("REGISTER");
    } else {
      setVariant("LOGIN");
    }
  }, [variant]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);
    console.log(data);
    if (variant === "REGISTER") {
      // Axios Register
      axios
        .post("/api/register", data)
        .catch(() => {
          toast.error("안돼노");
        })
        .finally(() => {
          setIsLoading(false);
        });
    }

    if (variant === "LOGIN") {
      // NextAuth Signin
      signIn("credentials", { ...data, redirect: false })
        .then((callback) => {
          if (callback?.error) {
            toast.error("Invalid credentials");
          }

          if (callback?.ok && !callback?.error) {
            toast.success("로그인됨");
          }
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  const socialAction = (action: string) => {
    setIsLoading(true);

    signIn(action, { redirect: false })
      .then((callback) => {
        if (callback?.error) {
          toast.error("Invalid credentials");
        }

        if (callback?.ok && !callback?.error) {
          toast.success("로그인됨");
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div className="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {variant === "REGISTER" && (
            <Input
              id="name"
              label="이름"
              register={register}
              errors={errors}
              disabled={isLoading}
            />
          )}
          <Input
            type={"email"}
            id="email"
            label="이메일"
            register={register}
            errors={errors}
            disabled={isLoading}
          />
          <Input
            type={"password"}
            id="password"
            label="비밀번호"
            register={register}
            errors={errors}
            disabled={isLoading}
          />
          <div>
            <Button type="submit" disabled={isLoading} fullWidth>
              {variant === "LOGIN" ? "로그인" : "회원가입"}
            </Button>
          </div>
        </form>
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>

            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500">또는</span>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-2">
            <AuthSocialButton
              icon={"kakao"}
              onClick={() => socialAction("kakao")}
            />
            <AuthSocialButton
              icon={"google"}
              onClick={() => socialAction("google")}
            />
          </div>
        </div>

        <div className="flex gap-2 justify-center text-sm mt-6 px-2 text-gray-500">
          <div>
            {variant === "LOGIN"
              ? "아직 회원이 아니신가요?"
              : "이미 회원이신가요?"}
          </div>
          <div className="underline cursor-pointer" onClick={toggleVariant}>
            {variant === "LOGIN" ? "회원가입" : "로그인"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
