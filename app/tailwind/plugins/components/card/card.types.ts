import type { PropertyVariant } from '~/types/utils';

export interface CardProps extends Record<string, unknown> {
  rounded?: 'none' | 'sm' | 'md' | 'lg'
  elevated?: boolean
  elevatedHover?: boolean
  color?:
    | 'white'
    | 'white-contrast'
    | 'muted'
    | 'muted-contrast'
    | 'primary'
    | 'info'
    | 'success'
    | 'warning'
    | 'danger'
    | 'none'
  classes?: {
    wrapper?: string | string[]
  }
}

export interface CardEvents {}

export interface CardSlots {
  children: any
}

export type CardAttrs = CardProps & CardEvents & CardSlots
export type CardVariant<T> = PropertyVariant<T, CardProps>
