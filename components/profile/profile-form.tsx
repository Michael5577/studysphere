"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateProfileAction } from "@/lib/actions/profile-actions";
import type { Profile } from "@/types/database";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface ProfileFormProps {
  profile: Profile;
}

export function ProfileForm({ profile }: ProfileFormProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [fullName, setFullName] = useState(profile.full_name ?? "");
  const [major, setMajor] = useState(profile.major ?? "");
  const [university, setUniversity] = useState(profile.university ?? "");
  const [yearLevel, setYearLevel] = useState(profile.year_level ?? "");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);

    if (nextOpen) {
      setFullName(profile.full_name ?? "");
      setMajor(profile.major ?? "");
      setUniversity(profile.university ?? "");
      setYearLevel(profile.year_level ?? "");
      setError(null);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const result = await updateProfileAction({
      full_name: fullName,
      major,
      university,
      year_level: yearLevel,
    });

    setLoading(false);

    if (!result.ok) {
      setError(result.message);
      return;
    }

    setOpen(false);
    router.refresh();
  }

  return (
    <>
      <Button
        variant="outline"
        className="w-full sm:w-auto"
        onClick={() => handleOpenChange(true)}
      >
        Edit profile
      </Button>

      <Dialog
        open={open}
        onOpenChange={handleOpenChange}
        title="Edit profile"
        description="Update your academic identity."
      >
        <form id="profile-form" onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div
              role="alert"
              className="rounded-[var(--radius)] border border-error/30 bg-error/5 px-3 py-2.5 text-sm text-error"
            >
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="profile-full-name">Full name</Label>
            <Input
              id="profile-full-name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="profile-major">Major</Label>
            <Input
              id="profile-major"
              value={major}
              onChange={(e) => setMajor(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="profile-university">University</Label>
            <Input
              id="profile-university"
              value={university}
              onChange={(e) => setUniversity(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="profile-year">Year level</Label>
            <Input
              id="profile-year"
              value={yearLevel}
              onChange={(e) => setYearLevel(e.target.value)}
              placeholder="Junior"
              disabled={loading}
            />
          </div>
        </form>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button type="submit" form="profile-form" disabled={loading}>
            Save changes
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}
