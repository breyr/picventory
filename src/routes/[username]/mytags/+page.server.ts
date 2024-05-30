import type { UserData } from "$lib/customtypes";
import { adminDB } from "$lib/server/admin";
import { error, fail, type Actions } from "@sveltejs/kit";

export const actions: Actions = {
    default: async ({ locals, request, params }) => {
        const uid = locals.userID;
        const data = await request.formData();
        const tagNameToDelete = data.get('tagName');

        const userRef = adminDB.collection("users").doc(uid!);
        const { username, tags } = (await userRef.get()).data()! as UserData;

        const newTagsAfterDeletion = tags.filter(t => t !== tagNameToDelete);


        if (newTagsAfterDeletion.length == 0) {
            return fail(403, { message: 'Accounts need at least one tag' })
        }

        if (params.username !== username) {
            throw error(401, "unauthorized");
        }

        await userRef.update({
            tags: newTagsAfterDeletion
        });
    }
} satisfies Actions;
