import { CreateUserRequestSchema, userApi } from '@/api/user';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from '@/common/components/ui';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import * as z from 'zod';

type CreateUserRequest = typeof CreateUserRequestSchema;

function Signup() {
  const navigate = useNavigate();

  const form = useForm<z.infer<CreateUserRequest>>({
    resolver: zodResolver(CreateUserRequestSchema),
    defaultValues: { username: '', password: '', confirmPassword: '' },
  });

  const { mutate: signup, isPending } = useMutation({
    mutationFn: userApi.signup,
    onSuccess: () => {
      toast.success('注册成功，请登录');
      navigate('/signin');
    },
  });

  const onSubmit = ({ username, password }: z.infer<CreateUserRequest>) =>
    signup({ username, password });

  return (
    <div className="flex items-center justify-center min-h-dvh bg-gradient-to-r from-blue-500 to-purple-600 dark:bg-gradient-to-r dark:from-indigo-900 dark:to-purple-800 p-4 sm:p-6">
      <Card className="w-full max-w-md sm:max-w-sm p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg dark:shadow-xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center text-gray-800 dark:text-gray-200 sm:text-2xl">
            注册
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-semibold text-gray-700 dark:text-gray-300 sm:text-base">
                      用户名
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="请输入用户名"
                        {...field}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 sm:px-3 sm:py-1.5"
                      />
                    </FormControl>
                    <FormMessage className="text-sm text-red-600" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-semibold text-gray-700 dark:text-gray-300 sm:text-base">
                      密码
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="请输入密码"
                        {...field}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 sm:px-3 sm:py-1.5"
                      />
                    </FormControl>
                    <FormMessage className="text-sm text-red-600" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-semibold text-gray-700 dark:text-gray-300 sm:text-base">
                      确认密码
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="请再次输入密码"
                        {...field}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 sm:px-3 sm:py-1.5"
                      />
                    </FormControl>
                    <FormMessage className="text-sm text-red-600" />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full py-2 text-lg font-semibold text-white bg-blue-600 dark:bg-blue-500 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 sm:py-1.5 sm:text-base"
                disabled={isPending}
              >
                {isPending ? '注册中...' : '注册'}
              </Button>
            </form>
          </Form>
          <div className="mt-6 text-center">
            <Link
              to="/signin"
              className="text-blue-600 dark:text-blue-400 hover:underline sm:text-sm underline-offset-4"
            >
              已有账号？返回登录
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default Signup;
