const mapping: Record<string, string> = {
  'automated-call-rules': 'automated_call_rule',
  'automated-call-statuses': 'automated_call_status',
  facilities: 'facility',
  residents: 'resident',
  users: 'user',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}
