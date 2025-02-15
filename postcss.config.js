export default {
  plugins: {
    'tailwindcss/nesting': {},
    tailwindcss: {},
    autoprefixer: {
      flexbox: 'no-2009',
      grid: 'autoplace'
    },
    ...(process.env.NODE_ENV === 'production'
      ? {
          'postcss-preset-env': {
            autoprefixer: {
              flexbox: 'no-2009',
              grid: 'autoplace'
            },
            stage: 3,
            features: {
              'custom-properties': false,
              'nesting-rules': false
            }
          },
          'cssnano': {
            preset: ['default', {
              discardComments: {
                removeAll: true,
              },
              normalizeWhitespace: true,
              minifyFontValues: true,
              minifyGradients: true,
              mergeRules: true,
              mergeLonghand: true,
              colormin: true,
              cssDeclarationSorter: true
            }]
          }
        }
      : {})
  }
}
