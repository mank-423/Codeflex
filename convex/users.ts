import { v } from "convex/values"
import { mutation } from "./_generated/server"

export const syncUser = mutation({
    args: {
        name: v.string(),
        email: v.string(),
        clerkId: v.string(),
        image: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const exisitingUser = await ctx.db.query('users').filter(q => q.eq(q.field('clerkId'), args.clerkId)).first();

        if (exisitingUser) return;


        return await ctx.db.insert("users", {
            ...args,
        })
    }
})