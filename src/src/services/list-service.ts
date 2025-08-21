import { apiClient } from "./api-client";
import { buildSignalRClient } from "./live-update-service.svelte";

class ShoppingListService {

    #onChangesCallbacks:((lists:ShoppingList[]) => void)[] = [];

    addOnChangesListener(callback:(lists:ShoppingList[]) => void) {
        this.#onChangesCallbacks.push(callback);
    }

    async deleteList(selectedList:ShoppingList) {
        await apiClient.deleteRequest(`/List/${selectedList.id}`);
    }

    #listsCache:ShoppingList[]|null = null;

    #isConnected = false;

    public async getAllLists(): Promise<ShoppingList[]> {

        if (this.#listsCache !== null) {
            return this.#listsCache;
        }

        this.#listsCache = await apiClient.get<ShoppingList[]>("/List");

        if (this.#listsCache == null) {
            return [];
        }

        if (this.#isConnected == false) {
            this.#isConnected = true;
            buildSignalRClient("ShoppingListHub", {
                OnListAdded: async (listName:string, listId:string) => {
                    this.#listsCache!.push({name: listName, id: listId, numberOfItems: 0});
                    this.#onChangesCallbacks.forEach(c => c(this.#listsCache ?? []));
                },
                OnListDeleted: async (listId:string) => {
                    this.#listsCache = this.#listsCache!.filter(l => l.id != listId);
                    this.#onChangesCallbacks.forEach(c => c(this.#listsCache ?? []));
                }},
                async () => {// on reconnected
                    this.#listsCache = await apiClient.get<ShoppingList[]>("/List");
                }
            );
        }

        return this.#listsCache;
    }

    public async createNewList(name:string) : Promise<NewlyCreatedShoppingListResponse | null> {
        return await apiClient.postRequest<NewlyCreatedShoppingListResponse>("/List", { name: name });
    } 

    public async getListNameByID(listId:string) {
        while (this.#listsCache == null) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }

        return this.#listsCache?.find(l => l.id == listId)?.name ?? "";
    }

}

export const listService = new ShoppingListService();


export interface ShoppingList {
    name: string;
    id: string;
    numberOfItems: number;
}

export interface NewlyCreatedShoppingListResponse {
    name:string;
    id:string;
}