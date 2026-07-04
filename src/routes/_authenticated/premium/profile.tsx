import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Settings, Save, Image, Globe, Phone, Mail, MapPin, GraduationCap, Building, FileText, Lock } from "lucide-react";
import {
  usePremiumCollege,
  PremiumPageShell,
  PremiumCard,
} from "@/components/edview/PremiumLayout";
import { COLLEGES, CATEGORIES, collegeAverages, avgOverall, recommendationPct, type Category } from "@/lib/edview-data";

export const Route = createFileRoute("/_authenticated/premium/profile")({
  head: () => ({ meta: [{ title: "Profile — Premium Dashboard — EdView" }] }),
  component: ProfilePage,
});

function ProfilePage() {
  const { college, reviews } = usePremiumCollege();
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(t);
  }, []);

  if (!college) return null;

  const averages = collegeAverages(reviews);
  const overall = avgOverall(averages);
  const recommend = recommendationPct(reviews);

  return (
    <PremiumPageShell>
      <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold text-brand">
        <Settings className="h-3.5 w-3.5" /> Profile Management
      </div>
      <h1 className="text-3xl tracking-tight md:text-4xl">
        College <span className="font-display italic text-brand">— profile.</span>
      </h1>
      <p className="mt-1.5 text-sm text-muted-foreground">
        Edit your official college information. Ratings and reviews are managed by students and cannot be modified.
      </p>

      {loading ? (
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <div className="skeleton h-48 rounded-3xl" />
          <div className="skeleton h-96 rounded-3xl lg:col-span-2" />
        </div>
      ) : (
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {/* Read-only stats sidebar */}
          <div className="space-y-4">
            <PremiumCard title="Read-Only Metrics">
              <div className="flex items-center gap-2 rounded-xl bg-amber-50 px-3 py-2 text-xs text-amber-700">
                <Lock className="h-3.5 w-3.5" />
                These metrics are student-driven and cannot be edited.
              </div>
              <div className="mt-4 space-y-3">
                <ReadonlyStat label="Overall Rating" value={`${overall.toFixed(2)} / 5`} />
                <ReadonlyStat label="Recommendation" value={`${recommend}%`} />
                <ReadonlyStat label="Total Reviews" value={String(reviews.length)} />
                {CATEGORIES.map(({ key, label }) => (
                  <ReadonlyStat key={key} label={label} value={`${averages[key as Category].toFixed(2)} / 5`} />
                ))}
              </div>
            </PremiumCard>
          </div>

          {/* Editable fields */}
          <div className="lg:col-span-2">
            <PremiumCard>
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold">Official Information</h3>
                {saved && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-600">
                    <Save className="h-3 w-3" /> Changes saved
                  </span>
                )}
              </div>

              {/* Logo + Cover */}
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <ImageUpload label="Logo" icon={<Image className="h-5 w-5" />} />
                <ImageUpload label="Cover Image" icon={<Image className="h-5 w-5" />} />
              </div>

              <div className="mt-6 space-y-4">
                <EditField label="College Name" icon={<Building className="h-4 w-4" />} defaultValue={college.name} />
                <EditField label="Tagline" icon={<FileText className="h-4 w-4" />} defaultValue={college.tagline} />
                <EditField label="Description" icon={<FileText className="h-4 w-4" />} defaultValue={college.about} multiline />
                <EditField label="Location" icon={<MapPin className="h-4 w-4" />} defaultValue={college.location} />
                <EditField label="Website" icon={<Globe className="h-4 w-4" />} defaultValue={`www.${college.slug.replace(/-/g, "")}.edu.np`} />
                <div className="grid gap-4 sm:grid-cols-2">
                  <EditField label="Phone" icon={<Phone className="h-4 w-4" />} defaultValue="+977-1-4XXXXXX" />
                  <EditField label="Email" icon={<Mail className="h-4 w-4" />} defaultValue={`info@${college.slug.replace(/-/g, "")}.edu.np`} />
                </div>
                <EditField label="Programs Offered" icon={<GraduationCap className="h-4 w-4" />} defaultValue={college.programs.join(", ")} multiline />
                <EditField label="Affiliations" icon={<Building className="h-4 w-4" />} defaultValue={college.affiliations.join(", ")} />
                <EditField label="Tuition Range" icon={<FileText className="h-4 w-4" />} defaultValue={college.tuitionRange} />
                <EditField label="Admission Information" icon={<FileText className="h-4 w-4" />} defaultValue="Admissions are open annually. Contact the admissions office for details on eligibility, entrance exams, and deadlines." multiline />
              </div>

              <div className="mt-6 flex items-center gap-3">
                <button
                  onClick={() => {
                    setSaved(true);
                    setTimeout(() => setSaved(false), 2500);
                  }}
                  className="inline-flex h-11 items-center gap-2 rounded-full bg-brand px-6 text-sm font-semibold text-brand-foreground transition-transform hover:scale-105"
                >
                  <Save className="h-4 w-4" /> Save Changes
                </button>
                <span className="text-xs text-muted-foreground">
                  Changes are queued for platform-admin review before going live.
                </span>
              </div>
            </PremiumCard>
          </div>
        </div>
      )}
    </PremiumPageShell>
  );
}

function EditField({
  label,
  icon,
  defaultValue,
  multiline,
}: {
  label: string;
  icon: React.ReactNode;
  defaultValue: string;
  multiline?: boolean;
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
        <span className="text-brand">{icon}</span>
        {label}
      </div>
      {multiline ? (
        <textarea
          defaultValue={defaultValue}
          rows={3}
          className="w-full rounded-xl border border-border bg-background p-3 text-sm outline-none transition-colors focus:border-brand"
        />
      ) : (
        <input
          defaultValue={defaultValue}
          className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none transition-colors focus:border-brand"
        />
      )}
    </div>
  );
}

function ImageUpload({ label, icon }: { label: string; icon: React.ReactNode }) {
  return (
    <div>
      <div className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
        <span className="text-brand">{icon}</span>
        {label}
      </div>
      <div className="grid h-28 cursor-pointer place-items-center rounded-xl border-2 border-dashed border-border bg-muted/30 transition-colors hover:border-brand hover:bg-brand/5">
        <div className="text-center">
          <Image className="mx-auto h-6 w-6 text-muted-foreground" />
          <span className="mt-1 block text-xs text-muted-foreground">Click to upload</span>
        </div>
      </div>
    </div>
  );
}

function ReadonlyStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-muted/30 px-3 py-2">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-sm font-semibold">{value}</span>
    </div>
  );
}
