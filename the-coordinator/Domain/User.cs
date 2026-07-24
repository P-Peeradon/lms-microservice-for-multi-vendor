namespace the_coordinator.Domain
{
    public sealed record User(
        string Id,
        string ShadowId,
        string FullName,
        string University,
        string Role);
}
