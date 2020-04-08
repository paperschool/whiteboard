import { randomHex } from "../utilities";

export const connectedClientSockets = [];

export const connectedClientData = {
    userCount: 0,
    users: {}
};

const getIp = client => client.request.connection.remoteAddress + ":" + client.request.connection.remotePort

const checkClientConnected = client => {
    // check client source address does not already exist
    return connectedClientSockets.reduce((exists, connectedClient) =>
        exists || getIp(connectedClient) === getIp(client),
        false
    );
}

export const addClient = client => {
    if (!checkClientConnected(client)) {
        console.log(`Client ${client.id.substring(0, 5)}... @ ${getIp(client)} Added!`)

        addClientSocket(client);
        addClientData(client);
    } else {
        console.log(`Client ${client.id.substring(0, 5)}... @ ${getIp(client)} Already Exists!`)
    }
}

export const addBotClient = ({ name = "Bot Client" }) => {
    addClientData({
        id: `${name}-${Date.now()}`
    })
}

const addClientSocket = client => {
    connectedClientSockets.push(client);
}

const addClientData = (client) => {

    connectedClientData.users[getIp(client)] = {
        id: client.id,
        ip: getIp(client),
        lines: [],
        colour: randomHex()
    }
    connectedClientData.userCount += 1;
}

export const getClientData = client => {
    return connectedClientData.users[getIp(client)] || {}
}

export const getSanitisedClientData = () => {
    let sanitisedData = {
        ...connectedClientData,
        users: {
            ...connectedClientData.users
        }
    }

    Object.entries(sanitisedData.users).forEach(([userName, userData], index) => {
        delete sanitisedData[userName]

        let newUserName = `USER-${index}`;
        sanitisedData[newUserName] = userData;
        delete sanitisedData[newUserName].ip

    })

    return sanitisedData;
}

export const addLineToClient = ({ client, lineData }) => {

    // validating line data
    if (typeof lineData !== "object" || lineData.length <= 0) {
        console.log(`Client ${client.id} Sending Poor Data.`)
        return false;
    }

    getClientData(client).lines.push(lineData);

    return true;
}

export const resetData = () => {
    Object.entries(connectedClientData.users).map(([userId, user]) => {
        console.log(`Purging user ${userId}`);
        user.lines = []
    })
}