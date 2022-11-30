import type {CodegenConfig} from '@graphql-codegen/cli'

const config: CodegenConfig = {
  schema: 'http://localhost:4242/graphql',
  documents: './src/**/*.ts',
  generates: {
    './types/generated.ts': {
      plugins: ['typescript', 'typescript-operations', 'typescript-apollo-angular']
    }
  }
}
export default config
