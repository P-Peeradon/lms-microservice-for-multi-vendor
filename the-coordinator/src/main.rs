pub mod pb {
    tonic::include_proto!("coordinator");
}

use pb::coordinator_service_server::{CoordinatorService, CoordinatorServiceServer};
use pb::*;
use serde::Deserialize;
use tonic::{Request, Response, Status};

#[derive(Debug, Deserialize)]
struct RegisterStudentPayload {
    shadow_id: String,
    subject_instance_id: String,
}
#[derive(Debug, Deserialize)]
struct ReportConflictPayload {
    instructor_shadow_id: Option<String>,
    timetable_slot_id_1: Option<String>,
    venue_id_1: Option<String>,
    timetable_slot_id_2: Option<String>,
    venue_id_2: Option<String>,
    venue_id: Option<String>,
    instructor_shadow_id_1: Option<String>,
    instructor_shadow_id_2: Option<String>,
}

#[derive(Debug, Deserialize)]
struct ChangeTimetableEntryPayload {
    timetable_slot_id: String,
    new_start_time: String,
    new_end_time: String,
    new_venue: String,
}

#[derive(Debug, Deserialize)]
struct AssignInstructorPayload {
    timetable_slot_id: String,
    instructor_shadow_id: String,
}

#[derive(Debug, Deserialize)]
struct RequestRoomPayload {
    timetable_slot_id: String,
    requested_venue: String,
    required_capacity: String,
    start_time: String,
    end_time: String,
    date: String,
}

#[derive(Debug, Deserialize)]
struct GetStaffTimetablePayload {
    instructor_shadow_id: String,
}

#[derive(Clone, Default)]
pub struct CoordinatorSvc;

fn parse_payload<T: for<'de> Deserialize<'de>>(payload: &str) -> Result<T, Status> {
    serde_json::from_str(payload).map_err(|e| Status::invalid_argument(e.to_string()))
}

#[tonic::async_trait]
impl CoordinatorService for CoordinatorSvc {
    async fn register_student(
        &self,
        request: Request<RegisterStudentRequest>,
    ) -> Result<Response<RegisterStudentResponse>, Status> {
        let req = request.into_inner();

        if req.shadow_id.trim().is_empty() {
            return Err(Status::invalid_argument("shadow_id is required"));
        }

        if req.university.trim().is_empty() {
            return Err(Status::invalid_argument("university is required"));
        }

        let payload: RegisterStudentPayload = parse_payload(&req.register_student_json)?;

        let student_id = payload.shadow_id.clone();
        Ok(Response::new(RegisterStudentResponse {
            student_id,
            status: "SUCCESS".into(),
            error_message: "".into(),
        }))
    }

    async fn report_conflict(
        &self,
        request: Request<ReportConflictRequest>,
    ) -> Result<Response<ReportConflictResponse>, Status> {
        let req = request.into_inner();

        if req.shadow_id.trim().is_empty() {
            return Err(Status::invalid_argument("shadow_id is required"));
        }

        if req.university.trim().is_empty() {
            return Err(Status::invalid_argument("university is required"));
        }

        let _payload: ReportConflictPayload = parse_payload(&req.conflict_details_json)?;

        Ok(Response::new(ReportConflictResponse {
            conflict_id: "conflict-0001".into(),
            status: "SUCCESS".into(),
            error_message: "".into(),
        }))
    }

    async fn change_timetable_entry(
        &self,
        request: Request<ChangeTimetableEntryRequest>,
    ) -> Result<Response<ChangeTimetableEntryResponse>, Status> {
        let req = request.into_inner();

        if req.shadow_id.trim().is_empty() {
            return Err(Status::invalid_argument("shadow_id is required"));
        }

        let payload: ChangeTimetableEntryPayload = parse_payload(&req.change_entry_json)?;

        Ok(Response::new(ChangeTimetableEntryResponse {
            updated_entry_id: payload.timetable_slot_id.clone(),
            status: "SUCCESS".into(),
            error_message: "".into(),
        }))
    }

    async fn assign_instructor(
        &self,
        request: Request<AssignInstructorRequest>,
    ) -> Result<Response<AssignInstructorResponse>, Status> {
        let req = request.into_inner();

        if req.shadow_id.trim().is_empty() {
            return Err(Status::invalid_argument("shadow_id is required"));
        }

        let payload: AssignInstructorPayload = parse_payload(&req.assign_instructor_json)?;

        Ok(Response::new(AssignInstructorResponse {
            assignment_id: format!("assignment-{}", payload.timetable_slot_id),
            status: "SUCCESS".into(),
            error_message: "".into(),
        }))
    }

    async fn request_room(
        &self,
        request: Request<RequestRoomRequest>,
    ) -> Result<Response<RequestRoomResponse>, Status> {
        let req = request.into_inner();

        if req.shadow_id.trim().is_empty() {
            return Err(Status::invalid_argument("shadow_id is required"));
        }

        if req.university.trim().is_empty() {
            return Err(Status::invalid_argument("university is required"));
        }

        let payload: RequestRoomPayload = parse_payload(&req.room_request_json)?;

        Ok(Response::new(RequestRoomResponse {
            allocated_room_id: format!("room-{}", payload.timetable_slot_id),
            status: "SUCCESS".into(),
            error_message: "".into(),
        }))
    }

    async fn get_staff_timetable(
        &self,
        request: Request<GetStaffTimetableRequest>,
    ) -> Result<Response<GetStaffTimetableResponse>, Status> {
        let req = request.into_inner();

        if req.shadow_id.trim().is_empty() {
            return Err(Status::invalid_argument("shadow_id is required"));
        }

        if req.university.trim().is_empty() {
            return Err(Status::invalid_argument("university is required"));
        }

        let payload: GetStaffTimetablePayload = parse_payload(&req.staff_timetable_json)?;

        let entry = TimetableEntry {
            entry_id: "entry-001".into(),
            course_code: "CS101".into(),
            room_id: "ROOM-100".into(),
            start_time: "09:00".into(),
            end_time: "10:30".into(),
            date: "2026-09-01".into(),
            instructor_id: payload.instructor_shadow_id.clone(),
        };

        Ok(Response::new(GetStaffTimetableResponse {
            entries: vec![entry],
            status: "SUCCESS".into(),
            error_message: "".into(),
        }))
    }
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let addr = "[::1]:5360".parse()?;
    let svc = CoordinatorSvc::default();

    println!("CoordinatorService listening on {}", addr);

    tonic::transport::Server::builder()
        .add_service(CoordinatorServiceServer::new(svc))
        .serve(addr)
        .await?;

    Ok(())
}
