import * as signalR from "@microsoft/signalr";

const apiUrl:string = import.meta.env.VITE_API_URL;

export async function buildSignalRClient(hubName:string, callbacks:{[key: string]:(...args: any[]) => any}, onReconnected:()=>Promise<void>) {
    
    let connection = new signalR.HubConnectionBuilder()
        .withUrl(`${apiUrl}/${hubName}`)
        .configureLogging(signalR.LogLevel.Error)
        .withAutomaticReconnect()
        .build();

    for (const key in callbacks) {
        connection.on(key, callbacks[key]);
    }
    
    connection.onreconnected(async (_) => {
        console.info(`Reconnected to ${hubName}`);
        await onReconnected();
    });


    while (true) {
        try {
            connection.start();
            break;
        } catch (err) {
            await new Promise(resolve => setTimeout(resolve, 500));
        }
    }

    console.info(`connected to hub ${hubName}`);
    
    return connection;
}
