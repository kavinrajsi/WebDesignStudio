import React from "react";
import { LucideProps } from "lucide-react";
import {
  ChartBar,
  Clock,
  Lightbulb,
  Bot,
  Gauge,
  BadgeDollarSign,
  ShoppingCart,
  Building,
  Gavel,
  GraduationCap,
  DollarSign,
  Plane,
  Wrench,
  Briefcase,
  Factory,
  Phone,
  Mail,
  MapPin,
  Twitter,
  Facebook,
  Linkedin,
  Instagram,
  HeartPulse
} from "lucide-react";

interface IconProps extends LucideProps {
  name: string;
}

export function Icon({ name, ...props }: IconProps) {
  const icons: { [key: string]: React.ElementType } = {
    "chart-line": ChartBar,
    "lightbulb": Lightbulb,
    "robot": Bot,
    "gauge": Gauge,
    "clock": Clock,
    "search-dollar": BadgeDollarSign,
    "shopping-cart": ShoppingCart,
    "building": Building,
    "gavel": Gavel,
    "heart-pulse": HeartPulse,
    "graduation-cap": GraduationCap,
    "dollar-sign": DollarSign,
    "plane": Plane,
    "wrench": Wrench,
    "briefcase": Briefcase,
    "factory": Factory,
    "phone": Phone,
    "mail": Mail,
    "map-pin": MapPin,
    "twitter": Twitter,
    "facebook": Facebook,
    "linkedin": Linkedin,
    "instagram": Instagram
  };

  const IconComponent = icons[name];

  if (!IconComponent) {
    return <span>Icon not found</span>;
  }

  return <IconComponent {...props} />;
}
