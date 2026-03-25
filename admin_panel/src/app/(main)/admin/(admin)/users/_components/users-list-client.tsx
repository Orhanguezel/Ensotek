"use client";

// =============================================================
// FILE: src/app/(main)/admin/users/_components/users-list-client.tsx
// FINAL — Admin Users List (users_admin.endpoints uyumlu)
// - route: /admin/users
// - roles: admin | moderator | user
// =============================================================

import * as React from "react";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import { ChevronLeft, ChevronRight, Filter, Plus, RefreshCcw, Search } from "lucide-react";
import { toast } from "sonner";

import { useAdminT } from "@/app/(main)/admin/_components/common/useAdminT";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useCreateUserAdminMutation, useListUsersAdminQuery } from "@/integrations/hooks";
import type { AdminUsersListParams, AdminUserView, UserRoleName } from "@/integrations/shared";

function boolParam(v: string | null): boolean | undefined {
  if (v == null) return undefined;
  const s = v.trim();
  if (s === "1" || s === "true") return true;
  if (s === "0" || s === "false") return false;
  return undefined;
}

function safeInt(v: string | null, fb: number): number {
  const n = Number(v ?? "");
  return Number.isFinite(n) && n >= 0 ? n : fb;
}

function pickQuery(sp: URLSearchParams): AdminUsersListParams {
  const q = sp.get("q") ?? undefined;
  const role = (sp.get("role") ?? undefined) as UserRoleName | undefined;
  const is_active = boolParam(sp.get("is_active"));
  const limit = safeInt(sp.get("limit"), 20) || 20;
  const offset = safeInt(sp.get("offset"), 0);

  const sort = (sp.get("sort") ?? undefined) as AdminUsersListParams["sort"] | undefined;
  const order = (sp.get("order") ?? undefined) as AdminUsersListParams["order"] | undefined;

  return {
    ...(q ? { q } : {}),
    ...(role ? { role } : {}),
    ...(typeof is_active === "boolean" ? { is_active } : {}),
    limit,
    offset,
    ...(sort ? { sort } : {}),
    ...(order ? { order } : {}),
  };
}

function toSearchParams(p: AdminUsersListParams): string {
  const sp = new URLSearchParams();
  if (p.q) sp.set("q", p.q);
  if (p.role) sp.set("role", p.role);
  if (typeof p.is_active === "boolean") sp.set("is_active", p.is_active ? "1" : "0");
  if (p.limit != null) sp.set("limit", String(p.limit));
  if (p.offset != null) sp.set("offset", String(p.offset));
  if (p.sort) sp.set("sort", p.sort);
  if (p.order) sp.set("order", p.order);
  return sp.toString();
}

