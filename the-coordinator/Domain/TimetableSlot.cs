using System;

namespace the_coordinator.Domain
{
    public sealed record TimetableSlot(
        string Id,
        string SubjectInstanceId,
        string VenueId,
        DateTime StartTime,
        DateTime EndTime,
        string InstructorShadowId,
        int Capacity,
        int EnrolledCount);
}
