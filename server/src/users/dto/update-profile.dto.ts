export class UpdateProfileDto {
  name?: string;
  avatar?: string;
  bio?: string;
  skills?: string[];
  experience?: string;
  location?: string;
  website?: string;
  socialLinks?: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    portfolio?: string;
  }
}
