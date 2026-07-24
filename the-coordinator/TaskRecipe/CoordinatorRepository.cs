using System.Collections.Generic;
using System.Threading.Tasks;
using the_coordinator;
using the_coordinator.Helpers;
using the_coordinator.Domain;

namespace the_coordinator.TaskRecipe
{
	public interface ICoordinatorTaskDispatcher<T> where T : class
	{
		// User lookups
		Task<User?> GetUserByShadowIdAsync(string shadowId);
		Task<User?> GetUserByIdAsync(string userId);

		// Subject instance
		Task<SubjectInstance?> GetSubjectInstanceByIdAsync(string subjectInstanceId);

		// Timetable slots
		Task<TimetableSlot?> GetTimetableSlotByIdAsync(string timetableSlotId);
		Task<IReadOnlyList<TimetableSlot>> GetTimetableSlotsByInstructorAsync(string instructorShadowId);
		Task<IReadOnlyList<TimetableSlot>> GetTimetableSlotsBySubjectInstanceAsync(string subjectInstanceId);
		Task<IReadOnlyList<TimetableSlot>> GetTimetableSlotsByStudentShadowAsync(string studentShadowId);

		// Enrollment / capacity operations
		Task AddStudentToSlotAsync(string timetableSlotId, string studentShadowId);
		Task RemoveStudentFromSlotAsync(string timetableSlotId, string studentShadowId);
		Task<int> GetEnrolledCountAsync(string timetableSlotId);
		Task<bool> SlotHasCapacityAsync(string timetableSlotId);

		// Slot updates
		Task UpdateTimetableSlotAsync(TimetableSlot slot);
	}
}