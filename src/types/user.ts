export interface Profile {
  id: string;
  display_name: string | null;
  email: string;
  photo_url: string | null;
  onboarded: boolean;
  last_login: string | null;
  created_at: string;
}

export interface UserMetadata {
  display_name?: string;
  full_name?: string;
  avatar_url?: string;
  picture?: string;
}
