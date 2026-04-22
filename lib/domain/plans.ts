export type PlanType = 'basic_monthly' | 'premium_monthly' | 'basic_yearly' | 'premium_yearly'

export function isPlanType(value: string): value is PlanType {
  return (
    value === 'basic_monthly' ||
    value === 'premium_monthly' ||
    value === 'basic_yearly' ||
    value === 'premium_yearly'
  )
}

export function planPriceInr(plan: PlanType): number {
  switch (plan) {
    case 'basic_monthly':
      return 199
    case 'premium_monthly':
      return 499
    case 'basic_yearly':
      return 1990
    case 'premium_yearly':
      return 4990
  }
}

export function planDurationDays(plan: PlanType): number {
  return plan.endsWith('_yearly') ? 365 : 30
}

export function planLabel(plan: PlanType): string {
  switch (plan) {
    case 'basic_monthly':
      return 'Basic (Monthly)'
    case 'premium_monthly':
      return 'Premium (Monthly)'
    case 'basic_yearly':
      return 'Basic (Yearly)'
    case 'premium_yearly':
      return 'Premium (Yearly)'
  }
}
