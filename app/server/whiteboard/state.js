import { randomHex } from "../utilities";

export const connectedClientSockets = [];

export const connectedClientData = {
    userCount: 0,
    users: {}
};

export const addClient = client => {
    connectedClientSockets.push(client);
    connectedClientData.users[client.id] = {
        id: client.id,
        lines: [],
        colour: randomHex()
    }
    connectedClientData.userCount += 1;
}

export const getClientData = clientId => {
    return connectedClientData.users[clientId] || {}
}

export const addLineToClient = ({ clientId, lineData }) => {
    getClientData(clientId).lines.push(lineData);
}

export const resetData = () => {
    Object.entries(connectedClientData.users).map(([userId, user]) => {
        user.lines = []
    })
}