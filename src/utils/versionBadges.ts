import type { PokemonVersionInfoMap, VersionFiltersMap } from '@/types'

export interface VersionBadge {
  text: string;
  className: string;
}

export interface BuildVersionBadgesOptions {
  includeBoth?: boolean;
  labelTransform?: (
    label: string,
    availability: string,
    groupKey: string,
  ) => string;
}

const valueClassMap: Record<string, string> = {
  scarlet: "bg-red-100 text-red-800",
  violet: "bg-purple-100 text-purple-800",
  sword: "bg-blue-100 text-blue-800",
  shield: "bg-pink-100 text-pink-800",
  sun: "bg-yellow-100 text-yellow-800",
  moon: "bg-indigo-100 text-indigo-800",
  ultra_sun: "bg-orange-100 text-orange-800",
  ultra_moon: "bg-purple-100 text-purple-800",
  omega_ruby: "bg-red-100 text-red-800",
  alpha_sapphire: "bg-blue-100 text-blue-800",
  x: "bg-sky-100 text-sky-800",
  y: "bg-fuchsia-100 text-fuchsia-800",
};

const badgePalette = [
  "bg-red-100 text-red-800",
  "bg-blue-100 text-blue-800",
  "bg-green-100 text-green-800",
  "bg-purple-100 text-purple-800",
  "bg-pink-100 text-pink-800",
  "bg-yellow-100 text-yellow-800",
  "bg-orange-100 text-orange-800",
  "bg-teal-100 text-teal-800",
];

const hashString = (value: string): number => {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  }
  return hash;
};

const pickBadgeClass = (key: string): string => {
  const index = hashString(key) % badgePalette.length;
  return badgePalette[index];
};

export const buildVersionBadges = (
  versionInfo: PokemonVersionInfoMap | undefined,
  versionFilters: VersionFiltersMap | undefined,
  options: BuildVersionBadgesOptions = {},
): VersionBadge[] => {
  if (!versionInfo || !versionFilters) return [];

  const { includeBoth = false, labelTransform } = options;
  const badges: VersionBadge[] = [];

  Object.entries(versionFilters).forEach(([groupKey, group]) => {
    const availability = versionInfo[groupKey]?.availability;
    if (!availability) return;
    if (availability === "both" && !includeBoth) return;

    const option = group.options?.find((opt) => opt.value === availability);
    const baseLabel = option?.label ?? availability;
    const text = labelTransform
      ? labelTransform(baseLabel, availability, groupKey)
      : baseLabel;
    const className =
      valueClassMap[availability] ??
      pickBadgeClass(`${groupKey}:${availability}`);

    badges.push({ text, className });
  });

  return badges;
};
