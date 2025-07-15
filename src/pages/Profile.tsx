import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { User, Mail, Shield, Calendar } from 'lucide-react';

export default function Profile() {
  const { user, profile, updateProfile, loading } = useAuth();
  const { toast } = useToast();
  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [isEditing, setIsEditing] = useState(false);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = await updateProfile({ full_name: fullName });
    
    if (result.success) {
      toast({
        title: "Profil güncellendi",
        description: "Profil bilgileriniz başarıyla güncellendi.",
      });
      setIsEditing(false);
    } else {
      toast({
        title: "Hata",
        description: result.error || "Profil güncellenirken bir hata oluştu.",
        variant: "destructive",
      });
    }
  };

  const getPlanBadgeVariant = (plan: string) => {
    switch (plan) {
      case 'pro': return 'default';
      case 'enterprise': return 'secondary';
      default: return 'outline';
    }
  };

  const getPlanDisplayName = (plan: string) => {
    switch (plan) {
      case 'pro': return 'Pro';
      case 'enterprise': return 'Kurumsal';
      default: return 'Ücretsiz';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-foreground">Profil Ayarları</h1>
            <p className="text-muted-foreground mt-2">
              Hesap bilgilerinizi görüntüleyin ve güncelleyin
            </p>
          </div>

          {/* Profile Information Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Kullanıcı Bilgileri
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleUpdateProfile}>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="email" className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      E-posta Adresi
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={user?.email || ''}
                      disabled
                      className="bg-muted"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      E-posta adresi değiştirilemez
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="fullName">Ad Soyad</Label>
                    <Input
                      id="fullName"
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      disabled={!isEditing}
                      placeholder="Adınız ve soyadınız"
                    />
                  </div>

                  <div className="flex gap-2">
                    {!isEditing ? (
                      <Button 
                        type="button"
                        onClick={() => setIsEditing(true)}
                        variant="outline"
                      >
                        Düzenle
                      </Button>
                    ) : (
                      <>
                        <Button 
                          type="submit" 
                          disabled={loading}
                        >
                          {loading ? 'Kaydediliyor...' : 'Kaydet'}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setIsEditing(false);
                            setFullName(profile?.full_name || '');
                          }}
                        >
                          İptal
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Subscription Information Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Abonelik Bilgileri
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium">Mevcut Plan:</span>
                <Badge variant={getPlanBadgeVariant(profile?.plan || 'free')}>
                  {getPlanDisplayName(profile?.plan || 'free')}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-primary">
                    {profile?.monthly_search_count || 0}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Bu Ay Yapılan Arama
                  </div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-primary">
                    {profile?.max_searches || 0}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Maksimum Arama
                  </div>
                </div>
              </div>

              <Button className="w-full" variant="outline">
                Plan Yükselt
              </Button>
            </CardContent>
          </Card>

          {/* Account Information Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Hesap Bilgileri
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Kayıt Tarihi:</span>
                <span className="text-sm">
                  {profile?.created_at 
                    ? new Date(profile.created_at).toLocaleDateString('tr-TR')
                    : 'Bilinmiyor'
                  }
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Son Güncelleme:</span>
                <span className="text-sm">
                  {profile?.updated_at 
                    ? new Date(profile.updated_at).toLocaleDateString('tr-TR')
                    : 'Bilinmiyor'
                  }
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">E-posta Doğrulandı:</span>
                <Badge variant={user?.email_confirmed_at ? 'default' : 'destructive'}>
                  {user?.email_confirmed_at ? 'Doğrulandı' : 'Doğrulanmadı'}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}