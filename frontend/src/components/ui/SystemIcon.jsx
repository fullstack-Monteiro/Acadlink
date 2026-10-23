import {
  Archive, Bell, BookOpen, Bookmark, BriefcaseBusiness, CalendarDays, Camera,
  FileText, FolderOpen, Globe2, GraduationCap, Hash, Heart, Image, Link2, Lock,
  MessageCircle, PackageOpen, PenLine, Search, ShieldCheck, Sparkles, Trophy,
  User, Users, Video, WandSparkles, AlertTriangle,
} from 'lucide-react'

const ICONS = {
  archive: Archive, bell: Bell, book: BookOpen, bookmark: Bookmark,
  briefcase: BriefcaseBusiness, calendar: CalendarDays, camera: Camera,
  document: FileText, folder: FolderOpen, globe: Globe2, graduation: GraduationCap,
  hash: Hash, heart: Heart, image: Image, link: Link2, lock: Lock, message: MessageCircle,
  package: PackageOpen, pen: PenLine, search: Search, shield: ShieldCheck,
  sparkles: Sparkles, trophy: Trophy, user: User, users: Users, video: Video,
  wand: WandSparkles, warning: AlertTriangle,
}

const LEGACY_ICON_NAMES = {
  '📭': 'package', '📁': 'folder', '📝': 'document', '💬': 'message',
  '🔔': 'bell', '👤': 'user', '👥': 'users', '💼': 'briefcase',
  '🏆': 'trophy', '🔖': 'bookmark', '🔍': 'search', '📹': 'video',
  '🧭': 'globe', '📘': 'book', '#️⃣': 'hash', '⚠️': 'warning', '⚠': 'warning',
}

export default function SystemIcon({ name, className = 'w-8 h-8', ...props }) {
  const Icon = ICONS[LEGACY_ICON_NAMES[name] || name] || Sparkles
  return <Icon className={className} strokeWidth={1.8} aria-hidden="true" {...props} />
}