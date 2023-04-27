import axios from "axios";

const service = axios.create({
    baseURL: process.env.API_URL,
});

export async function registerService(
    username: string,
    password: string,
    email: string,
    avatar: string
) {
    return await service.post("/register", { username, password, email, avatar }).catch(function (error) {
        if (error.response) return error.response.data;
    });
}


export async function loginService(username: string, password: string) {
    return await service.post("/login", { username, password }).catch(function (error) {
        if (error.response) return error.response.data;
    });
}

export async function getUsersService(id: string) {
    return await service.post("/get-all-user/" + id).catch(function (error) {
        if (error.response) return error.response.data;
    });
}

export async function addMessageService(
    from: string, to: string, message: string, image: string
) {
    return await service.post("add-message", {
        from,
        to,
        message,
        image
    }).catch(function (error) {
        if (error.response) return error.response.data;
    });
}

export async function getMessageService(
    from: string, to: string
) {
    return await service.post("get-message", {
        from,
        to,
    }).catch(function (error) {
        if (error.response) return error.response.data;
    });
}