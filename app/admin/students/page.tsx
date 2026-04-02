"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import { Search } from "lucide-react";

const DEPARTMENTS = [
  "Computer Science",
  "Information Technology",
  "Electronics",
  "Mechanical",
  "Civil",
  "Electrical",
];

const profileFields = [
  { key: "full_name",         label: "Full Name"         },
  { key: "roll_number",       label: "Roll Number"       },
  { key: "email",             label: "Email"             },
  { key: "phone_number",      label: "Phone"             },
  { key: "date_of_birth",     label: "Date of Birth"     },
  { key: "gender",            label: "Gender"            },
  { key: "blood_group",       label: "Blood Group"       },
  { key: "department",        label: "Department"        },
  { key: "batch",             label: "Batch"             },
  { key: "current_semester",  label: "Semester"          },
  { key: "father_name",       label: "Father's Name"     },
  { key: "mother_name",       label: "Mother's Name"     },
  { key: "address",           label: "Address"           },
  { key: "city",              label: "City"              },
  { key: "state",             label: "State"             },
  { key: "pincode",           label: "Pincode"           },
  { key: "emergency_contact", label: "Emergency Contact" },
] as const;

type ProfileKey = typeof profileFields[number]["key"];

export default function StudentsPage() {
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("all");
  const [semFilter, setSemFilter] = useState("0");

  const profiles = useQuery(api.functions.queries.listStudentProfiles, {
    department_filter: deptFilter,
    semester_filter: parseInt(semFilter),
    search: search || undefined,
  });

  if (profiles === undefined) {
    return <div className="flex justify-center items-center h-64"><Spinner /></div>;
  }

  return (
    <div className="animate-fade-up space-y-8">
      <div>
        <p className="label-caps mb-1">Admin</p>
        <h1 className="font-display text-2xl text-foreground">Student Profiles</h1>
        <p className="text-sm text-muted-foreground mt-1">View all registered student academic and personal records.</p>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3" style={{ borderTop: "var(--rule-strong)", paddingTop: "1.5rem" }}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Name, roll number, or email"
            className="pl-9 h-9 rounded-sm text-sm"
          />
        </div>
        <Select value={deptFilter} onValueChange={setDeptFilter}>
          <SelectTrigger className="h-9 rounded-sm text-sm"><SelectValue placeholder="All Departments" /></SelectTrigger>
          <SelectContent className="rounded-sm">
            <SelectItem value="all">All Departments</SelectItem>
            {DEPARTMENTS.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={semFilter} onValueChange={setSemFilter}>
          <SelectTrigger className="h-9 rounded-sm text-sm"><SelectValue placeholder="All Semesters" /></SelectTrigger>
          <SelectContent className="rounded-sm">
            <SelectItem value="0">All Semesters</SelectItem>
            {[1,2,3,4,5,6,7,8].map((s) => <SelectItem key={s} value={String(s)}>Semester {s}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* Count */}
      <p className="text-xs text-muted-foreground">{profiles.length} student(s) found</p>

      {/* Table */}
      {profiles.length === 0 ? (
        <div style={{ borderTop: "var(--rule)" }}>
          <p className="text-sm text-muted-foreground py-10">No student profiles match the current filters.</p>
        </div>
      ) : (
        <div className="overflow-x-auto" style={{ borderTop: "var(--rule-strong)" }}>
          {/* Header */}
          <div
            className="grid gap-4 py-2 px-1 bg-muted/40 min-w-[56rem]"
            style={{
              gridTemplateColumns: "6rem 1fr 1fr 10rem 4rem 5rem 5rem",
              borderBottom: "var(--rule-strong)",
            }}
          >
            {["Roll No", "Name", "Email", "Department", "Sem", "Batch", "Details"].map((h) => (
              <span key={h} className="label-caps">{h}</span>
            ))}
          </div>

          {profiles.map((profile) => (
            <div
              key={profile._id}
              className="grid gap-4 py-3.5 px-1 items-center min-w-[56rem] hover:bg-muted/20 transition-colors"
              style={{
                gridTemplateColumns: "6rem 1fr 1fr 10rem 4rem 5rem 5rem",
                borderBottom: "var(--rule)",
              }}
            >
              <span className="text-xs font-mono text-muted-foreground">{profile.roll_number}</span>
              <span className="text-sm font-medium text-foreground truncate">{profile.full_name}</span>
              <span className="text-xs text-muted-foreground truncate">{profile.email}</span>
              <span className="text-xs text-muted-foreground truncate">{profile.department}</span>
              <span className="text-sm text-center text-foreground">{profile.current_semester}</span>
              <span className="text-xs text-muted-foreground">{profile.batch}</span>

              {/* View dialog */}
              <Dialog>
                <DialogTrigger asChild>
                  <button className="text-xs font-medium text-primary underline underline-offset-4 hover:opacity-70 transition-opacity text-left">
                    View
                  </button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-lg rounded-sm max-h-[80vh] overflow-y-auto" style={{ border: "var(--rule-strong)" }}>
                  <DialogHeader>
                    <DialogTitle className="font-display text-lg">{profile.full_name}</DialogTitle>
                    <p className="label-caps mt-1">{profile.roll_number} · {profile.department} · Sem {profile.current_semester}</p>
                  </DialogHeader>
                  <div style={{ borderTop: "var(--rule)" }}>
                    {profileFields.map(({ key, label }) => {
                      const val = profile[key as ProfileKey];
                      return (
                        <div
                          key={key}
                          className="flex justify-between items-start py-3 gap-6"
                          style={{ borderBottom: "var(--rule)" }}
                        >
                          <span className="label-caps shrink-0">{label}</span>
                          <span className="text-sm text-foreground text-right">
                            {val !== undefined && val !== null && val !== "" ? String(val) : "—"}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
