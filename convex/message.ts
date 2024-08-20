import { query, mutation } from './_generated/server'
import { v } from 'convex/values'

export const getMessage = query({
    args: { chatId: v.id('groups') },
    handler: async (ctx, { chatId }) => {
        const messages = await ctx.db
            .query('message')
            .filter((q) => q.eq(q.field('group_id'), chatId))
            .collect()
        return Promise.all(
            messages.map(async (message) => {
                if (message.file) {
                    const url = await ctx.storage.getUrl(message.file)
                    if (url) return {
                        ...message,
                        file: url
                    }
                }
                return message
            })
        )
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
