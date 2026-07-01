import policy from "../../data/policy_terms.json";

export function getMember(memberId: string) {
  return policy.members.find(
    (m) => m.member_id === memberId
  );
}

export function daysBetween(
  start: string,
  end: string
) {
  const startDate = new Date(start);
  const endDate = new Date(end);

  const diff =
    endDate.getTime() - startDate.getTime();

  return Math.floor(
    diff / (1000 * 60 * 60 * 24)
  );
}