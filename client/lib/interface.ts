export interface FormData {
  username?: string;
  email?: string;
  identifier?: string;
  password: string;
  confirmPassword?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface AuthState {
  formData: FormData;
  passwordStrength: number;
  strengthMessage: string;
  errors: { [key: string]: string | string[] };
  isPending: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSignup: (e: React.FormEvent) => void;
  handleLogin: (e: React.FormEvent) => void;
  handleLogout: () => void;
  user: User | null;
  isLoading: boolean;
}

export interface UpdateFormData {
  username: string;
  email: string;
  profilePic?: string;
}

export interface User {
  _id: string;
  username: string;
  email: string;
  profilePic?: string;
  googleId?: string;
  createdAt?: string;
  updatedAt?: string;
  role?: "user" | "admin";
}
