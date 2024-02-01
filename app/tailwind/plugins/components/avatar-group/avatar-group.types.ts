import type { PropertyVariant } from '~/types/utils';

export interface AvatarGroupProps extends Record<string, unknown> {
  limit?: number
  size?: 'xxs' | 'xs' | 'sm' | 'md' | 'lg'
  avatars: {
    src?: string
    srcDark?: string
    text?: string
  }[]
  classes?: {
    wrapper?: string | string[]
    outer?: string | string[]
    count?: string | string[]
  }
}

export interface AvatarGroupEvents {}

export interface AvatarGroupSlots {}

export type AvatarGroupAttrs = AvatarGroupProps &
  AvatarGroupEvents &
  AvatarGroupSlots
export type AvatarGroupVariant<T> = PropertyVariant<T, AvatarGroupProps>
