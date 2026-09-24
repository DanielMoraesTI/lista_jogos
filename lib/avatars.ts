export const PRESET_AVATARS = [
  { id: "knight", label: "Cavaleiro" },
  { id: "invader", label: "Invasor" },
  { id: "ghost", label: "Fantasma" },
  { id: "slime", label: "Slime" },
  { id: "robot", label: "Robô" },
  { id: "cat", label: "Gato" },
  { id: "mushroom", label: "Cogumelo" },
  { id: "skull", label: "Caveira" },
] as const;

export type PresetAvatarId = (typeof PRESET_AVATARS)[number]["id"];

export function presetAvatarUrl(id: PresetAvatarId) {
  return `/avatars/${id}.svg`;
}

export const AVATAR_MAX_BYTES = 2 * 1024 * 1024;
export const AVATAR_TYPES = ["image/png", "image/jpeg", "image/webp", "image/gif"] as const;
