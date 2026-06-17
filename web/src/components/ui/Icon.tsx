import {
  Plus, UserPlus, ArrowLeft, RefreshCw, Link as LinkIcon, Share2, Dices,
  X, Camera, Coins, ImagePlus, Check, Trash2, Lock, Mail, type LucideProps,
} from 'lucide-react';

const MAP = {
  plus: Plus,
  'user-plus': UserPlus,
  'arrow-left': ArrowLeft,
  'refresh-cw': RefreshCw,
  link: LinkIcon,
  'share-2': Share2,
  dices: Dices,
  x: X,
  camera: Camera,
  coins: Coins,
  'image-plus': ImagePlus,
  check: Check,
  'trash-2': Trash2,
  lock: Lock,
  mail: Mail,
} as const;

export type IconName = keyof typeof MAP;

export function Icon({ name, size = 22, ...rest }: { name: IconName } & LucideProps) {
  const C = MAP[name];
  return <C size={size} absoluteStrokeWidth={false} strokeWidth={2.25} {...rest} />;
}
