export interface ProfileProp {
  id: string;
  name: string;
  email: string;
  photoUrl: string | null;
  onboarded: boolean;
  createdAt: string;
  lastLogin: string;
}
