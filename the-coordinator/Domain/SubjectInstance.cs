namespace the_coordinator.Domain
{
    public sealed record SubjectInstance(
        string Id,
        string SubjectCode,
        string University,
        string Faculty,
        string LecturerShadowId);
}
