"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";

const DEPARTMENTS = [
  "Computer Science",
  "Information Technology",
  "Electronics",
  "Mechanical",
  "Civil",
  "Electrical",
];

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

type Gender = "Male" | "Female" | "Other";

function FieldRow({ label, value, editing, children }: { label: string; value?: string; editing?: boolean; children?: React.ReactNode }) {
  return (
    <div
      className="flex items-start justify-between gap-6 py-3"
      style={{ borderBottom: "var(--rule)" }}
    >
      <span className="label-caps shrink-0 pt-[3px]">{label}</span>
      {editing ? children : (
        <span className="text-sm text-foreground text-right">{value || "—"}</span>
      )}
    </div>
  );
}

export default function StudentProfilePage() {
  const { user } = useUser();
  const profile = useQuery(api.functions.queries.getMyProfile);
  const createProfile = useMutation(api.functions.mutations.createStudentProfile);
  const updateProfile = useMutation(api.functions.mutations.updateMyProfile);

  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    roll_number: "",
    full_name: user?.fullName ?? "",
    phone_number: "",
    date_of_birth: "",
    gender: "" as Gender | "",
    department: "",
    batch: "",
    current_semester: 1,
    father_name: "",
    mother_name: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    emergency_contact: "",
    blood_group: "",
  });

  const [editForm, setEditForm] = useState({
    phone_number: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    emergency_contact: "",
    blood_group: "",
  });

  if (profile === undefined) {
    return <div className="flex items-center justify-center min-h-[60vh]"><Spinner /></div>;
  }

  /* ── CREATE PROFILE ────────────────────────────────── */
  if (profile === null) {
    const handleCreate = async () => {
      const r = form;
      if (!r.roll_number || !r.full_name || !r.phone_number || !r.date_of_birth || !r.gender || !r.department || !r.batch || !r.father_name || !r.mother_name || !r.address || !r.city || !r.state || !r.pincode || !r.emergency_contact) {
        return toast.error("Please fill in all required fields");
      }
      if (!/^\d{6,10}$/.test(r.roll_number)) return toast.error("Roll number must be 6–10 digits");
      if (!/^\d{10}$/.test(r.phone_number)) return toast.error("Phone must be 10 digits");
      if (!/^\d{6}$/.test(r.pincode)) return toast.error("Pincode must be 6 digits");
      if (!/^\d{10}$/.test(r.emergency_contact)) return toast.error("Emergency contact must be 10 digits");

      setSaving(true);
      try {
        await createProfile({
          roll_number: r.roll_number,
          full_name: r.full_name,
          phone_number: r.phone_number,
          date_of_birth: r.date_of_birth,
          gender: r.gender as Gender,
          department: r.department,
          batch: r.batch,
          current_semester: r.current_semester,
          father_name: r.father_name,
          mother_name: r.mother_name,
          address: r.address,
          city: r.city,
          state: r.state,
          pincode: r.pincode,
          emergency_contact: r.emergency_contact,
          blood_group: r.blood_group || undefined,
        });
        toast.success("Profile created successfully");
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setSaving(false);
      }
    };

    const f = form;
    const setF = (updates: Partial<typeof form>) => setForm((prev) => ({ ...prev, ...updates }));

    const inputClass = "h-8 rounded-sm text-sm border-0 border-b border-border px-0 bg-transparent focus-visible:ring-0 focus-visible:border-foreground transition-colors";
    const selectTriggerClass = "h-8 rounded-sm text-sm border border-border";

    return (
      <div className="animate-fade-up space-y-10 max-w-2xl">
        <div>
          <p className="label-caps mb-1">Student Portal</p>
          <h1 className="font-display text-2xl text-foreground">Create Your Profile</h1>
          <p className="text-sm text-muted-foreground mt-1">Fill in your details to complete registration. Fields marked * are required.</p>
        </div>

        {/* Personal */}
        <div>
          <p className="label-caps mb-3" style={{ borderBottom: "var(--rule-strong)", paddingBottom: "0.5rem" }}>Personal Information</p>
          <div style={{ borderTop: "none" }}>
            {[
              { label: "Full Name *",     field: "full_name",    placeholder: "Your full name" },
              { label: "Roll Number *",   field: "roll_number",  placeholder: "6–10 digit enrollment number" },
              { label: "Date of Birth *", field: "date_of_birth", placeholder: "", type: "date" },
              { label: "Father's Name *", field: "father_name",  placeholder: "" },
              { label: "Mother's Name *", field: "mother_name",  placeholder: "" },
            ].map(({ label, field, placeholder, type }) => (
              <div key={field} className="flex items-center gap-6 py-3" style={{ borderBottom: "var(--rule)" }}>
                <span className="label-caps w-32 shrink-0">{label}</span>
                <Input
                  type={type ?? "text"}
                  value={(f as Record<string, string | number>)[field] as string}
                  onChange={(e) => setF({ [field]: e.target.value } as Partial<typeof form>)}
                  placeholder={placeholder}
                  className={inputClass}
                />
              </div>
            ))}
            <div className="flex items-center gap-6 py-3" style={{ borderBottom: "var(--rule)" }}>
              <span className="label-caps w-32 shrink-0">Gender *</span>
              <Select value={f.gender} onValueChange={(v) => setF({ gender: v as Gender })}>
                <SelectTrigger className={selectTriggerClass}><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent className="rounded-sm">
                  {["Male","Female","Other"].map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-6 py-3" style={{ borderBottom: "var(--rule)" }}>
              <span className="label-caps w-32 shrink-0">Blood Group</span>
              <Select value={f.blood_group} onValueChange={(v) => setF({ blood_group: v })}>
                <SelectTrigger className={selectTriggerClass}><SelectValue placeholder="Optional" /></SelectTrigger>
                <SelectContent className="rounded-sm">
                  {BLOOD_GROUPS.map((bg) => <SelectItem key={bg} value={bg}>{bg}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Academic */}
        <div>
          <p className="label-caps mb-3" style={{ borderBottom: "var(--rule-strong)", paddingBottom: "0.5rem" }}>Academic Information</p>
          <div className="flex items-center gap-6 py-3" style={{ borderBottom: "var(--rule)" }}>
            <span className="label-caps w-32 shrink-0">Department *</span>
            <Select value={f.department} onValueChange={(v) => setF({ department: v })}>
              <SelectTrigger className={selectTriggerClass}><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent className="rounded-sm">
                {DEPARTMENTS.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-6 py-3" style={{ borderBottom: "var(--rule)" }}>
            <span className="label-caps w-32 shrink-0">Batch *</span>
            <Input value={f.batch} onChange={(e) => setF({ batch: e.target.value })} placeholder="e.g. 2023–2027" className={inputClass} />
          </div>
          <div className="flex items-center gap-6 py-3" style={{ borderBottom: "var(--rule)" }}>
            <span className="label-caps w-32 shrink-0">Semester *</span>
            <Select value={String(f.current_semester)} onValueChange={(v) => setF({ current_semester: Number(v) })}>
              <SelectTrigger className={selectTriggerClass}><SelectValue /></SelectTrigger>
              <SelectContent className="rounded-sm">
                {[1,2,3,4,5,6,7,8].map((s) => <SelectItem key={s} value={String(s)}>Semester {s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Contact */}
        <div>
          <p className="label-caps mb-3" style={{ borderBottom: "var(--rule-strong)", paddingBottom: "0.5rem" }}>Contact & Address</p>
          {[
            { label: "Phone *",           field: "phone_number",     placeholder: "10 digits" },
            { label: "Emergency *",       field: "emergency_contact", placeholder: "10 digits" },
            { label: "Address *",         field: "address",           placeholder: "Street address" },
            { label: "City *",            field: "city",              placeholder: "" },
            { label: "State *",           field: "state",             placeholder: "" },
            { label: "Pincode *",         field: "pincode",           placeholder: "6 digits" },
          ].map(({ label, field, placeholder }) => (
            <div key={field} className="flex items-center gap-6 py-3" style={{ borderBottom: "var(--rule)" }}>
              <span className="label-caps w-32 shrink-0">{label}</span>
              <Input
                value={(f as Record<string, string | number>)[field] as string}
                onChange={(e) => setF({ [field]: e.target.value } as Partial<typeof form>)}
                placeholder={placeholder}
                className={inputClass}
              />
            </div>
          ))}
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleCreate}
            disabled={saving}
            className="inline-flex items-center gap-2 h-9 px-6 text-sm font-semibold text-primary-foreground bg-primary hover:opacity-90 disabled:opacity-50 transition-opacity"
            style={{ borderRadius: "2px" }}
          >
            {saving && <Spinner className="size-4" />}
            Create Profile
          </button>
        </div>
      </div>
    );
  }

  /* ── VIEW / EDIT PROFILE ───────────────────────────── */
  const startEditing = () => {
    setEditForm({
      phone_number: profile.phone_number,
      address: profile.address,
      city: profile.city,
      state: profile.state,
      pincode: profile.pincode,
      emergency_contact: profile.emergency_contact,
      blood_group: profile.blood_group ?? "",
    });
    setIsEditing(true);
  };

  const handleSaveEdit = async () => {
    if (editForm.phone_number && !/^\d{10}$/.test(editForm.phone_number)) return toast.error("Phone must be 10 digits");
    if (editForm.pincode && !/^\d{6}$/.test(editForm.pincode)) return toast.error("Pincode must be 6 digits");
    if (editForm.emergency_contact && !/^\d{10}$/.test(editForm.emergency_contact)) return toast.error("Emergency contact must be 10 digits");
    setSaving(true);
    try {
      await updateProfile({
        phone_number: editForm.phone_number,
        address: editForm.address,
        city: editForm.city,
        state: editForm.state,
        pincode: editForm.pincode,
        emergency_contact: editForm.emergency_contact,
        blood_group: editForm.blood_group || undefined,
      });
      toast.success("Profile updated");
      setIsEditing(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  const inputEdit = "h-8 rounded-sm text-sm border-0 border-b border-border px-0 bg-transparent focus-visible:ring-0 focus-visible:border-foreground transition-colors";

  const sections = [
    {
      label: "Personal",
      fields: [
        { label: "Full Name",       value: profile.full_name       },
        { label: "Roll Number",     value: profile.roll_number     },
        { label: "Email",           value: profile.email           },
        { label: "Date of Birth",   value: profile.date_of_birth   },
        { label: "Gender",          value: profile.gender          },
        { label: "Father's Name",   value: profile.father_name     },
        { label: "Mother's Name",   value: profile.mother_name     },
        { label: "Blood Group",     value: profile.blood_group ?? "—" },
      ],
    },
    {
      label: "Academic",
      fields: [
        { label: "Department",  value: profile.department                   },
        { label: "Batch",       value: profile.batch                        },
        { label: "Semester",    value: `Semester ${profile.current_semester}` },
      ],
    },
  ];

  return (
    <div className="animate-fade-up space-y-10">
      <div className="flex items-start justify-between">
        <div>
          <p className="label-caps mb-1">Student</p>
          <h1 className="font-display text-2xl text-foreground">My Profile</h1>
          <p className="text-sm text-muted-foreground mt-1">{profile.roll_number} · {profile.department}</p>
        </div>
        {!isEditing && (
          <button
            onClick={startEditing}
            className="text-xs font-medium text-primary underline underline-offset-4 hover:opacity-70 transition-opacity"
          >
            Edit contact info
          </button>
        )}
      </div>

      {/* Read-only fields */}
      {sections.map((section) => (
        <div key={section.label} className="max-w-xl">
          <p className="label-caps mb-0" style={{ borderBottom: "var(--rule-strong)", paddingBottom: "0.5rem" }}>
            {section.label}
          </p>
          {section.fields.map(({ label, value }) => (
            <div key={label} className="flex items-start justify-between gap-6 py-3" style={{ borderBottom: "var(--rule)" }}>
              <span className="label-caps shrink-0">{label}</span>
              <span className="text-sm text-foreground text-right">{value}</span>
            </div>
          ))}
        </div>
      ))}

      {/* Contact — editable section */}
      <div className="max-w-xl">
        <p className="label-caps mb-0" style={{ borderBottom: "var(--rule-strong)", paddingBottom: "0.5rem" }}>
          Contact & Address{isEditing && <span className="text-primary"> (editing)</span>}
        </p>
        {[
          { label: "Phone Number",      key: "phone_number"      as keyof typeof editForm },
          { label: "Emergency Contact", key: "emergency_contact" as keyof typeof editForm },
          { label: "Address",           key: "address"           as keyof typeof editForm },
          { label: "City",              key: "city"              as keyof typeof editForm },
          { label: "State",             key: "state"             as keyof typeof editForm },
          { label: "Pincode",           key: "pincode"           as keyof typeof editForm },
        ].map(({ label, key }) => (
          <div key={key} className="flex items-center justify-between gap-6 py-3" style={{ borderBottom: "var(--rule)" }}>
            <span className="label-caps shrink-0">{label}</span>
            {isEditing ? (
              <Input
                value={editForm[key]}
                onChange={(e) => setEditForm((prev) => ({ ...prev, [key]: e.target.value }))}
                className={`${inputEdit} text-right max-w-[16rem]`}
              />
            ) : (
              <span className="text-sm text-foreground text-right">
                {(profile as Record<string, string | number | undefined>)[key] ?? "—"}
              </span>
            )}
          </div>
        ))}

        {isEditing && (
          <div className="flex items-center gap-6 py-3" style={{ borderBottom: "var(--rule)" }}>
            <span className="label-caps shrink-0">Blood Group</span>
            <Select value={editForm.blood_group} onValueChange={(v) => setEditForm((prev) => ({ ...prev, blood_group: v }))}>
              <SelectTrigger className="h-8 rounded-sm text-sm max-w-[16rem] border border-border">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent className="rounded-sm">
                {BLOOD_GROUPS.map((bg) => <SelectItem key={bg} value={bg}>{bg}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        )}

        {isEditing && (
          <div className="flex justify-end gap-3 mt-4">
            <button
              onClick={() => setIsEditing(false)}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveEdit}
              disabled={saving}
              className="inline-flex items-center gap-2 h-9 px-5 text-sm font-semibold text-primary-foreground bg-primary transition-opacity hover:opacity-90 disabled:opacity-50"
              style={{ borderRadius: "2px" }}
            >
              {saving && <Spinner className="size-4" />}
              Save Changes
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
