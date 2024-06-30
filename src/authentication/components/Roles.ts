/**
 * Represents the different roles available for access control.
 */
enum Role {
  Owner = 'owner',
  Admin = 'admin',
  Student = 'student',
  Pending = 'pending',
  PreEnrollment = 'pre-enrollment',
  Rejected = 'rejected',
  Unauthenticated = 'unauthenticated'
}

/**
 * Array of roles that are allowed to access the authenticated routes.
 */
const ALLOW_AUTHED_ROLES = [Role.Owner, Role.Admin, Role.Student];

export default Role;
export { ALLOW_AUTHED_ROLES };
