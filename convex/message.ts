import { query, mutation } from './_generated/server'
import { v } from 'convex/values'

export const getMessage = query({
    args: { chatId: v.id('groups') },
    handler: async (ctx, { chatId }) => {
        const groups = await ctx.db
            .query('message')
            .filter((q) => q.eq(q.field('group_id'), chatId))
            .collect()
        return groups
    },
})

export const sendMessage = mutation({
    args: {
        content: v.string(),
        group_id: v.id('groups'),
        user: v.string(),
        file: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        await ctx.db.insert('message', args)
    },
})
