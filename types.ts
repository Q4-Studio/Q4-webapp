import { ReactNode } from "react";

export interface AnimatedTextProps {
  text: string;
  className?: string;
  delay?: number;
}

export interface ServiceItem {
  id: number;
  title: string;
  description: string;
  icon: ReactNode;
  span: string; // CSS grid span class
}

export interface Testimonial {
  id: number;
  logo: string;
  name: string;
}

export interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  strength?: number;
}
