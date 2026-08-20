import profileData from "@/data/profile.json";

export type Social = { name: string; handle: string; url: string; icon: string };
export type ProfileLink = { label: string; url: string; icon: string };
export type GalleryItem = { src: string; caption: string };
export type Profile = {
  nameJa: string;
  nameEn: string;
  tagline: string;
  roles: string[];
  avatar: string;
  birthday: string;
  location: string;
  highSchool: string;
  university: string;
  skills: string[];
  car: string;
  carImage: string;
  email: string;
  spotify: string;
  activityGraph: string;
  about: string;
  policy: string;
  gallery: GalleryItem[];
  socials: Social[];
  links: ProfileLink[];
};

/**
 * Single source of truth about Yamano Itsuki, loaded from data/profile.json.
 */
export const profile: Profile = profileData;

/** Age in full years from an ISO birthday (e.g. "2002-10-03"). */
export function calcAge(birthday: string): number | null {
  const d = new Date(birthday);
  if (Number.isNaN(d.getTime())) return null;
  const now = new Date();
  let age = now.getFullYear() - d.getFullYear();
  const m = now.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < d.getDate())) age -= 1;
  return age;
}
