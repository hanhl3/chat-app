import { query, mutation } from './_generated/server'
import { v } from 'convex/values'

export const getAllGroups = query({
    args: {},
    handler: async (ctx) => {
        const groups = await ctx.db.query('groups').collect()
        return groups
    },
})
export const getGroup = query({
    args: { id: v.id('groups') },
    handler: async (ctx, { id }) => {
        const groups = await ctx.db
            .query('groups')
            .filter((q) => q.eq(q.field('_id'), id))
            .unique()
        return groups
    },
})

export const createGroup = mutation({
    args: { description: v.string(), icon_url: v.string(), name: v.string() },
    handler: async ({ db }, args) => {
        await db.insert('groups', args)
    },
})
