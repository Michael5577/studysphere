export type AssignmentStatus = "todo" | "in_progress" | "done";

export type AssignmentPriority = "low" | "medium" | "high";

export type CourseColorKey = "indigo" | "violet" | "slate" | "amber" | "rose";

export type SessionType = "focus" | "short_break" | "long_break";

export interface Profile {
  id: string;
  full_name: string | null;
  major: string | null;
  university: string | null;
  year_level: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProfileInsert {
  id: string;
  full_name?: string | null;
  major?: string | null;
  university?: string | null;
  year_level?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface ProfileUpdate {
  full_name?: string | null;
  major?: string | null;
  university?: string | null;
  year_level?: string | null;
  updated_at?: string;
}

export interface UserPreferences {
  user_id: string;
  work_duration_minutes: number;
  break_duration_minutes: number;
  long_break_duration_minutes: number;
  compact_mode: boolean;
  show_completed_assignments: boolean;
  assignment_reminders: boolean;
  daily_summary_email: boolean;
  focus_session_alerts: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserPreferencesInsert {
  user_id: string;
  work_duration_minutes?: number;
  break_duration_minutes?: number;
  long_break_duration_minutes?: number;
  compact_mode?: boolean;
  show_completed_assignments?: boolean;
  assignment_reminders?: boolean;
  daily_summary_email?: boolean;
  focus_session_alerts?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface UserPreferencesUpdate {
  work_duration_minutes?: number;
  break_duration_minutes?: number;
  long_break_duration_minutes?: number;
  compact_mode?: boolean;
  show_completed_assignments?: boolean;
  assignment_reminders?: boolean;
  daily_summary_email?: boolean;
  focus_session_alerts?: boolean;
  updated_at?: string;
}

export interface Course {
  id: string;
  user_id: string;
  code: string;
  name: string;
  instructor: string | null;
  color_key: CourseColorKey;
  semester: string;
  is_archived: boolean;
  created_at: string;
  updated_at: string;
}

export interface CourseInsert {
  id?: string;
  user_id: string;
  code: string;
  name: string;
  instructor?: string | null;
  color_key?: CourseColorKey;
  semester?: string;
  is_archived?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CourseUpdate {
  code?: string;
  name?: string;
  instructor?: string | null;
  color_key?: CourseColorKey;
  semester?: string;
  is_archived?: boolean;
  updated_at?: string;
}

export interface Assignment {
  id: string;
  user_id: string;
  course_id: string;
  title: string;
  description: string | null;
  due_at: string | null;
  status: AssignmentStatus;
  priority: AssignmentPriority;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface AssignmentInsert {
  id?: string;
  user_id: string;
  course_id: string;
  title: string;
  description?: string | null;
  due_at?: string | null;
  status?: AssignmentStatus;
  priority?: AssignmentPriority;
  completed_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface AssignmentUpdate {
  course_id?: string;
  title?: string;
  description?: string | null;
  due_at?: string | null;
  status?: AssignmentStatus;
  priority?: AssignmentPriority;
  completed_at?: string | null;
  updated_at?: string;
}

export interface StudySession {
  id: string;
  user_id: string;
  course_id: string | null;
  session_type: SessionType;
  started_at: string;
  ended_at: string | null;
  duration_seconds: number;
  created_at: string;
  updated_at: string;
}

export interface StudySessionInsert {
  id?: string;
  user_id: string;
  course_id?: string | null;
  session_type?: SessionType;
  started_at: string;
  ended_at?: string | null;
  duration_seconds?: number;
  created_at?: string;
  updated_at?: string;
}

export interface StudySessionUpdate {
  course_id?: string | null;
  session_type?: SessionType;
  started_at?: string;
  ended_at?: string | null;
  duration_seconds?: number;
  updated_at?: string;
}

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: ProfileInsert;
        Update: ProfileUpdate;
      };
      user_preferences: {
        Row: UserPreferences;
        Insert: UserPreferencesInsert;
        Update: UserPreferencesUpdate;
      };
      courses: {
        Row: Course;
        Insert: CourseInsert;
        Update: CourseUpdate;
      };
      assignments: {
        Row: Assignment;
        Insert: AssignmentInsert;
        Update: AssignmentUpdate;
      };
      study_sessions: {
        Row: StudySession;
        Insert: StudySessionInsert;
        Update: StudySessionUpdate;
      };
    };
    Enums: {
      assignment_status: AssignmentStatus;
      assignment_priority: AssignmentPriority;
      course_color_key: CourseColorKey;
      session_type: SessionType;
    };
  };
}

export const COURSE_COLOR_KEYS: CourseColorKey[] = [
  "indigo",
  "violet",
  "slate",
  "amber",
  "rose",
];

export const ASSIGNMENT_STATUSES: AssignmentStatus[] = [
  "todo",
  "in_progress",
  "done",
];

export const ASSIGNMENT_PRIORITIES: AssignmentPriority[] = [
  "low",
  "medium",
  "high",
];

export const SESSION_TYPES: SessionType[] = [
  "focus",
  "short_break",
  "long_break",
];

export type CourseWithStats = Course & {
  open_assignments_count: number;
};

export type AssignmentWithCourse = Assignment & {
  course: Pick<Course, "code" | "name" | "color_key"> | null;
};

export interface DashboardStats {
  active_courses: number;
  due_today: number;
  due_this_week: number;
  completed_assignments: number;
  focus_minutes_today: number;
  total_focus_minutes: number;
}

export interface ActiveCourseSummary {
  id: string;
  code: string;
  name: string;
  color_key: CourseColorKey;
  open_assignments_count: number;
}

