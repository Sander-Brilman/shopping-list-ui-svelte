import { apiClient } from "./api-client";

class ItemService {
    public async addNewItem(listId:string, name:string) {
        await apiClient.postRequest("/Item", {
            listId: listId,
            name: name
        });
    }

    public async getAllItemsInList(listId:string):Promise<ShoppingItem[] | null> {
        return (await apiClient.get<ShoppingItem[]>(`/List/${listId}/items/`)) ?? [];
    }

    public async setItemState(itemId:string, isChecked:boolean) {
        await apiClient.patchRequest(`/Item/${itemId}/set-state/`, { isChecked: isChecked });
    }

}

export const itemService = new ItemService();



export interface ShoppingItem {
    id:string;
    name:string;
    timesUsed:number;
    isChecked:boolean
}