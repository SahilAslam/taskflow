'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Camera, Save, Shield, User, Bell, Palette } from 'lucide-react';
import { authApi } from '@/lib/api';

export default function SettingsPage() {
  const { data: session, update } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: session?.user?.name || '',
    email: session?.user?.email || '',
    bio: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSaveProfile = async () => {
    try {
      setIsLoading(true);
      await authApi.updateProfile({ name: formData.name, bio: formData.bio });
      await update({ name: formData.name });
      // Show some toast success message here (if you have a toast component)
    } catch (err) {
      console.error('Failed to update profile:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 p-8 overflow-auto h-full scrollbar-none">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground mt-2">
            Manage your account settings and preferences.
          </p>
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="bg-black/20 border border-white/10 w-full justify-start p-1 h-auto rounded-lg mb-8">
            <TabsTrigger value="profile" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary py-2 px-6 rounded-md">
              <User className="h-4 w-4 mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="appearance" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary py-2 px-6 rounded-md">
              <Palette className="h-4 w-4 mr-2" />
              Appearance
            </TabsTrigger>
            <TabsTrigger value="notifications" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary py-2 px-6 rounded-md">
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="security" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary py-2 px-6 rounded-md">
              <Shield className="h-4 w-4 mr-2" />
              Security
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <Card className="glass border-white/5 bg-black/20">
              <CardHeader>
                <CardTitle>Profile Picture</CardTitle>
                <CardDescription>
                  This is your public representation in TaskFlow Pro.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex items-center gap-6">
                <Avatar className="h-24 w-24 border-2 border-white/10 ring-4 ring-black/50">
                  <AvatarImage src={(session?.user as any)?.avatar || ''} alt={session?.user?.name || "User"} />
                  <AvatarFallback className="bg-primary/20 text-primary text-2xl font-bold">
                    {session?.user?.name?.substring(0, 2).toUpperCase() || 'US'}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-3">
                  <Button variant="outline" className="border-white/10 relative overflow-hidden group">
                    <Camera className="mr-2 h-4 w-4" />
                    Change Picture
                    <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" />
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    JPG, GIF or PNG. 1MB max.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="glass border-white/5 bg-black/20">
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>
                  Update your personal details here.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input 
                    id="name" 
                    name="name" 
                    value={formData.name} 
                    onChange={handleChange} 
                    className="bg-black/50 border-white/10 focus-visible:ring-primary/50" 
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input 
                    id="email" 
                    name="email" 
                    type="email"
                    value={formData.email} 
                    disabled
                    className="bg-black/50 border-white/10 opacity-50 cursor-not-allowed" 
                  />
                  <p className="text-[10px] text-muted-foreground mt-1">
                    Your email address cannot be changed.
                  </p>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Input 
                    id="bio" 
                    name="bio"
                    placeholder="Tell us a little bit about yourself"
                    value={formData.bio} 
                    onChange={handleChange} 
                    className="bg-black/50 border-white/10 focus-visible:ring-primary/50" 
                  />
                </div>
              </CardContent>
              <CardFooter className="border-t border-white/5 bg-black/10 pt-6">
                <Button onClick={handleSaveProfile} disabled={isLoading} className="ml-auto bg-primary hover:bg-primary/90">
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="appearance" className="space-y-6">
            <Card className="glass border-white/5 bg-black/20">
              <CardHeader>
                <CardTitle>Theme</CardTitle>
                <CardDescription>Customize the appearance of the application.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div className="flex flex-col items-center gap-2">
                    <div className="h-24 w-full rounded-lg border-2 border-primary bg-background p-2 shadow-sm cursor-pointer">
                      <div className="h-4 w-4 rounded-full bg-primary mb-2"></div>
                      <div className="h-2 w-1/2 rounded bg-muted mb-1"></div>
                      <div className="h-2 w-3/4 rounded bg-muted"></div>
                    </div>
                    <span className="text-sm font-medium">Dark Mode</span>
                  </div>
                  <div className="flex flex-col items-center gap-2 opacity-50 cursor-not-allowed">
                    <div className="h-24 w-full rounded-lg border border-white/10 bg-white p-2 shadow-sm">
                      <div className="h-4 w-4 rounded-full bg-slate-300 mb-2"></div>
                      <div className="h-2 w-1/2 rounded bg-slate-200 mb-1"></div>
                      <div className="h-2 w-3/4 rounded bg-slate-200"></div>
                    </div>
                    <span className="text-sm font-medium">Light Mode (Coming Soon)</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card className="glass border-white/5 bg-black/20">
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Choose what you want to be notified about.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between rounded-lg border border-white/5 bg-black/30 p-4">
                    <div className="space-y-0.5">
                      <Label className="text-base">Task Assignments</Label>
                      <p className="text-sm text-muted-foreground">Receive notifications when you are assigned to a task.</p>
                    </div>
                    <div className="h-6 w-11 rounded-full bg-primary relative cursor-pointer">
                      <div className="absolute right-1 top-1 h-4 w-4 rounded-full bg-white transition-all"></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border border-white/5 bg-black/30 p-4">
                    <div className="space-y-0.5">
                      <Label className="text-base">Mentions</Label>
                      <p className="text-sm text-muted-foreground">Receive notifications when someone mentions you in a comment.</p>
                    </div>
                    <div className="h-6 w-11 rounded-full bg-primary relative cursor-pointer">
                      <div className="absolute right-1 top-1 h-4 w-4 rounded-full bg-white transition-all"></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border border-white/5 bg-black/30 p-4 opacity-70">
                    <div className="space-y-0.5">
                      <Label className="text-base">Marketing Emails</Label>
                      <p className="text-sm text-muted-foreground">Receive emails about new features and updates.</p>
                    </div>
                    <div className="h-6 w-11 rounded-full bg-white/10 relative cursor-pointer">
                      <div className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition-all"></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card className="glass border-white/5 bg-black/20">
              <CardHeader>
                <CardTitle>Password</CardTitle>
                <CardDescription>Change your password here. After saving, you'll be logged out.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="current">Current Password</Label>
                  <Input id="current" type="password" className="bg-black/50 border-white/10" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="new">New Password</Label>
                  <Input id="new" type="password" className="bg-black/50 border-white/10" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="confirm">Confirm New Password</Label>
                  <Input id="confirm" type="password" className="bg-black/50 border-white/10" />
                </div>
              </CardContent>
              <CardFooter className="border-t border-white/5 bg-black/10 pt-6">
                <Button variant="outline" className="ml-auto border-white/10 bg-black/20 hover:bg-white/5">Update Password</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
