import { api } from '@/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import * as z from 'zod';

const formSchema = z
  .object({
    username: z.string().trim().min(3, { message: '用户名不能少于3个字符' }),
    password: z.string().trim().min(6, { message: '密码不能少于6个字符' }),
    confirmPassword: z.string().trim().min(1, { message: '请确认密码' }),
  })
  .refine(({ password, confirmPassword }) => password === confirmPassword, {
    message: '两次输入的密码不一致',
    path: ['confirmPassword'],
  });

function Register() {
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { username: '', password: '', confirmPassword: '' },
  });

  const { mutate: register, isPending } = useMutation({
    mutationFn: api.auth.register,
    onSuccess: () => {
      toast.success('注册成功，请登录');
      navigate('/login');
    },
    onError: (error) => {
      console.error('注册失败:', error);
      toast.error('注册失败，请稍后重试');
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const { username, password } = values;
    register({ username, password });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <Card className="w-96">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">注册</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold">
                      用户名
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="请输入用户名" {...field} />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold">
                      密码
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="请输入密码"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold">
                      确认密码
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="请再次输入密码"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? '注册中...' : '注册'}
              </Button>
            </form>
          </Form>
          <div className="mt-4 text-center">
            <Button variant="link" onClick={() => navigate('/login')}>
              已有账号？返回登录
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default Register;
