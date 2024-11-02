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

const formSchema = z.object({
  username: z.string().trim().min(1, { message: '用户名不能为空' }),
  password: z.string().trim().min(1, { message: '密码不能为空' }),
});

function Login() {
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { username: '', password: '' },
  });

  const { mutate: login, isPending } = useMutation({
    mutationFn: api.auth.login,
    onSuccess: () => navigate('/'),
    onError: (error) => {
      console.error('登录失败:', error);
      toast.error('登录失败，请检查用户名和密码');
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => login(values);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <Card className="w-96">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">登录</CardTitle>
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
              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? '登录中...' : '登录'}
              </Button>
            </form>
          </Form>
          <div className="mt-4 text-center">
            <Button variant="link" onClick={() => navigate('/register')}>
              还没有账号？点击注册
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default Login;
