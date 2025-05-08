"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { z } from "zod";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { toast } from "sonner";

const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formErrors, setFormErrors] = useState<Partial<ResetPasswordFormData>>(
    {}
  );
  const [success, setSuccess] = useState(false);

  if (!token) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-gray-50'>
        <div className='text-center'>
          <h1 className='text-2xl font-bold mb-2'>Invalid Reset Link</h1>
          <p className='text-gray-600 mb-4'>
            This password reset link is invalid or has expired.
          </p>
          <Link
            href='/forgot-password'
            className='text-indigo-600 hover:text-indigo-500'
          >
            Request a new reset link
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setFormErrors({});

    const formData = new FormData(e.currentTarget);
    const data = {
      password: formData.get("password") as string,
      confirmPassword: formData.get("confirmPassword") as string,
    };

    try {
      // Validate form data
      const validatedData = resetPasswordSchema.parse(data);

      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          password: validatedData.password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData);
      }

      setSuccess(true);
      toast.success("Password has been reset successfully");
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: Partial<ResetPasswordFormData> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            errors[err.path[0] as keyof ResetPasswordFormData] = err.message;
          }
        });
        setFormErrors(errors);
      } else {
        setError(
          error instanceof Error ? error.message : "Something went wrong"
        );
        toast.error(
          error instanceof Error ? error.message : "Something went wrong"
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className='flex min-h-screen items-center justify-center bg-gray-50'
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className='w-full max-w-md space-y-8 rounded-lg bg-white p-6 shadow-lg'
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className='mt-6 text-center text-3xl font-bold tracking-tight text-gray-900'>
            Reset Password
          </h2>
          <p className='mt-2 text-center text-sm text-gray-600'>
            Enter your new password below.
          </p>
        </motion.div>

        {success ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className='text-center'
          >
            <p className='text-green-600 mb-4'>
              Your password has been reset successfully.
            </p>
            <Link
              href='/login'
              className='text-sm text-indigo-600 hover:text-indigo-500'
            >
              Return to login
            </Link>
          </motion.div>
        ) : (
          <form className='mt-8 space-y-6' onSubmit={handleSubmit}>
            <div className='space-y-4'>
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <label htmlFor='password' className='sr-only'>
                  New Password
                </label>
                <motion.input
                  id='password'
                  name='password'
                  type='password'
                  required
                  className={`relative block w-full rounded-t-md border-0 px-4 py-3 text-gray-900 ring-1 ring-inset ${
                    formErrors.password ? "ring-red-300" : "ring-gray-200"
                  } placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-500/50 sm:text-sm sm:leading-6`}
                  placeholder='New Password'
                  whileFocus={{ scale: 1.02, transition: { duration: 0.2 } }}
                />
                {formErrors.password && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className='mt-1 text-sm text-red-600'
                  >
                    {formErrors.password}
                  </motion.p>
                )}
              </motion.div>

              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <label htmlFor='confirmPassword' className='sr-only'>
                  Confirm Password
                </label>
                <motion.input
                  id='confirmPassword'
                  name='confirmPassword'
                  type='password'
                  required
                  className={`relative block w-full rounded-b-md border-0 px-4 py-3 text-gray-900 ring-1 ring-inset ${
                    formErrors.confirmPassword
                      ? "ring-red-300"
                      : "ring-gray-200"
                  } placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-500/50 sm:text-sm sm:leading-6`}
                  placeholder='Confirm Password'
                  whileFocus={{ scale: 1.02, transition: { duration: 0.2 } }}
                />
                {formErrors.confirmPassword && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className='mt-1 text-sm text-red-600'
                  >
                    {formErrors.confirmPassword}
                  </motion.p>
                )}
              </motion.div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className='text-sm text-red-600 text-center'
              >
                {error}
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <motion.button
                type='submit'
                disabled={isLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className='group relative flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 cursor-pointer'
              >
                {isLoading ? (
                  <div className='flex items-center gap-2'>
                    <LoadingSpinner size={20} />
                    <span>Resetting password...</span>
                  </div>
                ) : (
                  "Reset Password"
                )}
              </motion.button>
            </motion.div>
          </form>
        )}
      </motion.div>
    </motion.div>
  );
}
