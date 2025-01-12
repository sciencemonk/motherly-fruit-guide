import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

interface Profile {
  first_name: string;
  phone_number: string;
  trial_ends_at: string;
  reality_check_start_time: string;
  reality_check_end_time: string;
}

interface Dream {
  content: string;
  dream_date: string;
  lucidity_level: number;
  emotions: string[];
  themes: string[];
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [dreams, setDreams] = useState<Dream[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          navigate("/");
          return;
        }

        // Fetch profile data
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .single();

        if (profileError) {
          console.error('Error fetching profile:', profileError);
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to load profile data",
          });
          return;
        }

        setProfile(profileData);

        // Fetch dreams
        const { data: dreamsData, error: dreamsError } = await supabase
          .from('dreams')
          .select('*')
          .order('dream_date', { ascending: false });

        if (dreamsError) {
          console.error('Error fetching dreams:', dreamsError);
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to load dreams",
          });
          return;
        }

        setDreams(dreamsData || []);
      } catch (error) {
        console.error('Dashboard error:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "An unexpected error occurred",
        });
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT" || !session) {
        navigate("/");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, toast]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-sage-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      <header className="bg-white border-b border-sage-200">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-sage-800">
            Welcome, {profile?.first_name}
          </h1>
          <Button 
            variant="outline" 
            onClick={handleSignOut}
            className="text-sage-600 hover:text-sage-700"
          >
            Sign Out
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="dreams" className="space-y-6">
          <TabsList className="bg-white">
            <TabsTrigger value="dreams">Dream Journal</TabsTrigger>
            <TabsTrigger value="settings">Reality Check Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="dreams" className="space-y-6">
            {dreams.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center text-sage-600">
                  <p>No dreams recorded yet. Text your dreams to start building your journal!</p>
                </CardContent>
              </Card>
            ) : (
              dreams.map((dream, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-lg font-medium">
                      {new Date(dream.dream_date).toLocaleDateString()}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sage-700 whitespace-pre-wrap">{dream.content}</p>
                    {dream.lucidity_level && (
                      <div className="mt-4">
                        <p className="text-sm text-sage-600">
                          Lucidity Level: {dream.lucidity_level}/10
                        </p>
                      </div>
                    )}
                    {dream.emotions && dream.emotions.length > 0 && (
                      <div className="mt-2">
                        <p className="text-sm text-sage-600">
                          Emotions: {dream.emotions.join(", ")}
                        </p>
                      </div>
                    )}
                    {dream.themes && dream.themes.length > 0 && (
                      <div className="mt-2">
                        <p className="text-sm text-sage-600">
                          Themes: {dream.themes.join(", ")}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Reality Check Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-sage-700">Active Hours</p>
                  <p className="text-sage-600">
                    {profile?.reality_check_start_time} - {profile?.reality_check_end_time}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-sage-700">Trial Status</p>
                  <p className="text-sage-600">
                    Trial ends: {new Date(profile?.trial_ends_at || "").toLocaleDateString()}
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}