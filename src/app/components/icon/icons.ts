export const icons = Object.fromEntries(
    Object.entries(
        import.meta.globEager('./icons/*.svg', {assert: {type: 'raw'}})
    ).map(v => [v[0].replace(/.*\/|\.\w+$/g, ''), v[1]])
);