export default function UsersListClient() {
  const router = useRouter();
  const sp = useSearchParams();
  const t = useAdminT("admin.users");

  function roleLabel(r: UserRoleName) {
    if (r === "admin") return t("roles.admin");
    if (r === "moderator") return t("roles.moderator");
    return t("roles.user");
  }

  function statusBadge(u: AdminUserView) {
    if (!u.is_active) return <Badge variant="destructive">{t("list.table.statusInactive")}</Badge>;
    return <Badge variant="secondary">{t("list.table.statusActive")}</Badge>;
  }

  function displayName(u: Pick<AdminUserView, "full_name">) {
    const n = String(u.full_name ?? "").trim();
    return n || t("list.table.unknownUser");
  }

  const params = React.useMemo(() => pickQuery(sp), [sp]);
  const usersQ = useListUsersAdminQuery(params);

  // UI state (controlled) – URL ile senkron
  const [q, setQ] = React.useState(params.q ?? "");
  const [role, setRole] = React.useState<UserRoleName | "all">((params.role as any) ?? "all");
  const [onlyActive, setOnlyActive] = React.useState<boolean | "all">(
    typeof params.is_active === "boolean" ? !!params.is_active : "all",
  );

  React.useEffect(() => {
    setQ(params.q ?? "");
    setRole((params.role as any) ?? "all");
    setOnlyActive(typeof params.is_active === "boolean" ? !!params.is_active : "all");
  }, [params.q, params.role, params.is_active]);

  function apply(next: Partial<AdminUsersListParams>) {
    const merged: AdminUsersListParams = {
      ...params,
      ...next,
      offset: next.offset != null ? next.offset : 0,
    };

    if (!merged.q) delete (merged as any).q;
    if (!merged.role) delete (merged as any).role;
    if (typeof merged.is_active !== "boolean") delete (merged as any).is_active;

    const qs = toSearchParams(merged);
    router.push(qs ? `/admin/users?${qs}` : `/admin/users`);
  }

  function onSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    apply({ q: q.trim() || undefined });
  }

  const limit = params.limit ?? 20;
  const offset = params.offset ?? 0;

  const canPrev = offset > 0;
  const canNext = (usersQ.data?.length ?? 0) >= limit;

  // ─── Create User Dialog ───
  const [createOpen, setCreateOpen] = React.useState(false);
  const [createEmail, setCreateEmail] = React.useState("");
  const [createPassword, setCreatePassword] = React.useState("");
  const [createFullName, setCreateFullName] = React.useState("");
  const [createPhone, setCreatePhone] = React.useState("");
  const [createRole, setCreateRole] = React.useState<UserRoleName>("user");
  const [createUser, createState] = useCreateUserAdminMutation();

  const resetCreateForm = () => {
    setCreateEmail("");
    setCreatePassword("");
    setCreateFullName("");
    setCreatePhone("");
    setCreateRole("user");
  };

  const onCreateSubmit = async () => {
    try {
      const result = await createUser({
        email: createEmail.trim(),
        password: createPassword,
        full_name: createFullName.trim() || undefined,
        phone: createPhone.trim() || undefined,
        role: createRole,
      }).unwrap();
      toast.success(t("create.success"));
      setCreateOpen(false);
      resetCreateForm();
      usersQ.refetch();
      router.push(`/admin/users/${encodeURIComponent(result.id)}`);
    } catch (err: any) {
      const msg = err?.data?.error?.message;
      if (msg === "user_exists") {
        toast.error(t("create.errorExists"));
      } else {
        toast.error(t("create.errorGeneric"));
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="font-semibold text-lg">{t("list.title")}</h1>
          <p className="text-muted-foreground text-sm">{t("list.description")}</p>
        </div>
        <Dialog open={createOpen} onOpenChange={(v) => { setCreateOpen(v); if (!v) resetCreateForm(); }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 size-4" />
              {t("create.button")}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{t("create.title")}</DialogTitle>
              <DialogDescription>{t("create.description")}</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label>{t("create.emailLabel")}</Label>
                <Input
                  type="email"
                  placeholder={t("create.emailPlaceholder")}
                  value={createEmail}
                  onChange={(e) => setCreateEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>{t("create.passwordLabel")}</Label>
                <Input
                  type="password"
                  placeholder={t("create.passwordPlaceholder")}
                  value={createPassword}
                  onChange={(e) => setCreatePassword(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>{t("create.fullNameLabel")}</Label>
                  <Input
                    placeholder={t("create.fullNamePlaceholder")}
                    value={createFullName}
                    onChange={(e) => setCreateFullName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t("create.phoneLabel")}</Label>
                  <Input
                    placeholder={t("create.phonePlaceholder")}
                    value={createPhone}
                    onChange={(e) => setCreatePhone(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>{t("create.roleLabel")}</Label>
                <Select value={createRole} onValueChange={(v) => setCreateRole(v as UserRoleName)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">{t("roles.admin")}</SelectItem>
                    <SelectItem value="moderator">{t("roles.moderator")}</SelectItem>
                    <SelectItem value="user">{t("roles.user")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setCreateOpen(false)}>
                {t("create.cancelButton")}
              </Button>
              <Button
                onClick={onCreateSubmit}
                disabled={createState.isLoading || !createEmail.trim() || createPassword.length < 8}
              >
                {t("create.submitButton")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader className="gap-2">
          <CardTitle className="text-base">{t("list.filters.title")}</CardTitle>
          <CardDescription>{t("list.filters.description")}</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <form onSubmit={onSearchSubmit} className="flex flex-col gap-3 lg:flex-row lg:items-end">
            <div className="flex-1 space-y-2">
              <Label htmlFor="q">{t("list.filters.searchLabel")}</Label>
              <div className="relative">
                <Search className="-translate-y-1/2 pointer-events-none absolute top-1/2 left-3 size-4 text-muted-foreground" />
                <Input
                  id="q"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder={t("list.filters.searchPlaceholder")}
                  className="pl-9"
                />
              </div>
            </div>

            <div className="w-full space-y-2 lg:w-56">
              <Label>{t("list.filters.roleLabel")}</Label>
              <Select
                value={role}
                onValueChange={(v) => {
                  const vv = v as UserRoleName | "all";
                  setRole(vv);
                  apply({ role: vv === "all" ? undefined : (vv as UserRoleName) });
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("list.filters.rolePlaceholder")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("roles.all")}</SelectItem>
                  <SelectItem value="admin">{t("roles.admin")}</SelectItem>
                  <SelectItem value="moderator">{t("roles.moderator")}</SelectItem>
                  <SelectItem value="user">{t("roles.user")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Filter className="size-4 text-muted-foreground" />
              <Label className="text-sm">{t("list.filters.onlyActive")}</Label>
              <Switch
                checked={onlyActive === true}
                onCheckedChange={(v) => {
                  const next = v ? true : "all";
                  setOnlyActive(next);
                  apply({ is_active: v ? true : undefined });
                }}
              />
            </div>

            <div className="flex gap-2">
              <Button type="submit" disabled={usersQ.isFetching}>
                {t("list.filters.searchButton")}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setQ("");
                  setRole("all");
                  setOnlyActive("all");
                  router.push("/admin/users");
                }}
                disabled={usersQ.isFetching}
              >
                {t("list.filters.resetButton")}
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => usersQ.refetch()}
                disabled={usersQ.isFetching}
                title={t("list.filters.refreshButton")}
              >
                <RefreshCcw className="size-4" />
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t("list.table.title")}</CardTitle>
          <CardDescription>
            {usersQ.isFetching
              ? t("list.table.loading")
              : t("list.table.totalRecords", { count: usersQ.data?.length ?? 0 })}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {usersQ.isError ? (
            <div className="rounded-md border p-4 text-sm">
              {t("list.table.loadError")}{" "}
              <Button
                variant="link"
                className="px-1"
                onClick={() => {
                  toast.error(t("list.table.loadError"));
                  usersQ.refetch();
                }}
              >
                {t("list.table.retryButton")}
              </Button>
            </div>
          ) : null}

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("list.table.fullName")}</TableHead>
                  <TableHead>{t("list.table.email")}</TableHead>
                  <TableHead>{t("list.table.phone")}</TableHead>
                  <TableHead>{t("list.table.status")}</TableHead>
                  <TableHead>{t("list.table.role")}</TableHead>
                  <TableHead className="text-right">{t("list.table.actions")}</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {(usersQ.data ?? []).map((u) => (
                  <TableRow key={u.id}>
                    <TableCell className="font-medium">{displayName(u)}</TableCell>
                    <TableCell>{u.email ?? "—"}</TableCell>
                    <TableCell>{u.phone ?? "—"}</TableCell>
                    <TableCell>{statusBadge(u)}</TableCell>
                    <TableCell>
                      <Badge variant={u.roles.includes("admin") ? "default" : "secondary"}>
                        {roleLabel(u.roles[0] ?? "user")}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button asChild variant="outline" size="sm">
                        <Link prefetch={false} href={`/admin/users/${encodeURIComponent(u.id)}`}>
                          {t("list.table.viewButton")}
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}

                {!usersQ.isFetching && (usersQ.data?.length ?? 0) === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="py-10 text-center text-muted-foreground">
                      {t("list.table.noRecords")}
                    </TableCell>
                  </TableRow>
                ) : null}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-muted-foreground text-xs">
              {t("list.pagination.offset", { offset })} • {t("list.pagination.limit", { limit })}
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={!canPrev || usersQ.isFetching}
                onClick={() => apply({ offset: Math.max(0, offset - limit) })}
              >
                <ChevronLeft className="mr-1 size-4" />
                {t("list.pagination.previous")}
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={!canNext || usersQ.isFetching}
                onClick={() => apply({ offset: offset + limit })}
              >
                {t("list.pagination.next")}
                <ChevronRight className="ml-1 size-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
