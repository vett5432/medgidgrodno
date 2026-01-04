import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { User, UserPlus, LogIn } from 'lucide-react';

interface AdminLoginProps {
  open: boolean;
  onClose: () => void;
  onLogin: (username: string, password: string) => void;
}

export function AdminLogin({ open, onClose, onLogin }: AdminLoginProps) {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  
  // Login form state
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Register form state
  const [registerUsername, setRegisterUsername] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState('');
  const [registerFullName, setRegisterFullName] = useState('');
  const [registerPosition, setRegisterPosition] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginUsername && loginPassword) {
      onLogin(loginUsername, loginPassword);
      // Reset form
      setLoginUsername('');
      setLoginPassword('');
      onClose();
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!registerUsername || !registerEmail || !registerPassword || !registerFullName) {
      alert('Пожалуйста, заполните все обязательные поля');
      return;
    }
    
    if (registerPassword !== registerConfirmPassword) {
      alert('Пароли не совпадают');
      return;
    }
    
    if (registerPassword.length < 6) {
      alert('Пароль должен содержать минимум 6 символов');
      return;
    }

    // For demo purposes, save to localStorage
    const adminData = {
      username: registerUsername,
      email: registerEmail,
      fullName: registerFullName,
      position: registerPosition,
      registeredAt: new Date().toISOString()
    };
    
    // Save to localStorage (в реальном приложении это было бы на сервере)
    localStorage.setItem(`admin_${registerUsername}`, JSON.stringify(adminData));
    localStorage.setItem(`admin_password_${registerUsername}`, registerPassword);
    
    alert('Регистрация успешна! Теперь вы можете войти.');
    
    // Reset form
    setRegisterUsername('');
    setRegisterEmail('');
    setRegisterPassword('');
    setRegisterConfirmPassword('');
    setRegisterFullName('');
    setRegisterPosition('');
    
    // Switch to login tab
    setActiveTab('login');
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-blue-900">Вход в панель администратора</DialogTitle>
          <DialogDescription>
            Войдите в систему для управления медицинскими учреждениями
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'login' | 'register')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <LogIn className="w-4 h-4 mr-2" />
              Вход
            </TabsTrigger>
            <TabsTrigger value="register" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <UserPlus className="w-4 h-4 mr-2" />
              Регистрация
            </TabsTrigger>
          </TabsList>

          {/* Login Tab */}
          <TabsContent value="login">
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="login-username">Логин</Label>
                <Input
                  id="login-username"
                  type="text"
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value)}
                  placeholder="Введите логин"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="login-password">Пароль</Label>
                <Input
                  id="login-password"
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Введите пароль"
                  required
                />
              </div>

              <div className="bg-blue-50 p-3 rounded-lg text-sm text-blue-700">
                <p className="font-medium mb-1">Демо-доступ:</p>
                <p>Логин: admin</p>
                <p>Пароль: admin123</p>
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700">
                  <User className="w-4 h-4 mr-2" />
                  Войти
                </Button>
                <Button type="button" variant="outline" onClick={onClose}>
                  Отмена
                </Button>
              </div>
            </form>
          </TabsContent>

          {/* Register Tab */}
          <TabsContent value="register">
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <Label htmlFor="register-fullname">ФИО <span className="text-red-500">*</span></Label>
                <Input
                  id="register-fullname"
                  type="text"
                  value={registerFullName}
                  onChange={(e) => setRegisterFullName(e.target.value)}
                  placeholder="Иванов Иван Иванович"
                  required
                />
              </div>

              <div>
                <Label htmlFor="register-username">Логин <span className="text-red-500">*</span></Label>
                <Input
                  id="register-username"
                  type="text"
                  value={registerUsername}
                  onChange={(e) => setRegisterUsername(e.target.value)}
                  placeholder="admin_username"
                  required
                />
              </div>

              <div>
                <Label htmlFor="register-email">Email <span className="text-red-500">*</span></Label>
                <Input
                  id="register-email"
                  type="email"
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                  placeholder="admin@example.com"
                  required
                />
              </div>

              <div>
                <Label htmlFor="register-position">Должность</Label>
                <Input
                  id="register-position"
                  type="text"
                  value={registerPosition}
                  onChange={(e) => setRegisterPosition(e.target.value)}
                  placeholder="Администратор системы"
                />
              </div>

              <div>
                <Label htmlFor="register-password">Пароль <span className="text-red-500">*</span></Label>
                <Input
                  id="register-password"
                  type="password"
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                  placeholder="Минимум 6 символов"
                  required
                />
              </div>

              <div>
                <Label htmlFor="register-confirm-password">Подтверждение пароля <span className="text-red-500">*</span></Label>
                <Input
                  id="register-confirm-password"
                  type="password"
                  value={registerConfirmPassword}
                  onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                  placeholder="Повторите пароль"
                  required
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="flex-1 bg-green-600 hover:bg-green-700">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Зарегистрироваться
                </Button>
                <Button type="button" variant="outline" onClick={onClose}>
                  Отмена
                </Button>
              </div>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
