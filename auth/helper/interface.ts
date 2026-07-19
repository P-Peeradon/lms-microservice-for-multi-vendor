export enum University {
    UniMelb = "University of Melbourne",
    USyd = "University of Sydney",
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
    exp: number;
    iat: number;
    issuedBy: University;
    role: Role[];
}