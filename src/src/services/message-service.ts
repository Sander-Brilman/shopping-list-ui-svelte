import { Notyf } from "notyf";

const notyf = new Notyf({
    types: [
        {
            className: "mysuccess",
            background: "var(--theme-background)",
            position: {
                x: "center",
                y: "bottom"
            },  
        }
    ]
})

class MessageService {


    showSuccess(message:string) {
        return notyf.open({
            className: "mysuccess",
            message: message,
            icon: `<i class="bi bi-check2-circle"></i>`,
            ripple: false
        })
    }

    showError(message:string) {
        return notyf.open({
            className: "mysuccess",
            message: message,
            icon: `<i class="bi bi-exclamation-triangle"></i>`,
            ripple: false
        })
    }

}


export const messageService = new MessageService()