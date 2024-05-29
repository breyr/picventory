import type { UserItem } from '$lib/customtypes';
import { adminDB } from '$lib/server/admin';
import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async ({ params, locals }) => {
    const uid = locals.userID;
    if (!uid) {
        throw redirect(301, "/");
    }

    // get item data form collection
    const itemDoc = await adminDB.collection("items").doc(params.itemId).get();
    const itemData = itemDoc.data() as UserItem;

    // check if the itemData belongs to that user
    if (itemData.uid !== uid) {
        throw error(401, "this item does not belong to you");
    }

    return {
        itemData
    }
}) satisfies PageServerLoad;