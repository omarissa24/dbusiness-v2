"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { z } from "zod";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { toast } from "sonner";

const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formErrors, setFormErrors] = useState<Partial<ForgotPasswordFormData>>(
    {}
  );
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setFormErrors({});

    const formData = new FormData(e.currentTarget);
    const data = {
      email: formData.get("email") as string,
    };

    try {
      // Validate form data
      const validatedData = forgotPasswordSchema.parse(data);

      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(validatedData),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData);
      }

      setSuccess(true);
      toast.success("Password reset link sent to your email");
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: Partial<ForgotPasswordFormData> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            errors[err.path[0] as keyof ForgotPasswordFormData] = err.message;
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
            Forgot Password
          </h2>
          <p className='mt-2 text-center text-sm text-gray-600'>
            Enter your email address and we&apos;ll send you a link to reset
            your password.
          </p>
        </motion.div>

        {success ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className='text-center'
          >
            <p className='text-green-600 mb-4'>
              Password reset link has been sent to your email.
            </p>
          </motion.div>
        ) : (
          <form className='mt-8 space-y-6' onSubmit={handleSubmit}>
            <div>
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <label htmlFor='email' className='sr-only'>
                  Email address
                </label>
                <motion.input
                  id='email'
                  name='email'
                  type='email'
                  required
                  className={`relative block w-full rounded-md border-0 px-4 py-3 text-gray-900 ring-1 ring-inset ${
                    formErrors.email ? "ring-red-300" : "ring-gray-200"
                  } placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-500/50 sm:text-sm sm:leading-6`}
                  placeholder='Email address'
                  whileFocus={{ scale: 1.02, transition: { duration: 0.2 } }}
                />
                {formErrors.email && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className='mt-1 text-sm text-red-600'
                  >
                    {formErrors.email}
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
                    <span>Sending reset link...</span>
                  </div>
                ) : (
                  "Send reset link"
                )}
              </motion.button>
            </motion.div>
          </form>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className='text-center'
        >
          <Link
            href='/login'
            className='text-sm text-indigo-600 hover:text-indigo-500'
          >
            Back to login
          </Link>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
