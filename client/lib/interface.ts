export interface FormData {
  username?: string;
  email?: string;
  identifier?: string;
  password: string;
  confirmPassword?: string;
}

export interface AuthResponse {
  token: string;
  user: any;
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
}

export interface User {
  id: string;
  username: string;
  email: string;
  profilePic?: string;
  googleId?: string;
  createdAt?: string;
  updatedAt?: string;
}
