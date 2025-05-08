"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { z } from "zod";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formErrors, setFormErrors] = useState<Partial<RegisterFormData>>({});

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setFormErrors({});

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    };

    try {
      // Validate form data
      const validatedData = registerSchema.parse(data);

      const response = await fetch("/api/register", {
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

      router.push("/login");
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: Partial<RegisterFormData> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            errors[err.path[0] as keyof RegisterFormData] = err.message;
          }
        });
        setFormErrors(errors);
      } else {
        setError(
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
            Create your account
          </h2>
        </motion.div>
        <form className='mt-8 space-y-6' onSubmit={handleSubmit}>
          <div className='-space-y-px rounded-md shadow-sm'>
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <label htmlFor='name' className='sr-only'>
                Full name
              </label>
              <motion.input
                id='name'
                name='name'
                type='text'
                required
                className={`relative block w-full rounded-t-md border-0 py-1.5 px-3 text-gray-900 ring-1 ring-inset ${
                  formErrors.name ? "ring-red-300" : "ring-gray-200"
                } placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-500/50 sm:text-sm sm:leading-6`}
                placeholder='Full name'
                whileFocus={{ scale: 1.02, transition: { duration: 0.2 } }}
              />
              {formErrors.name && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className='mt-1 text-sm text-red-600'
                >
                  {formErrors.name}
                </motion.p>
              )}
            </motion.div>
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <label htmlFor='email' className='sr-only'>
                Email address
              </label>
              <motion.input
                id='email'
                name='email'
                type='email'
                required
                className={`relative block w-full border-0 py-1.5 px-3 text-gray-900 ring-1 ring-inset ${
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
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <label htmlFor='password' className='sr-only'>
                Password
              </label>
              <motion.input
                id='password'
                name='password'
                type='password'
                required
                className={`relative block w-full rounded-b-md border-0 py-1.5 px-3 text-gray-900 ring-1 ring-inset ${
                  formErrors.password ? "ring-red-300" : "ring-gray-200"
                } placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-500/50 sm:text-sm sm:leading-6`}
                placeholder='Password'
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
            transition={{ delay: 0.8 }}
          >
            <motion.button
              type='submit'
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className='group relative flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 cursor-pointer'
            >
              {isLoading ? (
                <div className='flex items-center gap-2'>
                  <LoadingSpinner size={20} />
                  <span>Creating account...</span>
                </div>
              ) : (
                "Create account"
              )}
            </motion.button>
          </motion.div>
        </form>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className='text-center'
        >
          <Link
            href='/login'
            className='text-sm text-indigo-600 hover:text-indigo-500'
          >
            Already have an account? Sign in
          </Link>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
