import { z } from "zod/v4";

// ─── Name Validation ─────────────────────────────────────
// Only letters (including accented/unicode), spaces, hyphens, and apostrophes.
// Digits and special characters are explicitly rejected.
export const nameSchema = z
  .string()
  .min(2, "Name must be at least 2 characters")
  .max(50, "Name must be at most 50 characters")
  .regex(
    /^[\p{L}\s'\-]+$/u,
    "Name must contain only letters — no numbers or special characters"
  );

// ─── Email Validation ─────────────────────────────────────
//
// DESIGN NOTE — why we allow addresses like scufjh@hfg.pt
// ──────────────────────────────────────────────────────────
// Email FORMAT validation only checks whether the address is
// syntactically correct per RFC 5321.  It cannot tell whether
// a mailbox is real or fake — that is the job of the OTP
// verification step (Clerk sends a code; the user must type it).
//
// scufjh@hfg.pt  → valid format, .pt is Portugal's ccTLD ✓
// 24100030044.uset@ltsu.ac.in → valid format ✓
// fake@@domain   → invalid structure ✗
// user@domain    → no TLD ✗
// user@.com      → empty label ✗
//
// Regex anatomy:
//   Local part  : 1-64 chars; alphanumeric + .!#$%&'*+/=?^_`{|}~-
//                 No leading/trailing dot; no consecutive dots
//   @
//   Domain      : one or more labels separated by dots
//                 Each label: 1-63 chars of alphanum/hyphen
//                 Labels cannot start or end with a hyphen
//   TLD         : at least 2 alpha characters (covers .in .ac .uk .com .io etc.)
//
const EMAIL_REGEX =
  /^(?=[^@]{1,64}@)[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;

export const signUpSchema = z.object({
  firstName: nameSchema,
  lastName: nameSchema,
  emailAddress: z
    .string()
    .min(1, "Email is required")
    .regex(EMAIL_REGEX, "Enter a valid email address (e.g. name@domain.com)"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must include at least one uppercase letter")
    .regex(/[0-9]/, "Must include at least one number"),
});

export const templateSchema = z.object({
  subjects: z.array(z.string().min(1, "Subject name required")).length(7, "Exactly 7 subjects required"),
});

export const marksEntrySchema = z.object({
  student_clerk_id: z.string().min(1, "Select a student"),
  semester: z.number().min(1).max(8),
  marks: z.array(
    z.object({
      subject_name: z.string(),
      mst1: z.number().min(0).max(25, "Max 25"),
      mst2: z.number().min(0).max(25, "Max 25"),
      est: z.number().min(0).max(50, "Max 50"),
    })
  ),
});

export const noticeSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  priority: z.enum(["low", "medium", "high"]),
  target_audience: z.string().min(1, "Target audience required"),
});

export const studentProfileSchema = z.object({
  roll_number: z.string().regex(/^\d{6,10}$/, "Roll number must be 6-10 digits"),
  full_name: z.string().min(2, "Min 2 characters").max(100, "Max 100 characters"),
  phone_number: z.string().regex(/^\d{10}$/, "Must be 10 digits"),
  date_of_birth: z.string().min(1, "Date of birth required"),
  gender: z.enum(["Male", "Female", "Other"]),
  department: z.string().min(1, "Department required"),
  batch: z.string().min(1, "Batch required"),
  current_semester: z.number().min(1, "Min semester 1").max(8, "Max semester 8"),
  father_name: z.string().min(1, "Father's name required"),
  mother_name: z.string().min(1, "Mother's name required"),
  address: z.string().min(1, "Address required"),
  city: z.string().min(1, "City required"),
  state: z.string().min(1, "State required"),
  pincode: z.string().regex(/^\d{6}$/, "Must be 6 digits"),
  emergency_contact: z.string().regex(/^\d{10}$/, "Must be 10 digits"),
  blood_group: z.string().optional(),
});

export type TemplateFormData = z.infer<typeof templateSchema>;
export type MarksEntryFormData = z.infer<typeof marksEntrySchema>;
export type NoticeFormData = z.infer<typeof noticeSchema>;
export type StudentProfileFormData = z.infer<typeof studentProfileSchema>;
