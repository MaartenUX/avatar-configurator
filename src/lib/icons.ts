/**
 * Expliciete iconenmap voor namen die uit data komen (learnmore.ts).
 * Bewust geen `import * as icons`: dat trekt de hele lucide-bibliotheek de
 * bundel in en maakt de single-file build ruim drie keer zo groot.
 */
import {
  BookOpen, Building2, CircleHelp, Copy, Eye, Gauge, Image, Languages,
  LayoutGrid, Layers, Lock, Mail, MousePointerClick, Palette, RefreshCw,
  ShieldCheck, Smartphone, Sparkles, Timer, Upload, UserRound, Users, Volume2,
  type LucideIcon,
} from 'lucide-react'

export const ICONS: Record<string, LucideIcon> = {
  BookOpen, Building2, CircleHelp, Copy, Eye, Gauge, Image, Languages,
  LayoutGrid, Layers, Lock, Mail, MousePointerClick, Palette, RefreshCw,
  ShieldCheck, Smartphone, Sparkles, Timer, Upload, UserRound, Users, Volume2,
}

export const icon = (name: string): LucideIcon | undefined => ICONS[name]
