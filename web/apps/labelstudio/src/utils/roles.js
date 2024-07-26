export const ROLES = Object.freeze({
  LABELER: 1,
  LABELING_COORDINATOR: 2,
  LABELING_INFRA: 3
});

export function getRoleName(user_role){
  if(user_role === 1) return "Labeler"
  if(user_role === 2) return "Coordinator"
  if(user_role === 3) return "Infra"

  return "Unknown"
}