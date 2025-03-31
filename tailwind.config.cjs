/** @type {import('tailwindcss').Config} */
const withMT = require("@material-tailwind/react/utils/withMT");

module.exports = withMT({
    content: [
        "./src/**/*.{astro,html,js,jsx,ts,tsx}",
        "./node_modules/@material-tailwind/react/components/**/*.{js,jsx,ts,tsx}",
        "./node_modules/@material-tailwind/react/theme/components/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: "#2DD1AC",
                gray02: "#363F4D",
                green01: "#2FAE94",
                green02: "#25BF97",
                green03: "#2FC79F",
                green04: "#2DD1AC",
                green05: "#5BD7BB",
                green06: "#8CD7C6",
                green07: "#DDF7F2",
                green08: "#E3F6F1",
                gray01: "#2A323F",
                gray03: "#444E5E",
                gray04: "#535D6E",
                gray05: "#808C9E",
                gray06: "#A9B1BE",
                gray07: "#D9DCE2",
                gray08: "#E8E9EA",
                gray09: "#EFF1F3",
            },
            fontFamily: {
                graphik: ['Graphik', 'sans-serif'],
            },
            fontSize: {
                h1: { base: '2.25rem', md: '3.75rem' },
                h2: { base: '1.875rem', md: '3rem' },
                h3: { base: '1.5rem', md: '2.25rem' },
                h4: { base: '1.25rem', md: '1.875rem' },
                'body-large': ['1.125rem', { lineHeight: '1.5', fontWeight: '400' }],
                'body-medium': ['1rem', { lineHeight: '1.5', fontWeight: '400' }],
                'body-small': ['0.875rem', { lineHeight: '1.6', fontWeight: '400' }],
                'body-extra-large': ['1.25rem', { lineHeight: '1.5', fontWeight: '400' }],
            },
            typography: ({ theme }) => ({
                DEFAULT: {
                    css: {
                        color: theme("colors.gray02"),
                        fontFamily: theme("fontFamily.graphik"),
                        h1: {
                            fontSize: theme("fontSize.h1.md"),
                            lineHeight: "1.3",
                            fontWeight: "400",
                        },
                        h2: {
                            fontSize: theme("fontSize.h2.md"),
                            lineHeight: "1.3",
                            fontWeight: "400",
                        },
                        h3: {
                            fontSize: theme("fontSize.h3.md"),
                            lineHeight: "1.4",
                            fontWeight: "400",
                        },
                        h4: {
                            fontSize: theme("fontSize.h4.md"),
                            lineHeight: "1.4",
                            fontWeight: "400",
                        },
                        p: {
                            fontSize: theme("fontSize.body-extra-large[0]"),
                            lineHeight: theme("fontSize.body-extra-large[1].lineHeight"),
                            fontWeight: theme("fontSize.body-extra-large[1].fontWeight"),
                        },
                        li: {
                            fontSize: theme("fontSize.body-extra-large[0]"),
                            lineHeight: theme("fontSize.body-extra-large[1].lineHeight"),
                            fontWeight: theme("fontSize.body-extra-large[1].fontWeight"),
                        },
                        strong: {
                            fontWeight: "700",
                        },
                        a: {
                            color: theme("colors.green03"),
                            textDecoration: "none",
                            fontWeight: "500",
                            "&:hover": {
                                color: theme("colors.green02"),
                                textDecoration: "underline",
                            },
                        },
                    },
                },
            }),
        },
    },
    plugins: [require('@tailwindcss/typography')],
});