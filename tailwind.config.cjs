/** @type {import('tailwindcss').Config} */
const withMT = require("@material-tailwind/react/utils/withMT");

module.exports = withMT({
    content: [
        "./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}",
        "*.{js,ts,jsx,tsx,mdx}",
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
                gray02: "#363F4D",
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
                h1: {
                    base: '2.25rem', // text-5xl (mobile)
                    md: '3.75rem',   // text-6xl (desktop)
                },
                h2: {
                    base: '1.875rem', // text-4xl (mobile)
                    md: '3rem',      // text-5xl (desktop)
                },
                h3: {
                    base: '1.5rem',  // text-3xl (mobile)
                    md: '2.25rem',   // text-4xl (desktop)
                },
                h4: {
                    base: '1.25rem', // text-2xl (mobile)
                    md: '1.875rem',  // text-3xl (desktop)
                },
                'body-large': ['1.125rem', { lineHeight: '1.5', fontWeight: '400' }], // text-lg
                'body-medium': ['1rem', { lineHeight: '1.5', fontWeight: '400' }],   // text-base
                'body-small': ['0.875rem', { lineHeight: '1.6', fontWeight: '400' }], // text-sm
                'body-extra-large': ['1.250rem', { lineHeight: '1.5', fontWeight: '400' }], // text-xl
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
                            color: theme("colors.gray02"),
                        },
                        h2: {
                            fontSize: theme("fontSize.h2.md"),
                            lineHeight: "1.3",
                            fontWeight: "400",
                            color: theme("colors.gray02"),
                        },
                        h3: {
                            fontSize: theme("fontSize.h3.md"),
                            lineHeight: "1.4",
                            fontWeight: "400",
                            color: theme("colors.gray02"),
                        },
                        h4: {
                            fontSize: theme("fontSize.h4.md"),
                            lineHeight: "1.4",
                            fontWeight: "400",
                            color: theme("colors.gray02"),
                        },
                        p: {
                            fontSize: theme("fontSize.body-extra-large[0]"),
                            lineHeight: theme("fontSize.body-extra-large[1].lineHeight"),
                            fontWeight: theme("fontSize.body-extra-large[1].fontWeight"),
                            color: theme("colors.gray02"),
                        },
                        li: {
                            fontSize: theme("fontSize.body-extra-large[0]"), // ✅ Ensure list items match body size
                            lineHeight: theme("fontSize.body-extra-large[1].lineHeight"),
                            fontWeight: theme("fontSize.body-extra-large[1].fontWeight"),
                            color: theme("colors.gray02"),
                        },
                        strong: {
                            color: theme("colors.gray02"),
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
    plugins: [
        require('@tailwindcss/typography'),
        function ({ addVariant, e }) {
            addVariant('safari', ({ modifySelectors, separator }) => {
                modifySelectors(({ className }) => {
                    return `@media not all and (min-resolution: 0.001dpcm) { @supports (-webkit-appearance: none) { .${e(`safari${separator}${className}`)} } }`;
                });
            });
        },
    ],
});