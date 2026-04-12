import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import type { User } from "@/types/models";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string, name: string, phone: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("app_users")
        .select("*")
        .eq("id", userId)
        .maybeSingle();

      if (error) {
        console.error("Error fetching user profile:", error);
        return null;
      }

      if (data) {
        return {
          id: data.id,
          name: data.name,
          email: data.email,
          phone: data.phone,
          role: data.role as any,
          createdAt: data.created_at,
        } as User;
      }
    } catch (err) {
      console.error("Unexpected error fetching profile:", err);
    }
    return null;
  };

  const ensureProfile = async (session: any) => {
    if (!session?.user) return null;
    
    let profile = await fetchUserProfile(session.user.id);
    
    if (!profile) {
      console.log("Profile missing, creating default profile for:", session.user.id);
      const { error: insertError } = await supabase.from("app_users").insert({
        id: session.user.id,
        name: session.user.user_metadata.name || session.user.email?.split("@")[0] || "User",
        email: session.user.email || "",
        phone: session.user.user_metadata.phone || "",
        role: "passenger",
        status: "active",
        total_trips: 0
      });
      
      if (!insertError) {
        profile = await fetchUserProfile(session.user.id);
      } else {
        console.error("Failed to create missing profile:", insertError);
      }
    }
    
    return profile;
  };

  useEffect(() => {
    // Check active sessions and sets the user
    const initAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const profile = await ensureProfile(session);
        setUser(profile);
      }
      setIsLoading(false);
    };

    initAuth();

    // Listen for changes on auth state (sign in, sign out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const profile = await ensureProfile(session);
        setUser(profile);
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signInWithEmail = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      toast.success("Signed in successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to sign in");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signUpWithEmail = async (email: string, password: string, name: string, phone: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: { name, phone }
        }
      });
      
      if (error) throw error;
      toast.success("Account created successfully. Please check your email for verification.");
    } catch (error: any) {
      toast.error(error.message || "Failed to sign up");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    // Deprecated: Use lovable.auth.signInWithOAuth("google") directly
    throw new Error("Use lovable.auth.signInWithOAuth instead");
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
      toast.success("Signed out successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to sign out");
    }
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      isLoading, 
      signInWithEmail, 
      signUpWithEmail,
      signInWithGoogle, 
      signOut 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
