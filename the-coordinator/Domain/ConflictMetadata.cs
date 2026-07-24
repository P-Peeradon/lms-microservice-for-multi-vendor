namespace the_coordinator.Domain
{
    public sealed record ConflictMetadata(
        bool HasConflict,
        string? ConflictingSlotId,
        string? Message);
}
