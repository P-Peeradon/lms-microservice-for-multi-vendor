using System;

namespace the_coordinator.Domain
{
    public sealed record TimetableSlotDelta(
        DateTime? StartTime,
        DateTime? EndTime,
        string? VenueId,
        string? InstructorShadowId);
}
