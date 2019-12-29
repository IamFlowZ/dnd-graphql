export default abstract class BaseTypeDef {
    types: string
    queries: string
    mutations: string
    constructor(types: string, queries: string, mutations: string) {
        this.types = types
        this.queries = queries
        this.mutations = mutations
    }
    resolvers = {
        queries: {},
        mutations: {}
    }
}