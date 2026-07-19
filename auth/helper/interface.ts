export enum University {
    unimelb = "University of Melbourne",
    usyd = "University of Sydney",
}

export enum Role {
    Student = "student",
    Instructor = "instructor",
    FacultyAdmin = "faculty_admin",
    CentralAdmin = "central_admin",
}

export interface PII {
    firstName: string;
    lastName: string;
    personal_email: string;
    uni_email: string;
    uni_id: string;
    address: string;
    dob: Date;
    phoneNumber: string;
}

export interface JWEPayload {
    shadowID: string;
    issuedBy: University;
    role: Role[];
}

export interface SessionObject {
  sessionId: string;
  token: string;
  shadowId: string;
  createdAt: number;
  expiresAt: number;
  ipAddress?: string;
  userAgent?: string;
}
