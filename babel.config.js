module.exports = {
  presets: [
    ['@babel/preset-env', {
      targets: {
        node: 'current',
        browsers: [
          'last 2 versions',
          '> 1%',
          'not dead',
          'not ie 11'
        ]
      },
      modules: false,
      useBuiltIns: 'usage',
      corejs: 3,
      bugfixes: true,
      loose: true
    }],
    ['@babel/preset-react', {
      runtime: 'automatic',
      development: process.env.NODE_ENV === 'development'
    }],
    '@babel/preset-typescript'
  ],
  plugins: [
    process.env.NODE_ENV === 'production' && 'babel-plugin-transform-remove-console',
    ['@babel/plugin-transform-runtime', {
      corejs: 3,
      helpers: true,
      regenerator: true,
      useESModules: true
    }]
  ].filter(Boolean),
  env: {
    production: {
      plugins: [
        ['transform-react-remove-prop-types', {
          removeImport: true,
          ignoreFilenames: ['node_modules']
        }]
      ]
    }
  }
} 