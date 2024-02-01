import colors from 'tailwindcss/colors';
import { fontFamily } from 'tailwindcss/defaultTheme';

/**
 * Default theme for shuriken-ui preset
 */
export const defaultTheme = {
    fontFamily: {
        sans: fontFamily.sans,
        heading: fontFamily.sans,
        alt: fontFamily.sans,
        mono: fontFamily.mono,
    },
    extend: {
        colors: {
            primary: colors.violet,
            'primary-invert': colors.white,
            muted: colors.slate,
            info: colors.sky,
            success: colors.teal,
            warning: colors.amber,
            danger: colors.rose,
        },
        screens: {
            xs: { max: '639px' },
            lg: '1025px',
            ptablet: {
                raw: '(min-width: 768px) and (max-width: 1024px) and (orientation: portrait)',
            },
            ltablet: {
                raw: '(min-width: 768px) and (max-width: 1024px) and (orientation: landscape)',
            },
        },
        typography: ({ theme }: any) => ({
            primary: {
                css: {
                    '--tw-prose-links': theme('colors.primary.600'),
                    '--tw-prose-quote-borders': theme('colors.primary.600'),

                    '--tw-prose-invert-links': theme('colors.primary.500'),
                    '--tw-prose-invert-quote-borders': theme('colors.primary.500'),
                },
            },
            muted: {
                css: {
                    '--tw-prose-body': theme('colors.muted.700'),
                    '--tw-prose-headings': theme('colors.muted.800'),
                    '--tw-prose-lead': theme('colors.muted.600'),
                    '--tw-prose-bold': theme('colors.muted.800'),
                    '--tw-prose-counters': theme('colors.muted.500'),
                    '--tw-prose-bullets': theme('colors.muted.300'),
                    '--tw-prose-hr': theme('colors.muted.200'),
                    '--tw-prose-quotes': theme('colors.muted.500'),
                    '--tw-prose-captions': theme('colors.muted.500'),
                    '--tw-prose-code': theme('colors.muted.800'),
                    '--tw-prose-pre-code': theme('colors.muted.800'),
                    '--tw-prose-pre-bg': theme('colors.muted.100'),
                    '--tw-prose-th-borders': theme('colors.muted.300'),
                    '--tw-prose-td-borders': theme('colors.muted.200'),

                    '--tw-prose-invert-body': theme('colors.muted.400'),
                    '--tw-prose-invert-headings': theme('colors.muted.100'),
                    '--tw-prose-invert-lead': theme('colors.muted.300'),
                    '--tw-prose-invert-bold': theme('colors.muted.300'),
                    '--tw-prose-invert-counters': theme('colors.muted.400'),
                    '--tw-prose-invert-bullets': theme('colors.muted.400'),
                    '--tw-prose-invert-hr': theme('colors.muted.800'),
                    '--tw-prose-invert-quotes': theme('colors.muted.200'),
                    '--tw-prose-invert-captions': theme('colors.muted.400'),
                    '--tw-prose-invert-code': theme('colors.muted.200'),
                    '--tw-prose-invert-pre-code': theme('colors.muted.200'),
                    '--tw-prose-invert-pre-bg': theme('colors.muted.800'),
                    '--tw-prose-invert-th-borders': theme('colors.muted.600'),
                    '--tw-prose-invert-td-borders': theme('colors.muted.700'),
                },
            },
            css: {
                h1: {
                    fontWeight: 700,
                },
                h2: {
                    fontWeight: 700,
                },
                h3: {
                    fontWeight: 500,
                },
                h4: {
                    fontWeight: 500,
                },
                li: {
                    fontSize: '1.15rem',
                    padding: '0.35rem 0',
                },
                em: {
                    fontSize: '1.1rem',
                    lineHeight: 1,
                },
                blockquote: {
                    fontSize: '1.1rem',
                    lineHeight: 1.4,
                    fontWeight: 500,
                    padding: '1.75rem',
                },
                pre: {
                    fontFamily: theme('fontFamily.mono'),
                },
                code: {
                    fontFamily: theme('fontFamily.mono'),
                    padding: '0.35rem',
                    fontWeight: 600,
                    fontSize: '0.95rem !important',
                },
            },
        }),
    },
};
