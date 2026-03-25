"use client";

import * as React from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type AboutStatsData = Record<string, string>;

type Props = {
  value: AboutStatsData;
  onChange: (next: AboutStatsData) => void;
  disabled?: boolean;
};

const STAT_GROUPS = [
  {
    prefix: "years",
    icon: "📅",
  },
  {
    prefix: "projects",
    icon: "🏗️",
  },
  {
    prefix: "refs",
    icon: "🤝",
  },
] as const;

const SUFFIX_FIELDS = [
  { key: "suffix_plus", label: "Suffix (+)" },
  { key: "suffix_letter", label: "Suffix (Letter)" },
] as const;

export function AboutStatsStructuredForm({ value, onChange, disabled }: Props) {
  const update = (key: string, val: string) => {
    onChange({ ...value, [key]: val });
  };

  return (
    <div className="space-y-4">
      {STAT_GROUPS.map((group) => (
        <Card key={group.prefix}>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">
              {group.icon} {group.prefix.charAt(0).toUpperCase() + group.prefix.slice(1)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Value</Label>
                <Input
                  value={value[`${group.prefix}_value`] || ""}
                  onChange={(e) => update(`${group.prefix}_value`, e.target.value)}
                  disabled={disabled}
                  placeholder="40"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Title</Label>
                <Input
                  value={value[`${group.prefix}_title`] || ""}
                  onChange={(e) => update(`${group.prefix}_title`, e.target.value)}
                  disabled={disabled}
                  placeholder="Jahre Erfahrung"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Label</Label>
                <Input
                  value={value[`${group.prefix}_label`] || ""}
                  onChange={(e) => update(`${group.prefix}_label`, e.target.value)}
                  disabled={disabled}
                  placeholder="Wasserkühlung und Prozesskühlung"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Suffix</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {SUFFIX_FIELDS.map((sf) => (
              <div key={sf.key} className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">{sf.label}</Label>
                <Input
                  value={value[sf.key] || ""}
                  onChange={(e) => update(sf.key, e.target.value)}
                  disabled={disabled}
                  placeholder={sf.key === "suffix_plus" ? "+" : ""}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
