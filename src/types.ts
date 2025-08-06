export interface Memory {
  id: number;
  day: number;
  title: string;
  subtitle: string;
  story: string;
  backgroundImage: string;
  photos: string[];
  mood: string;
  emojis: string[];
}

export interface ParticleProps {
  count?: number;
  speed?: number;
  size?: number;
}